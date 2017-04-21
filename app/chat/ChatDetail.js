import React, { Component } from 'react';
import { observer } from 'mobx-react/native'
import {
  View,
  StyleSheet,
  WebView,
  Image,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
  Platform,
  Dimensions,
  TextInput
} from 'react-native';
import { reaction } from 'mobx'
import { GiftedChat } from 'react-native-gifted-chat';
import Header from '../components/HomeNavigation';
import Constant from '../common/constants';
import ShareView from '../components/ShareView';
import { connect } from 'react-redux';
import UserDefaults from '../common/UserDefaults';
import Util from '../common/utils';
import OrderDetail from '../order/OrderDetail'

const screenW = Dimensions.get('window').width;

export default class ChatDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      messages: []
    };
    this.onSend = this.onSend.bind(this);
  }

  clickJump() {
    const { navigator } = this.props;
    if (navigator) {
      navigator.push({　　//navigator.push 传入name和你想要跳的组件页面
        name: "OrderDetail",
        component: OrderDetail,
      });
    }
  }

  componentWillMount() {
    const { feed } = this.props;
    let URL = `http://` + Constant.url.IMG_SERV_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_CHAT + `${global.user.authentication_token}&deal_id=${feed.deal_id}`;
    Util.get(URL, (response) => {
      let messages = []
      JSON.parse(response.messages).forEach(function (value) {
        let message = {
          _id: value.id,
          text: value.chat_content,
          createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)), //created_at:2017-04-13T07:30:41.000Z
          user: {
            _id: value.user_id,
            name: value.name,
            avatar: value.avatar,
          },
        }
        messages.push(message);

      });
      this.setState({ "messages": messages });
      console.log("57:" + JSON.stringify(this.state.messages))
    }, (error) => {
      console.log('Fetch category list error: ' + error);
    });


  }

  onSend(messages = []) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });

    this.chatSave(messages)
  }


  async chatSave(messages) {
    let chat_content = "";
    if (messages.length > 0) {
      chat_content = messages[0].text
    }

    const { feed } = this.props;
    try {
      let URL = `http://` + Constant.url.IMG_SERV_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_CHAT + `${global.user.authentication_token}`;
      let response = await fetch(URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          chat: {
            deal_id: feed.deal_id,
            chat_content: chat_content,
            user_id: feed.offer_user_id,
            catalog: 2
          }
        })
      });

      let res = await response.text();
      if (response.status >= 200 && response.status < 300) {
        console.log("line:99");
      } else {
        let error = res;
        throw error;
      }
    } catch (error) {
      console.log("error " + error);
    }
  }

  render() {
    const { feed } = this.props;

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <Header
          leftIconAction={() => this.props.navigator.pop()}
          title={feed.offer_user}
          leftIcon={require('../resource/ic_back_dark.png')}
          rightIcon={require('../resource/user_default_image.jpg')}
          rightIconSize={26}
        />
        <View style={[styles.cardImageContent]}>
          <TouchableOpacity onPress={this.clickJump.bind(this)} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10 }}>
          <Image source={require('../resource/icon_phone.png')} />
          <Text style={{ fontSize: 16, color: 'black' }}>No deals have been proposed yet</Text>
         </TouchableOpacity>
          <GiftedChat
            messages={this.state.messages}
            onSend={this.onSend}
            user={{
              _id: feed.request_user_id
            }}
          />
        </View>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  cardImageContent: {
    height: Constant.window.height - (Platform.OS === 'ios' ? 64 : 50) - 44,
    width: Constant.window.width,
    backgroundColor: '#f5f5f5',
    top: Platform.OS === 'ios' ? 64 : 50,
    bottom: 44,
    position: 'absolute'
  },
  listView: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  loadingContainer: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  }
})
