import React, { Component, PureComponent } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    StyleSheet,
    Navigator,
    TouchableHighlight,
    TouchableOpacity,
    KeyboardAvoidingView,
} from 'react-native'
import Header from '../../components/HomeNavigation';
import accountSetting from './accountSetting';
import Constant from '../../common/constants';
import forgetPassword from '../../user/forgetPassword';
export default class PasswordConfirm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: this.props.password,
            seePassword: true,
            passVerify: true,
        }
    }
    async _check() {
        try {
            let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_CHECK_PASSWORD;
            let response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: {
                        email: global.user.email,
                        password: this.state.password,
                    }
                })
            });
            let res = await response.text();
            let result = JSON.parse(res);
            if (response.status >= 200 && response.status < 300) {
                if (result.error) {
                    this.setState({ passVerify: false });
                }
                if (result.status && result.status=='OK') {
                    this.setState({ passVerify: true });
                    this.props.navigator.push({
                        component: accountSetting,
                        name: 'accountSetting'
                    });
                }
            } else {
                this.setState({ passVerify: false });
                let error = res;
                throw error;
            }
        } catch (error) {
            this.setState({ passVerify: false });
            console.log("error " + error);
        }
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <Header
                    title='密码验证'
                    leftIcon={require('../../resource/ic_back_white.png')}
                    leftIconAction={() => this.props.navigator.pop()}
                />
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 20, paddingRight: 20, marginTop: 10 }}>
                    <Image style={{ width: 30, height: 30, top: 5 }} source={require('../../resource/b_key.png')} />
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eeeeee', marginBottom: 5 }} >
                            <TextInput
                                onChangeText={(text) => this.setState({ password: text })}
                                style={[styles.input, { width: global.gScreen.width * 0.7 }]}
                                placeholder="请输入密码"
                                underlineColorAndroid="transparent"
                                secureTextEntry={this.state.seePassword}>
                            </TextInput>
                            {
                                this.state.seePassword ?
                                    <TouchableOpacity onPress={() => this.setState({ seePassword: false })}>
                                        <Image style={{
                                            marginLeft: 5, marginRight: 8, marginTop: 25, width: 25, height: 20,
                                            resizeMode: 'stretch'
                                        }} source={require('../../resource/g_eyes_close.png')} />
                                    </TouchableOpacity> :
                                    <TouchableOpacity onPress={() => this.setState({ seePassword: true })}>
                                        <Image style={{
                                            marginLeft: 5, marginRight: 8, marginTop: 25, width: 25, height: 20,
                                            resizeMode: 'stretch'
                                        }} source={require('../../resource/g_eyes_open.png')} />
                                    </TouchableOpacity>
                            }
                        </View>
                    </View>
                </View>
                <View style={{ paddingLeft: 53, paddingRight: 20 }}>
                    {
                        this.state.passVerify ?
                            <Text>8至16个字符</Text> :
                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginRight: 10 }}>
                                <Text style={{ color: 'red' }}>密码验证不成功</Text>
                                <Image style={{ width: 20, height: 20 }} source={require('../../resource/r_warning.png')} />
                            </View>
                    }
                </View>
                <TouchableOpacity style={{ marginTop: 30, paddingLeft: 53 }} 
                 onPress={()=>this.props.navigator.push({component: forgetPassword})}
                >
                    <Text style={{ fontSize: 16, color: global.gColors.themeColor }}>忘记密码？</Text>
                </TouchableOpacity>
                <View style={{ flex: 1 }} /> 
                <KeyboardAvoidingView behavior="position" contentContainerStyle={styles.button}>
                    <TouchableHighlight onPress={this._check.bind(this)} >
                        <Text style={styles.buttonText}>
                            确定
                        </Text>
                    </TouchableHighlight>
                </KeyboardAvoidingView>
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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: global.gColors.buttonColor,
        height: 44,
        width: global.gScreen.width,
    },
    buttonText: {
        fontSize: 22,
        color: '#FFF',
        alignSelf: 'center'
    },
});
