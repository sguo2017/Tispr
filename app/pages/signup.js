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
                {/*<Text style={{color:'black',fontSize:16,margin: 20}}>不要错过最好的工作机会.</Text>*/}
                <TouchableHighlight onPress={this.toSignup.bind(this)} style={{height:44,borderRadius: 2,padding:10,marginBottom:15,backgroundColor: global.gColors.themeColor,marginTop: -70, width: 180, alignItems: 'center'}}>
                    <Text style={{color:'white',fontSize:16}}>
                        创建账号
                    </Text>
                </TouchableHighlight>
                 <TouchableHighlight onPress={this.toSignin.bind(this)}>
                    <Text style={{color:global.gColors.themeColor, fontSize:16, marginBottom:60, marginTop: 30, borderBottomColor:global.gColors.themeColor}}>使用已有账号</Text>
                </TouchableHighlight>
                <Text>创建账号表示您已阅读并同意 </Text>
                <Text>
                    <Text onPress={this.toUserAgreement.bind(this)} style={{color:global.gColors.themeColor,borderBottomWidth:1, borderBottomColor:global.gColors.themeColor}}>使用条款</Text>
                        &nbsp;和&nbsp;
                    <Text onPress={this.toUserAgreement.bind(this)} style={{color:global.gColors.themeColor,borderBottomWidth:1, borderBottomColor:global.gColors.themeColor}}>隐私政策</Text>
                    
                </Text>
            </View>
        )
    }
}