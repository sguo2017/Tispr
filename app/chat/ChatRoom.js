import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Platform, 
  Dimensions, 
  Text, 
  Navigator,
  AppState, 
  Alert
} from 'react-native';

import GiftedMessenger from 'react-native-gifted-messenger';
import NavigationExperimental from 'react-native-deprecated-custom-components';
import Constant from '../common/constants';
import Util from '../common/utils';
import Header from '../components/HomeNavigation';
import TabBarView from '../containers/TabBarView';
// You need to set `window.navigator` to something in order to use the socket.io
// client. You have to do it like this in order to use the debugger because the
// debugger in React Native runs in a webworker and only has a getter method for
// `window.navigator`.
// Remove this after socket.io releases with this patch
// https://github.com/socketio/engine.io-parser/pull/55
if (window.navigator && Object.keys(window.navigator).length == 0) {
  window = Object.assign(window, { navigator: { userAgent: 'ReactNative' }});
}

import io from 'socket.io-client/socket.io';

var STATUS_BAR_HEIGHT = NavigationExperimental.Navigator.NavigationBar.Styles.General.StatusBarHeight;

export default class ChatRoom extends Component {
  constructor(props) {
    super(props);

    const socketServer = 'http://'+Constant.url.SERV_API_ADDR+':' + Constant.url.SERV_API_SOCKET_PORT;
    
    const options = {transports: ['websocket'], forceNew: true};
    this.socket = io(socketServer, options);

    this._messages = [];
    this.senderId = global.user.id;
    this.senderEmail = global.user.name;
    this.recipientId = global.user.id == this.props.feed.request_user_id?this.props.feed.offer_user_id :this.props.feed.request_user_id;
    this.recipientEmail = global.user.id == this.props.feed.request_user_id?this.props.feed.offer_user:this.props.feed.request_user;
    this.state = {
      messages: this._messages,
      isLoadingEarlierMessages: false,
      allLoaded: false,
      chatRoomId: null,
      page: 0
    };
  }
  
  componentDidMount() {
    this._getChatRoom();

    this.socket.emit('add user', this.senderId, this.props.feed.id);

    // Socket events
    this.socket.on('connect', () => {
      console.log('connected to socket.io server');
    });

    this.socket.on('disconnect', () => {
      console.log('disconnected from socket.io server');
    });

    var that = this;
    this.socket.on('new message', function (data) {
      console.log('new message', JSON.stringify(data));
      that.handleReceive({
        text: data.message,
        name: this.recipientEmail,
        image: null,
        position: 'left',
        date: new Date(),
        uniqueId: Math.round(Math.random() * 10000),
      });
    });

  }

  componentWillUnmount() {}

  _getChatRoom = async() => {
      let t = global.user.authentication_token

      let data = {
        sender_id: this.senderId,
        recipient_id: this.recipientId,
        deal_id: this.props.feed.id
      }
      let url = 'http://'+Constant.url.SERV_API_ADDR+':'+Constant.url.SERV_API_PORT +'/api/chats/chat_rooms?token='+t;
      Util.post(url, data, (response)=>{
        let _chatRoomId = response.chat_room_id;
        console.log('chatRoomId', _chatRoomId);
        this.setState({chatRoomId: _chatRoomId});
        this._getChatMessages();
      },this.props.navigator);
  }

  _getChatMessages = async() => {
    this.setState({
        isLoadingEarlierMessages: true,
        page: this.state.page + 1
      });
    let t = global.user.authentication_token;
    let url = 'http://'+Constant.url.SERV_API_ADDR+':'+Constant.url.SERV_API_PORT +'/api/chats/chat_rooms/'+this.state.chatRoomId+'/chat_messages/page/'+this.state.page+'?token='+t;
    Util.get(url, (response)=>
      {
        if (response.chat_messages.length == 0) {
          this.setState({
            isLoadingEarlierMessages: false, // hide the loader
            allLoaded: true, // hide the `Load earlier messages` button
          });
          console.log("没有更多消息了")
          return;
        }

        //let chatMessages = response;
        let chatMessages = response.chat_messages.reverse();
        console.log('chat messages'+ chatMessages);

        let earlierMessages = [];

        for (let msg of chatMessages) {
          // if (this._messages.find( m => m.uniqueId === msg.chat_message_id )) {
          //   continue;
          // }
          earlierMessages.push({
            text: msg.message,
            name: (msg.user_id == this.senderId) ? this.senderEmail : this.recipientEmail,
            image: null,
            position: (msg.user_id == this.senderId) ? 'right' : 'left',
            date: new Date(msg.created_at),
            uniqueId: msg.id
          });
        }

        setTimeout(() => {
          this.setState({
            isLoadingEarlierMessages: false,
          });
          this.setMessages(earlierMessages.concat(this._messages));
        }, 500);
      },
      (error)=> {
        console.error("_getChatMessages error: "+error);
      }
    );
  }

  setMessages(messages) {
    this._messages = messages;
    
    // append the message
    this.setState({
      messages: messages,
    });
  }

  handleSend(message = {}) {
    message.uniqueId = Math.round(Math.random() * 10000); // simulating server-side unique id generation
    this.setMessages(this._messages.concat(message));

    this.socket.emit('new message', {
      message: message.text,
      chatRoomId: this.state.chatRoomId,
      senderId: this.senderId,
      recipientId: this.recipientId,
      deal_id: this.props.feed.id
    });
  }

  handleReceive(message = {}) {
    // make sure that your message contains :
    // text, name, image, position: 'left', date, uniqueId
    this.setMessages(this._messages.concat(message));
  }

  render() {
    const { feed } = this.props;
    let obj = {};
    obj.id = feed.offer_user_id == global.user.id?feed.request_user_id:feed.offer_user_id;
    obj.type = "user";
    return (
      <View style={styles.container}>
        <Header
          leftIconAction={() => {this.props.navigator.pop()}}
          title={feed.offer_user_id == global.user.id?feed.request_user:feed.offer_user}
          leftIcon={require('../resource/w-back.png')}
          rightIcon={{uri:feed.offer_user_id == global.user.id?feed.request_user_avatar:feed.offer_user_avatar} }
          rightIconSize={32}
          rightIconAction={() => this.setState({show: true})}
          rightIconRadius={300}
        />
        <GiftedMessenger
          ref={(c) => this._GiftedMessenger = c}

          autoFocus={false}
          blurOnSubmit={true}
          submitOnReturn={true}
          keyboardShouldPersistTaps="never"
          maxHeight={Dimensions.get('window').height - NavigationExperimental.Navigator.NavigationBar.Styles.General.NavBarHeight - STATUS_BAR_HEIGHT}

          messages={this.state.messages}
          handleSend={this.handleSend.bind(this)}

          loadEarlierMessagesButton={!this.state.allLoaded}
          isLoadingEarlierMessages={this.state.isLoadingEarlierMessages}
          onLoadEarlierMessages={this._getChatMessages.bind(this)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});