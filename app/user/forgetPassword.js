import React, { Component, PureComponent } from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	TouchableHighlight,
    Alert,
    TextInput,
    Image,
    ScrollView
} from 'react-native'
import Header from '../components/HomeNavigation';
import Constant from '../common/constants';
import PasswordConfirm from '../sys/account/changePassword'
export default class forgetPassword extends Component {
    constructor(props) {
		super(props);
		this.state =({
            email: '',
            loginWay: 'phonenumber',
            num: '',
            code: ''
		});

	}
    async sendEmail(){
        try{
			let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_USER_PASSWORD;
			let response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: {
                        email: this.state.email
                    }
                })
            });
			let res = await response.text();
            if (response.status >= 200 && response.status < 300) {
                Alert.alert(
                    '提示',
                    '发送成功，请查看您的电子邮箱',
                    [
                        { text: '确定'},
                    ]
                )
            } else {
                let error = res;
                throw error;
            }
        } catch (error) {
            console.log("error " + error);
        }
    }

    async _smsSend() {
        if (!this.state.num) {
            Alert.alert(
                '提示',
                '请输入手机号码',
                [{text: '确定'}]
            )
            return;
        }
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
                recv_num: this.state.num,
                sms_type: "code",
            }
            })
        });
        let res = await response.text();
        let result = JSON.parse(res);
        if (response.status >= 200 && response.status < 300) {
            // if(result.status == -1){
            // Alert.alert(
            //     '提示',
            //     '手机号已被注册',
            //     [
            //     { text: '确定'},
            //     ]
            // )
            // }
            if(result.status == 0){
            Alert.alert(
                '提示',
                '短信验证码发送成功（验证码为'+ result.send_content + '测试临时通知)',
                [
                { text: '确定'},
                ]
            )
            }
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
        this.setState({ showProgress: false });
        }
    }

    async passwordComfirm() {
        let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_CHANGE_PHONE;
            let response = await fetch(url, {
                method: 'POST',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                user: {                   
                    num: this.state.num,
                    code: this.state.code,
                }
                })
            });
            let res = await response.text();
            let result = JSON.parse(res);
            console.log(result.status)
            if (response.status >= 200 && response.status < 300) {
                if(result.status == -2){

                }else if(result.error){
                Alert.alert(
                    '提示',
                    '验证码不正确',
                    [
                    { text: '确定'},
                    ]
                )} else {
                    this.props.navigator.push({ component: PasswordConfirm})
                }
            //     }else if(result.user){
            //     let userdetail =JSON.parse(result.user);    
            //     UserDefaults.setObject(Constant.storeKeys.ACCESS_TOKEN_TISPR, result.token)
            //     global.user = global.user = userdetail;
            //     global.user.addressComponent = address;
            //     global.user.authentication_token = result.token;  
            //     this._navigatePerInfo();
            //     }        
            // } else {
            //     UserDefaults.clearCachedObject(Constant.storeKeys.ACCESS_TOKEN_TISPR);
            //     let error = res;
            //     throw error;
            // }
            // } catch (error) {
            // this.setState({ error: error });
            // console.log("error " + error);
            // Alert.alert(
            //     '提示',
            //     '失败'+error,
            //     [
            //     { text: '注册失败'},
            //     ]
            // )
            // this.setState({ showProgress: false });
            // }
        }
    }

    render(){
        const emailView = (
        <View style={{ flex: 1, padding: 16 }}>
            <ScrollView>
            <View style={{flexDirection: 'row'}}>
                <Image source={require('../resource/b_key.png')} style={{width: 33, height: 32, marginRight: 10}}/>
                <Text style={{color: '#1B2833', fontSize: 14, fontWeight: 'bold', lineHeight: 25}}>重置密码</Text>
            </View>
            <Text style={{color:'#999999', fontSize: 12, marginTop: 26}}>我们将向您注册的电子邮箱发送验证码</Text>
            <TextInput
                style={styles.input}
                multiline = {false}
                underlineColorAndroid="#eeeeee"
                value={this.state.email}
                onChangeText={(val)=>this.setState({ email: val})}
                returnKeyType = 'done'
                returnKeyLabel = 'done'
                onSubmitEditing = {this.sendEmail.bind(this)}
                placeholder = '填写您注册时使用的电子邮箱'
                placeholderTextColor = '#cccccc'
            />
            </ScrollView>
            <TouchableHighlight style={[styles.button, { backgroundColor: global.gColors.buttonColor, position: 'absolute', bottom:22, flexShrink: 0, width: global.gScreen.width }]}
                onPress={this.sendEmail.bind(this)}
            >
                <Text style={styles.buttonText}>
                    下一步
                </Text>
            </TouchableHighlight>
        </View>
        );
        const smsView = (
        <View style={{ flex: 1, padding: 16 }}>
            <ScrollView>
                <View style={{flexDirection: 'row'}}>
                    <Image source={require('../resource/b_key.png')} style={{width: 32, height: 32, marginRight: 10}}/>
                    <Text style={{color: '#1B2833', fontSize: 14, fontWeight: 'bold', lineHeight: 25}}>重置密码</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginTop: 16, minHeight: 48 }}>
                    <TouchableOpacity style={styles.countryButton} onPress={()=>this.props.navigator.push({component:nationWarning,name:'nationWarning'})}>
                        <Image style={{ height: 12, width: 18, marginRight: 9 }} source={require('../resource/ico-china.png')} />
                        <Text style={{ fontSize: 16, color: '#1b2833' }}>+86</Text>
                        <Image style={{ height: 24, width: 24 }} source={require('../resource/g-arrow-drop-down.png')} />
                    </TouchableOpacity>
                    <View style={{ flex: 1, justifyContent: 'center'}}>
                        <TextInput
                        keyboardType='numeric'
                        ref = "3"
                        style={styles.input}
                        underlineColorAndroid="#eeeeee"
                        multiline = {false}
                        onChangeText={(text) => this.setState({ num: text })}
                        placeholder="输入您注册时的手机号"
                        placeholderTextColor="#cccccc"
                        value ={this.state.num}
                        returnKeyType = 'next'
                        returnKeyLabel = 'next'
                        onSubmitEditing={() => this.focusNextField('4')}
                        />
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 10, minHeight: 48 }}>
                    <View style={{ flex: 1, justifyContent: 'center', marginRight: -4}}>
                        <TextInput
                            ref = "4"
                            underlineColorAndroid="#eeeeee"
                            multiline = {false}
                            onChangeText={(text) => this.setState({ code: text })}
                            placeholder="输入短信验证码"
                            placeholderTextColor="#cccccc"
                            returnKeyType = 'done'
                            returnKeyLabel = 'done'
                            style={{fontSize: 16}}
                        />
                    </View>
                    <TouchableOpacity 
                         onPress={this._smsSend.bind(this)}
                        style={{borderBottomColor: '#eeeeee', borderBottomWidth: 1, height: 41}}
                    >
                        <Text style={{color: '#4A90E2', fontSize: 14, lineHeight: 33}}>获取短信验证码</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => this.setState({ loginWay: 'email' })}>
                    <Text style={{ color: '#4A90E2', marginLeft: 4}}>
                    使用邮箱重置
                    </Text>
                </TouchableOpacity>
            </ScrollView>
            <TouchableHighlight style={[styles.button, { backgroundColor: global.gColors.buttonColor, position: 'absolute', bottom:22, flexShrink: 0, width: global.gScreen.width }]}
                onPress={this.passwordComfirm.bind(this)}
            >
                <Text style={styles.buttonText}>
                    下一步
                </Text>
            </TouchableHighlight>
        </View>
        );

        return(
            <View style={{height:global.gScreen.height,backgroundColor: 'white'}}>
                <Header
					title='重置密码'
					leftIcon={require('../resource/ic_back_white.png')}
					leftIconAction={()=> this.props.navigator.pop()}
				/>
                {this.state.loginWay == 'email' ? emailView : smsView}
            </View>
        )
    }
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    marginTop: 10,
    //padding: 4,
    fontSize: 16,
    borderWidth: 0,
    // borderColor: '#48bbec'
  },
  countryButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#eeeeee',
    borderBottomWidth: 1,
    height: 43,
    marginRight: 18,
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