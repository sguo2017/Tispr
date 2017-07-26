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
import Util from '../../common/utils';
export default class PasswordConfirm extends Component{
    constructor(props) {
		super(props);
        this.state = {
             password:this.props.password,
            seePassword:true,
        }
	}
    
    async _changePassword(){
        let url ='http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_USER_PASSWORD +'/' +global.user.id;            
        let data = {
            user: {
                password: this.state.password
            }
        };
        Util.patch(url, data,
        (result)=>{
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
        },
        this.props.navigator);
    }

    render(){
        return(
            <View style={{height:global.gScreen.height, backgroundColor: '#fff'}}>
                <Header
					title='重置密码'
					leftIcon={require('../../resource/ic_back_white.png')}
					leftIconAction={()=> this.props.navigator.pop()}
				/>
                <View style={{paddingLeft:20,paddingRight:20,marginTop:20}}>
                    <View style={{flexDirection: 'row'}}>
                        <Image source={require('../../resource/b_key.png')} style={{width: 32, height: 32, marginRight: 10}}/>
                        <Text style={{color: '#1B2833', fontSize: 14, fontWeight: 'bold', lineHeight: 25}}>重置密码</Text>
                    </View>
                    <Text style={{color:'#999999', fontSize: 12, marginTop: 26}}>现在您可以重新设置新的密码</Text>
                    <View style={{flexDirection:'row'}}>
                        <TextInput
                            onChangeText={(text) => this.setState({ password: text })}
                            value ={this.state.password}
                            style={[styles.input,{width:global.gScreen.width*0.8}]}
                            placeholder="设置新的密码"
                            secureTextEntry={this.state.seePassword}>
                        </TextInput>
                        {
                            this.state.seePassword?
                            <TouchableOpacity onPress={()=>this.setState({seePassword:false})}>
                            <Image style={{ marginLeft: 5, marginRight: 8,marginTop:25, width: 25, height: 20,    
                            resizeMode: 'stretch'}} source={require('../../resource/g_eyes_close.png')}/>
                            </TouchableOpacity>:
                            <TouchableOpacity onPress={()=>this.setState({seePassword:true})}>
                            <Image style={{ marginLeft: 5, marginRight: 8,marginTop:25, width: 25, height: 20,    
                            resizeMode: 'stretch'}} source={require('../../resource/g_eyes_open.png')}/>
                            </TouchableOpacity>
                        }
                    </View>
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
    fontSize: 16,
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