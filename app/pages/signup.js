import React, { Component } from 'react';
import {
    Image,
    View,
    Text,
    TouchableHighlight,
    Dimensions,
} from 'react-native';
import Login from '../user/login';
import Register from '../user/register';
import UserAgreement from '../sys/UserAgreement';

const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
export default class signup extends Component{
    toSignup(){
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({　　
                name: "Register",
                component: Register,
            });
        }
    }
    toSignin(){
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({　　
                name: "Login",
                component: Login,
            });
        }
    }
    toUserAgreement(){
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({　　
                name: "UserAgreement",
                component: UserAgreement,
            });
        }
    }
    render(){
        return(
            <View style={{justifyContent:'flex-start',alignItems:'center',backgroundColor:'#ffffff', height: screenH}}>
                <Image style={{width:screenW, resizeMode:'contain', marginTop: -70, marginLeft: -8}} source={require('../resource/head.png')}/>
                <TouchableHighlight onPress={this.toSignup.bind(this)} style={{height:44,borderRadius: 2,padding:10,marginBottom:15,backgroundColor: global.gColors.themeColor,marginTop: -70, width: 180, alignItems: 'center'}}>
                    <Text style={{color:'white',fontSize:16}}>
                        创建账号
                    </Text>
                </TouchableHighlight>
                 <TouchableHighlight onPress={this.toSignin.bind(this)}>
                    <Text style={{color:global.gColors.themeColor, fontSize:16, marginBottom:60, marginTop: 30, borderBottomColor:global.gColors.themeColor}}>使用已有账号</Text>
                </TouchableHighlight>
                <View style={{flexDirection: 'row'}}>
                    <Text>创建账号表示您已阅读并同意 </Text>
                    <Text onPress={this.toUserAgreement.bind(this)} style={{color:global.gColors.themeColor}}>《奇客服务协议》</Text>
                </View>
                
            </View>
        )
    }
}