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
    Alert
} from 'react-native'
import Header from '../../components/HomeNavigation';
import accountSetting from './accountSetting'
import Constant from '../../common/constants';
export default class PasswordConfirm extends Component{
    constructor(props) {
		super(props);
        this.state = {
             password:this.props.password,
            seePassword:true,
        }
	}
    
    async _changePassword(){
        try {
            let url ='http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_USER_PASSWORD +'/' +global.user.id;            
            let response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: {
                        password: this.state.password
                    }
                })
            });
             let res = await response.text();
             let result = JSON.parse(res);
            if (response.status >= 200 && response.status < 300) {
               if (result.status && result.status==-1) {
                    Alert.alert(
                        '提示',
                        '密码修改失败',
                        [
                        { text: '确定'},
                        ]
                    )                
                }else{
                    Alert.alert(
                        '提示',
                        '密码修改成功',
                        [
                        { text: '确定', onPress: () => this.props.navigator.pop()},
                        ]
                    ) 
                }
            } else {
                let error = res;
                throw error;
            }
        } catch (error) {
            console.log("error "+error);
        }
    }

    render(){
        return(
            <View style={{height:global.gScreen.height, backgroundColor: '#fff'}}>
                <Header
					title='修改密码'
					leftIcon={require('../../resource/ic_back_white.png')}
					leftIconAction={()=> this.props.navigator.pop()}
				/>
                <View style={{flexDirection:'row',alignItems:'center',paddingLeft:20,paddingRight:20,marginTop:10}}>
                    <Image style={{width:30,height:30,top:5}} source={require('../../resource/b_key.png')}/>
                    <View style={{flexDirection:'row'}}>
                        <TextInput
                            onChangeText={(text) => this.setState({ password: text })}
                            value ={this.state.password}
                            style={[styles.input,{width:global.gScreen.width*0.7}]}
                            placeholder="请输入新密码"
                            secureTextEntry={this.state.seePassword}>
                        </TextInput>
                        {
                            this.state.seePassword?
                            <TouchableOpacity onPress={()=>this.setState({seePassword:false})}>
                            <Image style={{ marginLeft: 5, marginRight: 8,marginTop:25, width: 25, height: 20,    
                            resizeMode: 'stretch'}} source={require('../../resource/g_eyes_open.png')}/>
                            </TouchableOpacity>:
                            <TouchableOpacity onPress={()=>this.setState({seePassword:true})}>
                            <Image style={{ marginLeft: 5, marginRight: 8,marginTop:25, width: 25, height: 20,    
                            resizeMode: 'stretch'}} source={require('../../resource/g_eyes_close.png')}/>
                            </TouchableOpacity>
                        }
                    </View>
                </View>
                <View style={{paddingLeft:53,paddingRight:20}}>
                    <Text>8至16个字符</Text>
                </View>
                <TouchableHighlight onPress={this._changePassword.bind(this)} style={[styles.button, { backgroundColor: global.gColors.buttonColor, position: 'absolute', bottom:22, flexShrink: 0, width: global.gScreen.width }]}>
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