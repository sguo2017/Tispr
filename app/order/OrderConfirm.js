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
} from 'react-native';
import Constant from '../common/constants';
import CloseDeal from './CloseDeal';
import Util from '../common/utils'
import fetchers from '../common/netRequest'
export default class OrderConfirm extends Component{

    constructor(props) {
        super(props);
    }

    async clickJump() {
        let t = global.user.authentication_token;
        let chatRoomId = this.props.chatRoomId;
        let order_id = this.props.order_id;
        let url ='http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_ORDER_UPDATE +'/' +order_id +'?token='+ t;            
        let data = {
            order: {
                status: Constant.orderStatus.CONFIRMED,
                lately_chat_content:  "我同意了你提出的价格",
            }
        };
        Util.patch(
            url,
            data,
            (response)=>{
                this._createChat(chatRoomId);
                const { navigator } = this.props;
                if (navigator) {
                navigator.push({　　//navigator.push 传入name和你想要跳的组件页面
                    name: "CloseDeal",
                    component: CloseDeal,
                });
                }
            },
            this.props.navigator
        )    
    }

    async _createChat(room_id){
        let URL = 'http:\/\/' + Constant.url.IMG_SERV_ADDR + ':' + Constant.url.SERV_API_PORT + '/api/chats/chat_rooms/' +room_id +'/chat_messages?token='+global.user.authentication_token
        let data = {
            chat_message: {
                message: "我同意了你提出的价格",
                user_id: global.user.id,
            }
        }
        fetchers.post(URL, data, (response)=>{
                console.log("成功创建会话")
            }
        )
    }

    render(){
        return(
            <View  style={{width:global.gScreen.width,height:global.gScreen.height,backgroundColor:global.gColors.themeColor,
             justifyContent:'center',alignItems:'center'}}>
                <View elevation={5} style={{backgroundColor:'#fff',justifyContent:'center',width:300,height:215,alignItems:'center', borderRadius: 4}}>
                    <View style={{justifyContent:'center', alignItems:'center'}}>
                        <Text style={{color:'black', fontWeight:'bold',fontSize:18, marginTop: 32, marginBottom: 16}}>你希望达成交易吗？</Text>
                        <Text style={{color:'black', fontSize:14, }}>经双方确认后，交易达成，此需求投标结束。</Text>
                        <View style={{ marginTop: 40, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <TouchableOpacity onPress={() => this.props.navigator.pop()}
                                style={{alignItems: 'center',justifyContent: 'center', marginRight: 40}}    
                            >
                                <Text style={{color: '#9E9E9E', fontSize: 16}}>残忍的拒绝</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.75}
                                style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'center',borderTopColor: '#ccc',
                                        backgroundColor: global.gColors.buttonColor,width: 112,height:44,borderRadius:6}}
                                onPress={this.clickJump.bind(this)}
                            >
                                <Text style={{ fontSize: 16, color: '#FFF' }}>
                                    允许
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}