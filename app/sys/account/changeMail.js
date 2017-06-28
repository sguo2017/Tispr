import React, { Component, PureComponent } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    StyleSheet,
    Navigator,
    TouchableHighlight,
    Alert
} from 'react-native'
import Header from '../../components/HomeNavigation';
import accountSetting from './accountSetting';
import Constant from '../../common/constants';
export default class PasswordConfirm extends Component{
    constructor(props) {
		super(props);
        this.state = {
            mail: ''
        };
	}

    async _changeMail(){
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
                        email: this.state.mail
                    }
                })
            });
            let res = await response.text();
            let result = JSON.parse(res);
            if (response.status >= 200 && response.status < 300) {
               if (result.status && result.status == -1) {
                   Alert.alert(
                        '提示',
                        '邮箱修改失败',
                        [
                        { text: '确定'},
                        ]
                    )              
                }else if(result.status && result.status == -2){
                    Alert.alert(
                        '提示',
                        '该邮箱已被注册',
                        [
                        { text: '确定'},
                        ]
                    ) 
                }else{
                    global.user.email = this.state.mail;
                    Alert.alert(
                        '提示',
                        '邮箱修改成功',
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
            console.log("error "+error);
        }
    }

    render(){
        return(
            <View style={{height:global.gScreen.height}}>
                <Header
					title='更改邮箱'
					leftIcon={require('../../resource/ic_back_white.png')}
					leftIconAction={()=> this.props.navigator.pop()}
				/>
                <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',margin:10}}>
                    <TextInput
                    style={{flexDirection:'row',width: global.gScreen.width*0.8}}
                    multiline={true}
                    numberOfLines={1}
                    placeholder='mail@examlple.com'
                    value = {this.state.mail}
                    onChangeText={(text) => this.setState({ mail: text })}
                    />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center',marginLeft:10 }}>
                    <Image style={{ height: 20, width: 30 }} source={require('../../resource/b_correct.png')} />
                    <Text style={{fontSize:16,color:global.gColors.themeColor}}>您现在使用的电子邮箱</Text>
                </View>
                <TouchableHighlight onPress={this._changeMail.bind(this)} style={[styles.button, { backgroundColor: global.gColors.buttonColor, position: 'absolute', bottom:22, flexShrink: 0, width: global.gScreen.width }]}>
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