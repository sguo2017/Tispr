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

export default class OrderConfirm extends Component{

    constructor(props) {
        super(props);
    }

    async clickJump() {
        let t = global.user.authentication_token;
        let order_id = this.props.order_id;
        let url ='http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_ORDER_UPDATE +'/' +order_id +'?token='+ t;            
        let data = {
            order: {
                    status: Constant.orderStatus.CONFIRMED,
            }
        };
        Util.patch(
            url,
            data,
            (response)=>{
                this._createChat(order_id);
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

    async _createChat(_deal_id){
        let URL = 'http:\/\/' + Constant.url.IMG_SERV_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_CHAT + global.user.authentication_token;
        let data = {
            chat: {
                deal_id: _deal_id,
                chat_content: "我同意了您提出的价格",
                user_id: global.user.id,
                catalog: 2,
                receive_user_id: this.props.receive_user_id,
            }
        }
        Util.post(URL, data, ()=>{console.log("创建会话成功")}, this.props.navigator)
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