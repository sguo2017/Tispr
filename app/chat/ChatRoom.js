import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform, 
  Dimensions, 
  Text, 
  Navigator,
  AppState, 
  Alert,
  Image,
  Modal,
  Linking
} from 'react-native';

import GiftedMessenger from 'react-native-gifted-messenger';
import NavigationExperimental from 'react-native-deprecated-custom-components';
import Constant from '../common/constants';
import Util from '../common/utils';
import Header from '../components/HomeNavigation';
import TabBarView from '../containers/TabBarView';
import OrderDetail from '../order/OrderDetail'
import ProposeDeal from '../order/ProposeDeal'
import CloseDeal from '../order/CloseDeal';
import Report from '../sys/others/report';
import Me from '../me/index';
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
    this.senderName = global.user.name;
    this.senderAvatar = global.user.avatar;
    this.recipientPhoneNum = global.user.id == this.props.feed.request_user_id?this.props.feed.offer_user_num :this.props.feed.request_user_num;
    this.recipientId = global.user.id == this.props.feed.request_user_id?this.props.feed.offer_user_id :this.props.feed.request_user_id;
    this.recipientName = global.user.id == this.props.feed.request_user_id?this.props.feed.offer_user:this.props.feed.request_user;
    this.recipientAvatar = global.user.id == this.props.feed.request_user_id?this.props.feed.offer_user_avatar :this.props.feed.request_user_avatar;
    this.state = {
      messages: this._messages,
      isLoadingEarlierMessages: false,
      allLoaded: false,
      chatRoomId: null,
      page: 0,
      order_status: this.props.feed.status,
      show: false,
      isReported:this.props.feed.is_reported
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
        name: this.recipientName,
        image: null,
        position: 'left',
        date: new Date(),
        uniqueId: Math.round(Math.random() * 10000),
      });
    });

  }

  componentWillUnmount() {}

  /*调整到订单流程*/
  clickJump() {
    const { navigator } = this.props;
    const { feed } = this.props;
    if (navigator) {
      if(this.state.order_status == Constant.orderStatus.INQUIRIED){
        navigator.push({　　//navigator.push 传入name和你想要跳的组件页面
          name: "ProposeDeal",
          component: ProposeDeal,
          passProps: {feed, chatRoomId: this.state.chatRoomId}
        });
      }
      if(this.state.order_status == Constant.orderStatus.OFFERED){
        navigator.push({　　//navigator.push 传入name和你想要跳的组件页面
          name: "OrderDetail",
          component: OrderDetail,
          passProps: {feed, chatRoomId: this.state.chatRoomId}
        });
      }
      if(this.state.order_status == Constant.orderStatus.CONFIRMED){
        navigator.push({　　//navigator.push 传入name和你想要跳的组件页面
          name: "CloseDeal",
          component: CloseDeal,
          passProps: {feed, chatRoomId: this.state.chatRoomId}
        });
      }
    }
  }

   /*查看对方信息*/
  jumpInfo(id){
    const { navigator } = this.props;
    this.setState({
      show: false
    })
    if (navigator) {
      navigator.push({　　//navigator.push 传入name和你想要跳的组件页面
          component: Me,
          passProps: {
            isBrowseMode: true,
            close: () => {
              this.props.navigator.pop();
            },
            id: id,
          }
        });
    }
  }
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
            image:(msg.user_id == this.senderId) ? this.senderAvatar : this.recipientAvatar,
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
      messages: this._messages,
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
    message.image = this.recipientAvatar
    // make sure that your message contains :
    // text, name, image, position: 'left', date, uniqueId
    this.setMessages(this._messages.concat(message));
  }
  clickCall = () => {
    let phoneNum = this.recipientPhoneNum;
    let username = this.recipientName;
    Linking.canOpenURL(`tel:${phoneNum}`).then(supported => {
      if (!supported) {
        Alert.alert(
          '提示',
          '该设备暂不支持拨打功能',
          [
            { text: '确定', onPress: null },
          ]
        )
      } else {
        Alert.alert(
          null,
          `是否呼叫${username}`,
          [
            { text: '否', onPress: null },
            { text: '是', onPress: () => {Linking.openURL(`tel:${phoneNum}`)} },
          ]
        )
      }
    }).catch(err => {
      Alert.alert(
        null,
        '拨打出错,请重试',
        [
          { text: '确定', onPress: null },
        ]
      );
    });
  }
  render() {
    const { feed } = this.props;
    let obj = {};
    obj.id = feed.offer_user_id == global.user.id?feed.request_user_id:feed.offer_user_id;
    obj.type = "user";
    return (
      <View style={styles.container}>
        <Header
          leftIconAction={() => {
            if (this.props.newChat) {
              this.props.navigator.resetTo({ component: TabBarView, passProps: { initialPage: 3 } });
            } else{
              this.props.navigator.pop()
            }}}
          title={feed.offer_user_id == global.user.id?feed.request_user:feed.offer_user}
          leftIcon={require('../resource/w-back.png')}
          rightIcon={{uri:feed.offer_user_id == global.user.id?feed.request_user_avatar:feed.offer_user_avatar} }
          rightIconSize={32}
          rightIconAction={() => this.setState({show: true})}
          rightIconRadius={300}
        />
        <TouchableOpacity onPress={this.clickJump.bind(this)} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10, backgroundColor: 'white' }}>
          <Image source={require('../resource/b-xuqiu.png')} />
          {
            this.state.order_status == Constant.orderStatus.INQUIRIED? 
            <Text style={{ fontSize: 16, color: 'black', marginLeft: 15, width: 260 }}>未提出交易条件</Text>:<Text></Text>
          }
          {
            this.state.order_status == Constant.orderStatus.OFFERED? 
            <Text style={{ fontSize: 16, color: 'black', marginLeft: 15 }}>已提出交易条件</Text>:<Text></Text>
          }
          {
            this.state.order_status == Constant.orderStatus.CONFIRMED? 
            <Text style={{ fontSize: 16, color: 'black', marginLeft: 15 }}>交易达成！</Text>:<Text></Text>
          }
          <Image source={require('../resource/g_chevron right.png')} style={{}}/>
         </TouchableOpacity>
        <GiftedMessenger
          ref={(c) => this._GiftedMessenger = c}

          autoFocus={false}
          blurOnSubmit={true}
          submitOnReturn={true}
          keyboardShouldPersistTaps="never"
          maxHeight={Dimensions.get('window').height - NavigationExperimental.Navigator.NavigationBar.Styles.General.NavBarHeight - STATUS_BAR_HEIGHT-60}
          forceRenderImage = {true}
          messages={this.state.messages}
          handleSend={this.handleSend.bind(this)}
          dateLocale= 'zh-cn'
          sendButtonText = '发送'
          placeholder = '新消息'
          textInputRightIcon = {require('../resource/y-call.png')}
          textInputLeftIcon = {require('../resource/y-ico-add.png')}
          textInputRightIconAction = {this.clickCall.bind(this)}
          textInputLeftIconAction = {()=>{console.log("press left button")}}
          loadEarlierMessagesButtonText = '查看更早的消息'
          loadEarlierMessagesButton={!this.state.allLoaded}
          isLoadingEarlierMessages={this.state.isLoadingEarlierMessages}
          onLoadEarlierMessages={this._getChatMessages.bind(this)}
          senderName = {global.user.name}
          senderImage = {this.senderAvatar}
        />

        <Modal
          animationType='slide'
          transparent={true}
          visible={this.state.show}
          onShow={() => { }}
          onRequestClose={() => { }}>
          <View style={styles.modalContainer}> 
            <View style={styles.modal}>
              <View style={{ borderRadius: 16, backgroundColor: 'white',  marginBottom: 6}}>
                <TouchableOpacity 
                    style={[styles.modalItem, { justifyContent: 'center', alignItems: 'center', }]}
                    onPress={this.jumpInfo.bind(this, obj.id)}
                >
                    <Text style={styles.text}>查看TA的个人信息</Text>
                </TouchableOpacity>
                <View style={{height: 0.5, backgroundColor: 'rgba(237,237,237,1)'}}></View>
                <TouchableOpacity 
                    style={[styles.modalItem, { justifyContent: 'center', alignItems: 'center',}]}
                    onPress={this.jumpInfo.bind(this, obj.id)}
                >
                    <Text  style={styles.text}>查看TA的需求(服务)</Text>
                </TouchableOpacity>
                <View style={{height: 0.5, backgroundColor: 'rgba(237,237,237,1)'}}></View>
                {
                  this.state.isReported?
                  <View style={[styles.modalItem, {justifyContent: 'center', alignItems: 'center' }]}>
                      <Text style={{ fontSize: 14, lineHeight: 20 }}>已举报</Text>
                  </View>:
                  <TouchableOpacity 
                    style={[styles.modalItem, { justifyContent: 'center', alignItems: 'center',}]}
                    onPress = {()=> {
                      this.setState({show: false});
                      let getData = (a) => {this.setState({isReported: a})}
                      this.props.navigator.push({component:Report,passProps:{obj, getData}})
                    }}
                  >
                      <Text  style={styles.text}>举报TA</Text>
                  </TouchableOpacity>
                }
              </View>
                
              <TouchableOpacity
                  onPress={() => this.setState({show: false})}
                  style={{alignItems: 'center', justifyContent: 'center', borderRadius: 16, backgroundColor: 'white', height: 56}}>
                  <Text style={styles.text}>取消</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalContainer:{  
    flex:1,  
    backgroundColor: 'rgba(0, 0, 0, 0.25)',  
    position: 'absolute',  
    top: 0,  
    bottom: 0,  
    left: 0,  
    right: 0,  
    justifyContent:'center',  
    alignItems:'center'  
  },  
  modal: {
      marginTop: 200,
      width: global.gScreen.width,
      position: 'absolute',
      bottom: 0,
      height: 240, 
      borderTopWidth: 0,
      paddingHorizontal: 8, 
      backgroundColor: 'transparent'
  },
  item: {
    height: 56,
    justifyContent: 'center'
  },
  text: {
    fontSize: 16,
    color: 'black'
  },
  modalItem: {
      height: 56,
      justifyContent: 'center',
      marginHorizontal: 22
  },
});