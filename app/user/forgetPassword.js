import React, { Component, PureComponent } from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	TouchableHighlight,
    Alert,
    TextInput,
    Image
} from 'react-native'
import Header from '../components/HomeNavigation';
import Constant from '../common/constants';
export default class forgetPassword extends Component {
    constructor(props) {
		super(props);
		this.state =({
			email: '',
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

    render(){
        return(
            <View style={{height:global.gScreen.height}}>
                <Header
					title='忘记密码'
					leftIcon={require('../resource/ic_back_white.png')}
					leftIconAction={()=> this.props.navigator.pop()}
				/>
                <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',margin:10}}>
                    <TextInput
                    style={{flexDirection:'row',width: global.gScreen.width*0.8}}
                    multiline={true}
                    numberOfLines={1}
                    placeholder='mail@examlple.com'
                    value={this.state.email}
                    onChangeText={(val)=>this.setState({ email: val})}
                    />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center',marginLeft:10 }}>
                    <Image style={{ height: 20, width: 30 }} source={require('../resource/b_correct.png')} />
                    <Text style={{fontSize:16,color:global.gColors.themeColor}}>您注册时使用的电子邮箱</Text>
                </View>
                <TouchableHighlight style={[styles.button, { backgroundColor: global.gColors.buttonColor, position: 'absolute', bottom:22, flexShrink: 0, width: global.gScreen.width }]}
                    onPress={this.sendEmail.bind(this)}
                >
                    <Text style={styles.buttonText}>
                        发送邮件
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