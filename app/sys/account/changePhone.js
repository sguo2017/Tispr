import React, { Component, PureComponent } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    StyleSheet,
    Navigator,
    TouchableHighlight
} from 'react-native'
import Header from '../../components/HomeNavigation';
import accountSetting from './accountSetting';
import changePhoneHelp from './changPhoneHelp';
import Constant from '../../common/constants';
export default class PasswordConfirm extends Component{
    constructor(props) {
		super(props);
        this.state = {
            password:this.props.password,
            phoneNumber:this.props.phoneNumber,
            code:''
        }
	}

    async _smsSend() {
        try {
        let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_SMS_SEND_ADD;
        let response = await fetch(url, {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            sms_send: {
                recv_num: this.state.phoneNumber,
                sms_type: "code",
            }
            })
        });
        let res = await response.text();
        let result = JSON.parse(res);
        if (response.status >= 200 && response.status < 300) {

        } else {
            let error = res;
            throw error;
        }
        } catch (error) {
            this.setState({ error: error });
            Alert.alert(
                '提示',
                '失败',
                [
                { text: '短信验证发送失败', onPress: () => console.log('确定') },
                ]
            )
        }
    }

    async _changePhone() {
        try {
        let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_CHANGE_PHONE;
        let response = await fetch(url, {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            user: {
                code: this.state.code,
                num: this.state.phoneNumber
            }
            })
        });
        let res = await response.text();
        let result = JSON.parse(res);
        if (response.status >= 200 && response.status < 300) {
            if (result.status && result.status=='OK') {
                Alert.alert(
                    '提示',
                    '手机号码更改成功',
                    [
                    { text: '确定', onPress: () => this.props.navigator.pop() },
                    ]
                )                
            }
        } else {
            let error = res;
            throw error;
        }
        } catch (error) {
            console.log("error " + error);
        }
    }

    render(){
        return(
            <View style={{height:global.gScreen.height}}>
                <Header
					title='更改手机号码'
					leftIcon={require('../../resource/ic_back_white.png')}
					leftIconAction={()=> this.props.navigator.pop()}
                    rightIcon={require('../../resource/w_question.png')}
                    rightIconAction={()=>this.props.navigator.push({name:'changePhoneHelp',component:changePhoneHelp})}
				/>
                <View style={{padding:20,}}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Image style={{width:50,height:50}} source={require('../../resource/b_change.png')}/>
                        <Text style={{fontSize:16,color:'black',marginLeft:10}}>更改你的手机号码</Text>
                    </View>
                    <Text style={{fontSize:14,marginTop:10}}>为了账户安全，我们将向您的手机发送验证码。您的手机号码将被隐匿，任何人都无法查看。</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Image style={{ height: 20, width: 30 }} source={require('../../resource/qk_china_flag.png')} />
                        <Text style={{ fontSize: 20, color: 'black' }}>+86</Text>
                        <TextInput
                            onChangeText={(text) => this.setState({ phoneNumber: text })}
                            style={[styles.input, { width: 250,top:-5 }]}
                            placeholder="输入您的手机号">
                        </TextInput>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Image style={{ height: 20, width: 30 }} source={require('../../resource/b_correct.png')} />
                        <Text style={{fontSize:16,color:global.gColors.themeColor}}>您现在使用的手机号码</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                        <TextInput
                            onChangeText={(text) => this.setState({ code: text })}
                            style={[styles.input, { width: 160 }]}
                            placeholder="输入短信验证码">
                        </TextInput>
                        <TouchableHighlight onPress={this._smsSend.bind(this)}  style={[styles.button, { height: 34, borderRadius: 5, padding: 10 }]}>
                            <Text style={styles.buttonText}>
                                获取短信验证码
                            </Text>
                        </TouchableHighlight>
                    </View>
                </View>
                <TouchableHighlight  onPress={this._changePhone.bind(this)} style={[styles.button, { backgroundColor: global.gColors.buttonColor, position: 'absolute', bottom:22, flexShrink: 0, width: global.gScreen.width }]}>
                    <Text style={styles.buttonText}>
                        确定
                    </Text>
                </TouchableHighlight>
            </View>
        )
    }
}
const styles = StyleSheet.create({

  input: {
    height: 50,
    marginTop: 10,
    //padding: 4,
    fontSize: 18,
    borderWidth: 0,
    // borderColor: '#48bbec'
  },
  button: {
    height: 50,
    backgroundColor: global.gColors.themeColor,
    alignSelf: 'stretch',
    marginTop: 10,
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 22,
    color: '#FFF',
    alignSelf: 'center'
  },
})