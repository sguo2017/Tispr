import React, {Component} from 'react';
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
    Alert,
    Modal
} from 'react-native';
import Header from '../components/HomeNavigation';
import Constant from '../common/constants';
import CloseDeal from './CloseDeal';
import ProposeDeal from './ProposeDeal'
import Util from '../common/utils'
import OrderConfirm from './OrderConfirm'
const screenW = Dimensions.get('window').width;

export default class OrderDetail extends Component {
    constructor(props) {  
        super(props);  
        this.state = {  
        show:false,  
        };  
    }
     _leftButtonClick() {  
      const { navigator } = this.props;
      const { feed } = this.props;
        if (navigator) {
        navigator.push({　　//navigator.push 传入name和你想要跳的组件页面
            name: "ProposeDeal",
            component: ProposeDeal,
            passProps: {feed}
        });
        }
    }  
    _rightButtonClick() {
        let order_id = this.props.feed.id;
        this.props.navigator.push({
            component: OrderConfirm,
            passProps: {order_id}
        })
    }  
    
    async _createChat(_deal_id){
        let URL = 'http:\/\/' + Constant.url.IMG_SERV_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_CHAT + global.user.authentication_token;
        let data = {
            chat: {
                deal_id: _deal_id,
                chat_content: "我同意了您提出的价格",
                user_id: global.user.id,
                catalog: 2
            }
        }
        Util.post(URL, data, ()=>{console.log("创建会话成功")}, this.props.navigator)
    }
    render(){
        const { feed } = this.props;
        return (
            <View>
                <Header
                        leftIconAction={() => this.props.navigator.pop()}
                        title={'交易条件'}
                        leftIcon={require('../resource/w-back.png')}
                    />
                <View style={[styles.cardImageContent]}>
                    <ScrollView
                            bounces={false}
                            showsVerticalScrollIndicator={false}
                            removeClippedSubviews={true}
                            contentContainerStyle={{backgroundColor: 'white'}}
                    >
                        <View style={{flexDirection:'row', justifyContent:'flex-start', alignItems:'center',padding:10, width: screenW}}>
                            <Image style={{width: 40, height: 40, borderRadius:20}} defaultSource={require('../resource/user_default_image.png')} source={{uri: feed.offer_user_avatar}}/>
                            <View style={{paddingLeft: 10, width: 280}}>
                                <Text style={{fontSize:16, color:'black'}}>{feed.offer_user}</Text>
                                <Text style={{fontSize: 14}}>{feed.serv}</Text>
                            </View>
                            {
                                 !(feed.bidder== feed.offer_user_id) ?
                                <View style={{flexDirection:'row', width:20, justifyContent:'flex-end', alignItems: 'center'}}>
                                    <Image style={{}} source={require('../resource/y-check-r.png')}/>
                                </View> :
                                <View></View>
                            }
                        </View>
                        <View style={{flexDirection:'row', justifyContent:'flex-start', alignItems:'center',padding:10, width: screenW,backgroundColor:'white'}}>
                            <Image style={{width: 40, height: 40, borderRadius:20}} defaultSource={require('../resource/user_default_image.png')} source={{uri: feed.request_user_avatar}}/>
                            <View style={{paddingLeft: 10, width: 280}}>
                                <Text style={{fontSize:16, color:'black'}}>{feed.request_user}</Text>
                                <Text style={{fontSize: 14}}>{feed.lately_chat_content}</Text>
                            </View>
                            {
                                 !(feed.bidder== feed.request_user_id) ?
                                <View style={{flexDirection:'row',width:20, justifyContent:'flex-end', alignItems: 'center'}}>
                                    <Image style={{}} source={require('../resource/y-check-r.png')}/>
                                </View>:
                                <View></View>
                            }
                        </View>
                        {/*<View style={{flexDirection:'row',paddingTop: 30, paddingLeft: 10,}}>
                            <Text style={{fontSize: 16, color:'black' }}>
                               {feed.lately_chat_content}
                            </Text>
                        </View>*/}
                    </ScrollView>
                    {
                        global.user.id == feed.signature?
                        <View>
                         <TouchableOpacity
                            activeOpacity={0.75}
                            style={{flexDirection: 'row',alignItems: 'center',
                                    justifyContent: 'center',
                                    borderTopColor: '#ccc',
                                    position: 'absolute',
                                    bottom: 5,
                                    backgroundColor: global.gColors.themeColor,width: screenW*0.5,height:44}}
                            onPress={this._leftButtonClick.bind(this)}
                        >
                           
                            <Text style={{ fontSize: 16, color: '#FFF' }}>
                            提出新条件
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.75}
                            style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'center',borderTopColor: '#ccc',position: 'absolute',
                            bottom: 5,left: screenW*0.5,backgroundColor: global.gColors.buttonColor,width: screenW*0.5,height:44}}
                            onPress={this._rightButtonClick.bind(this)}
                        >
                        
                            <Text style={{ fontSize: 16, color: '#FFF' }}>
                            确认交易
                            </Text>
                        </TouchableOpacity>
                    </View>
                    : <View></View>
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    
    cardImageContent: {
        height: Constant.window.height - (Platform.OS === 'ios' ? 64 : 50) - 18,
        width: Constant.window.width,
        backgroundColor: '#f5f5f5',
        top: Platform.OS === 'ios' ? 64 : 50,
        position: 'absolute'
    },
    // modal的样式  
  modalStyle: {  
    // backgroundColor:'#ccc',  
    alignItems: 'center',  
    justifyContent:'center',  
    flex:1,  
  },  
  // modal上子View的样式  
  subView:{  
    marginLeft:40,  
    marginRight:40,  
    backgroundColor:'#fff',  
    alignSelf: 'stretch',  
    justifyContent:'center',  
    borderRadius: 10,  
    borderWidth: 0.5,  
    borderColor:'#ccc',  
  },  
  // 标题  
  titleText:{  
    marginTop:10,  
    marginBottom:5,  
    fontSize:18,
    color: 'black',  
    fontWeight:'bold',  
    textAlign:'center',  
  },  
  // 内容  
  contentText:{  
    margin:8,  
    fontSize:18,  
    color:'black',
    textAlign:'center',  
  },  
  // 水平的分割线  
  horizontalLine:{  
    marginTop:5,  
    height:0.5,  
    backgroundColor:'#ccc',  
  },  
  // 按钮  
  buttonView:{  
    flexDirection: 'row',  
    alignItems: 'center',  
  },  
  buttonStyle:{  
    flex:1,  
    height:44,  
    alignItems: 'center',  
    justifyContent:'center',  
  },  
  // 竖直的分割线  
  verticalLine:{  
    width:0.5,  
    height:44,  
    backgroundColor:'#ccc',  
  },  
  buttonText:{  
    fontSize:16,  
    color:'#3393F2',  
    textAlign:'center',  
  }
})