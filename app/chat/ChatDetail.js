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
  TextInput,
  Modal
} from 'react-native';
import { reaction } from 'mobx'
import { GiftedChat, Composer, Send } from 'react-native-gifted-chat';
import Header from '../components/HomeNavigation';
import Constant from '../common/constants';
import ShareView from '../components/ShareView';
import { connect } from 'react-redux';
import UserDefaults from '../common/UserDefaults';
import Util from '../common/utils';
import OrderDetail from '../order/OrderDetail'
import ProposeDeal from '../order/ProposeDeal'
import CloseDeal from '../order/CloseDeal';

const screenW = Dimensions.get('window').width;
let int;
export default class ChatDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      order_status: this.props.order_status,
      show: false
    };
    this.onSend = this.onSend.bind(this);
  }

  componentWillMount() {
    this.refreshmessage();
    int = setInterval(this.refreshmessage.bind(this),5000);
  }
    //
    //let ws = new WebSocket('ws://' + Constant.url.SERV_API_ADDR + ':' + '3001' + '/websocket');
  async refreshmessage() {
    const { feed } = this.props;
    let URL = `http://` + Constant.url.IMG_SERV_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_CHAT + `${global.user.authentication_token}&deal_id=${feed.deal_id}`;
    Util.get(URL, (response) => {
      let messages = []
      JSON.parse(response.messages).forEach(function (value) {
        let message = {
          _id: value.id,
          text: value.chat_content,
          createdAt: value.created_at, //created_at:2017-04-13T07:30:41.000Z
          user: {
            _id: value.user_id,
            name: value.name,
            avatar: value.avatar,
          },
        }
        messages.push(message);

      });
      this.setState({ "messages": messages });
    }, (error) => {
      console.log('Fetch category list error: ' + error);
    });
    this.setState({
      order_status: this.props.feed.status,
    });

  }

    clickJump() {
    const { navigator } = this.props;
    const { feed } = this.props;
    if (navigator) {
      if(this.state.order_status =='00A'){
        navigator.push({　　//navigator.push 传入name和你想要跳的组件页面
          name: "ProposeDeal",
          component: ProposeDeal,
          passProps: {feed}
        });
      }
      if(this.state.order_status =='00B'){
        navigator.push({　　//navigator.push 传入name和你想要跳的组件页面
          name: "OrderDetail",
          component: OrderDetail,
          passProps: {feed}
        });
      }
      if(this.state.order_status =='00C'){
        navigator.push({　　//navigator.push 传入name和你想要跳的组件页面
          name: "CloseDeal",
          component: CloseDeal,
          passProps: {feed}
        });
      }
    }
  }

  onSend(messages = []) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });

    this.chatSave(messages)
  }

  renderComposer(props){
    return (
      <Composer
        {...props}
         placeholder={'请输入'}
      />
    );
  }
  renderSend(props){
    return (
      <Send
        {...props}
         label={'发送'}
      />
    );
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
            user_id: global.user.id,
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
      <View style={{ flex: 1, backgroundColor: '#EEEEEE' }}>
        <Header
          leftIconAction={() => {
            clearInterval(int);
            this.props.navigator.pop()}}
          title={feed.offer_user_id == global.user.id?feed.request_user:feed.offer_user}
          leftIcon={require('../resource/w-back.png')}
          rightIcon={{uri:feed.offer_user_id == global.user.id?feed.request_user_avatar:feed.offer_user_avatar} }
          rightIconSize={32}
          rightIconAction={() => this.setState({show: true})}
        />
        <View style={[styles.cardImageContent]}>
          <TouchableOpacity onPress={this.clickJump.bind(this)} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10, backgroundColor: 'white' }}>
          <Image source={require('../resource/b-xuqiu.png')} />
          {
            this.state.order_status =='00A'? 
            <Text style={{ fontSize: 16, color: 'black', marginLeft: 15, width: 260 }}>未提出交易条件</Text>:<Text></Text>
          }
          {
            this.state.order_status =='00B'? 
            <Text style={{ fontSize: 16, color: 'black', marginLeft: 15 }}>已提出交易条件</Text>:<Text></Text>
          }
          {
            this.state.order_status =='00C'? 
            <Text style={{ fontSize: 16, color: 'black', marginLeft: 15 }}>交易达成！</Text>:<Text></Text>
          }
          <Image source={require('../resource/g_chevron right.png')} style={{}}/>
         </TouchableOpacity>
          <GiftedChat
            messages={this.state.messages}
            onSend={this.onSend}
            user={{
              _id: global.user.id
            }}
            renderComposer ={this.renderComposer }
            renderSend={this.renderSend}
          />
        </View>
        <Modal
          animationType='slide'
          transparent={true}
          visible={this.state.show}
          onShow={() => { }}
          onRequestClose={() => { }}>
          <View style={styles.modal}>
            <TouchableOpacity style={styles.item}>
              <Text style={styles.text}>查看TA的个人信息</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.item}>
              <Text  style={styles.text}>查看TA的需求(服务)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.item, {flexDirection: 'row', justifyContent: 'space-between', paddingTop: 16}]}>
              <Text  style={styles.text}>举报TA</Text>
              <Text style={{fontSize: 14, color: '#CCCCCC', lineHeight: 20}}>已举报</Text>
            </TouchableOpacity>
            <View style={{height: 0.5, backgroundColor: 'rgba(237,237,237,1)'}}></View>
            <TouchableOpacity onPress={() => this.setState({show: false})} style={{alignItems: 'center', justifyContent: 'center', height: 56}}>
              <Text style={styles.text}>取消</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  cardImageContent: {
    height: Constant.window.height - (Platform.OS === 'ios' ? 64 : 50) - 44,
    width: Constant.window.width,
    backgroundColor: global.gColors.bgColor,
    top: Platform.OS === 'ios' ? 64 : 50,
    bottom: 44,
    position: 'absolute'
  },
  listView: {
    flex: 1,
    backgroundColor:  global.gColors.bgColor,
  },
  loadingContainer: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  modal: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    marginTop: 350
  },
  item: {
    height: 56,
    justifyContent: 'center'
  },
  text: {
    fontSize: 16,
    color: 'black'
  }
})
