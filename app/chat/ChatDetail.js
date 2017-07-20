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
import { GiftedChat, Composer, Send, Bubble, Message, Avatar } from 'react-native-gifted-chat';
import Header from '../components/HomeNavigation';
import Constant from '../common/constants';
import { connect } from 'react-redux';
import UserDefaults from '../common/UserDefaults';
import Util from '../common/utils';
import OrderDetail from '../order/OrderDetail'
import ProposeDeal from '../order/ProposeDeal'
import CloseDeal from '../order/CloseDeal';
import Report from '../sys/others/report';
import Me from '../me/index';
import TabBarView from '../containers/TabBarView';
const screenW = Dimensions.get('window').width;
let int;
export default class ChatDetail extends Component {
/*两种情况：
 *由聊天列表进入时，不带newChat参数，左上角返回键退出到聊天列表
 *由初次联系跳转至聊天界面时，带newChat参数，左上角返回键退出到首页
 */
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      order_status: this.props.order_status,
      show: false,
      isReported:this.props.isReported
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
  /*调整到订单流程*/
  clickJump() {
    const { navigator } = this.props;
    const { feed } = this.props;
    if (navigator) {
      if(this.state.order_status == Constant.orderStatus.INQUIRIED){
        navigator.push({　　//navigator.push 传入name和你想要跳的组件页面
          name: "ProposeDeal",
          component: ProposeDeal,
          passProps: {feed}
        });
      }
      if(this.state.order_status == Constant.orderStatus.OFFERED){
        navigator.push({　　//navigator.push 传入name和你想要跳的组件页面
          name: "OrderDetail",
          component: OrderDetail,
          passProps: {feed}
        });
      }
      if(this.state.order_status == Constant.orderStatus.CONFIRMED){
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

  renderBubble(props) { return ( <Bubble {...props} 
      wrapperStyle={{
          left: {
            backgroundColor: '#fff',
          },
          right: {
            backgroundColor: '#FFC400'
          }
        }} />
  )}
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
    let obj = {};
    obj.id = feed.offer_user_id == global.user.id?feed.request_user_id:feed.offer_user_id;
    obj.type = "user";
    return (
      <View style={{ flex: 1, backgroundColor: '#EEEEEE' }}>
        <Header
          leftIconAction={() => {
            clearInterval(int);
            if(this.props.newChat){this.props.navigator.resetTo({component:TabBarView})}
            else{this.props.navigator.pop()}
            }}
          title={feed.offer_user_id == global.user.id?feed.request_user:feed.offer_user}
          leftIcon={require('../resource/w-back.png')}
          rightIcon={{uri:feed.offer_user_id == global.user.id?feed.request_user_avatar:feed.offer_user_avatar} }
          rightIconSize={30}
          rightIconAction={() => this.setState({show: true})}
          rightIconRadius={300}
        />
        <View style={[styles.cardImageContent]}>
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
            <GiftedChat
            messages={this.state.messages}
            onSend={this.onSend}
            user={{
              _id: global.user.id
            }}
            renderComposer ={this.renderComposer }
            renderSend={this.renderSend}
            renderBubble ={this.renderBubble}
            renderMessage={props => <CustomMessage {...props} />}
          />  
        </View>

        <Modal
          animationType='slide'
          transparent={true}
          visible={this.state.show}
          onShow={() => { }}
          onRequestClose={() => { }}>
          <View style={styles.container}> 
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
    )
  }
}
class CustomMessage extends Message {
  renderAvatar() {
    return (
      <Avatar {...this.getInnerComponentProps()} />
    );
  }
}

const styles = StyleSheet.create({
  container:{  
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
  cardImageContent: {
   // height: Constant.window.height - (Platform.OS === 'ios' ? 64 : 50)-100,
    width: Constant.window.width,
    backgroundColor: global.gColors.bgColor,
    top: Platform.OS === 'ios' ? 64 : 50,
    bottom: 1,
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
})
