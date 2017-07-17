import React, { Component } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  AsyncStorage,
  ActivityIndicatorIOS,
  Text,
  View,
  Alert,
  Image,
  Platform,
} from 'react-native';

import TabBarView from '../containers/TabBarView';
import Header from '../components/HomeNavigation';
import Constant from '../common/constants';
import UserDefaults from '../common/UserDefaults';
import AutoTextInput from '../components/AutoTextInput';
import nationWarning from '../sys/others/nationWarning';
import personalinfoEdit from '../me/personalinfoEdit';
export default class Register extends Component {
  constructor() {
    super();

    this.state = {
      email: "",
      name: "",
      password: "",
      password_confirmation: "",
      errors: [],
      showProgress: false,
      firstPage: true,
      num: "",
      code: "",
      isEmail: true,
      nameValid: true,
      passwordValid: true
    }
  }
  _navigate(routeName) {
    console.log(routeName)
    const { navigator } = this.props;
    if (routeName == 'Register') {

      navigator.resetTo({
        component: Register,
        name: 'Register'
      });
    } else if (routeName == 'TabBarView') {
      navigator.resetTo({
        component: TabBarView,
        name: 'TabBarView'
      });
    } else if (routeName == 'personalinfoEdit'){
      navigator.push({
        component: personalinfoEdit,
        name: 'personalinfoEdit',
        passProps: {newUser: true}
      })
    }
  }

  async onRegisterPressed() {
    if(global.user == undefined){
      global.user ={}
    }
    let address = await UserDefaults.cachedObject(Constant.storeKeys.ADDRESS_COMPONENT);
    global.user.addressComponent = address;
    UserDefaults.clearCachedObject(Constant.storeKeys.ACCESS_TOKEN_TISPR);
    this.setState({ showProgress: true })
    try {
      console.log("state:" + JSON.stringify(this.state));
      let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_USER_REGI;
      let response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            password_confirmation: this.state.password,
            num: this.state.num,
            code: this.state.code,
            avatar: Constant.default_img.AVATAR,
            district: global.user.addressComponent.district,
            city: global.user.addressComponent.city,
            province: global.user.addressComponent.province,
            country: global.user.addressComponent.country,
            latitude: global.user.addressComponent.latitude,
            longitude: global.user.addressComponent.longitude,
          }
        })
      });
      let res = await response.text();
      let result = JSON.parse(res);
      if (response.status >= 200 && response.status < 300) {
        if(result.status == -2){
          Alert.alert(
            '提示',
            '邮箱已被注册',
            [
              { text: '确定'},
            ]
          )
        }else if(result.status == -1){
          Alert.alert(
            '提示',
            '验证码不正确',
            [
              { text: '确定'},
            ]
          )
        }else if(result.user){
          let userdetail =JSON.parse(result.user);    
          UserDefaults.setObject(Constant.storeKeys.ACCESS_TOKEN_TISPR, result.token)
          global.user = global.user = userdetail;
          global.user.addressComponent = address;
          global.user.authentication_token = result.token;  
          this._navigatePerInfo();
        }        
      } else {
        UserDefaults.clearCachedObject(Constant.storeKeys.ACCESS_TOKEN_TISPR);
        let error = res;
        throw error;
      }
    } catch (error) {
      this.setState({ error: error });
      console.log("error " + error);
      Alert.alert(
        '提示',
        '失败'+error,
        [
          { text: '注册失败'},
        ]
      )
      this.setState({ showProgress: false });
    }
  }

  async _smsSend() {
    try {
      let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_SPI_SMS_SEND_REGISTER_PHONE;
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
        if(result.status == -1){
          Alert.alert(
            '提示',
            '手机号已被注册',
            [
              { text: '确定'},
            ]
          )
        }
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

  _navigateMain() {
    this._navigate('TabBarView');
  }

  _navigateHome() {
    this._navigate('TabBarView');
  }
  _navigatePerInfo(){
    this._navigate('personalinfoEdit');
  }
  _onBack = () => {        
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop();
        }
 }
  focusNextField = (nextField) => {
    this.refs[nextField].focus();
  };

  render() {
    const mailRegister = (
      <View>
        <Header
          title='注册'
          leftIcon={require('../resource/ic_back_white.png')}
          leftIconAction = {this._onBack}
          rightButton='下一步'
          rightButtonAction={()=> {if(this.state.isEmail && this.state.name && this.state.password){this.setState({firstPage: false});}}}
        />
        <View style={{ flex: 1, paddingHorizontal: 16}}>
          <View style={{marginVertical: 16, flexDirection: 'row', height: 40}}>
            <Image source={require('../resource/b_register.png')} style={{width:40, height:40}}/>
            <Text style={{fontWeight: 'bold', fontSize: 14, color: 'black', lineHeight: 30, marginLeft: 16}} >让更多人认识您</Text>
          </View>
          <TextInput
            ref = "1"
            onChangeText={(text) => this.setState({ name: text })}
            style={styles.input} placeholder="怎样称呼您"
            value={this.state.name}
            underlineColorAndroid="transparent"
            returnKeyType = 'next'
            multiline = {false}
            onSubmitEditing={() => this.focusNextField('2')}
            onBlur ={()=>{if(this.state.name){this.setState({nameValid: true})}else{this.setState({nameValid: false})}}}
            >
          </TextInput>
          {this.state.nameValid? <Text style={styles.greyText}>2-4个中文汉字</Text>:<Text style ={styles.redText}>姓名不能为空</Text>}
          <TextInput
            ref = "2"
            onChangeText={(text) => this.setState({ email: text })}
            style={styles.input} placeholder="您的电子邮箱"
            value={this.state.email}
            underlineColorAndroid="transparent"
            returnKeyType = 'next'
            multiline = {false}
            onSubmitEditing={() => this.focusNextField('3')}
            onBlur = {
              ()=>{let reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
              this.setState({isEmail: reg.test(this.state.email)});
            }}  
          >
          </TextInput>
          {this.state.isEmail?<Text style={{color: '#4990e2'}}>该电子邮箱可用于登录和接收奇客平台的邮件信息</Text>:<Text style ={styles.redText}>邮箱格式不正确</Text>}
          {/*<View style={{flexDirection: 'row'}}>*/}
          <TextInput
            ref = "3"
            onChangeText={(text) => this.setState({ password: text })}
            style={styles.input}
            placeholder="请设置登录密码"
            secureTextEntry={true}
            value={this.state.password}
            underlineColorAndroid="transparent"
            returnKeyType = 'done'
            multiline = {false}
            onSubmitEditing={()=> {if(this.state.isEmail && this.state.name && this.state.password){this.setState({firstPage: false});}}}
            onBlur ={()=>{if(this.state.password){this.setState({passwordValid: true})}else{this.setState({passwordValid: false})}}}
          />
          {/*<TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }} onPress={()=>this.setState({ seePassword: !this.state.seePassword })}>
            <Image style={{ width: 25, height: 20 }} source={this.state.seePassword? require('../resource/g_eyes_close.png') : require('../resource/g_eyes_open.png')}/>
          </TouchableOpacity>
          </View>*/}
          {this.state.passwordValid? <Text>8-16位字符组成，不能包含空格</Text>:<Text style ={styles.redText}>密码不能为空</Text>}
        </View>
      </View>
    );
    const phoneVerify = (
      <View>
        <Header
          title='注册'
          leftIcon={require('../resource/ic_back_white.png')}
          leftIconAction = {()=>this.setState({firstPage: true})}
        />
        <View style ={{ flex: 1, padding: 16}}>
          <Text style={{ color: '#1b2833', fontSize: 14, fontWeight: 'bold' }}>请输入你的手机号码验证账号</Text>

          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginTop: 16, minHeight: 48 }}>
            <TouchableOpacity style={styles.countryButton} onPress={()=>this.props.navigator.push({component:nationWarning,name:'nationWarning'})}>
              <Image style={{ height: 12, width: 18, marginRight: 9 }} source={require('../resource/qk_china_flag.png')} />
              <Text style={{ fontSize: 16, color: '#1b2833' }}>+86</Text>
              <Image style={{ height: 24, width: 24 }} source={require('../resource/g-arrow-drop-down.png')} />
            </TouchableOpacity>
            <View style={{ flex: 1, justifyContent: 'center'}}>
              <AutoTextInput
                ref = "4"
                style={styles.input}
                underlineColorAndroid="transparent"
                onChangeText={(text) => this.setState({ num: text })}
                placeholder="输入您的手机号"
                placeholderTextColor="#cccccc"
                returnKeyType = 'next'
                returnKeyLabel = 'next'
                multiline = {false}
                onSubmitEditing={this._smsSend.bind(this)}
              />
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 10, minHeight: 48 }}>
            <View style={{ flex: 1, justifyContent: 'center'}}>
              <AutoTextInput
                ref = "5"
                style={styles.input}
                underlineColorAndroid="transparent"
                numberOfLines={1}
                maxLength={6}
                onChangeText={(text) => this.setState({ code: text })}
                placeholder="输入短信验证码"
                placeholderTextColor="#cccccc"
                returnKeyType = 'done'
                returnKeyLabel = 'done'
                multiline = {false}
                onSubmitEditing={this.onRegisterPressed.bind(this)}
              />
            </View>
            <TouchableOpacity onPress={this._smsSend.bind(this)} style={styles.smsCodeButton}>
              <Text style={styles.smsCodeButtonText}>获取短信验证码</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => this.setState({ firstPage: true })}>
            <Text style={{ color: '#4A90E2'}}>
              上一步
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onRegisterPressed.bind(this)} style={styles.loginButton}>
            <Text style={styles.loginButtonText}>注册</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
    return (
      <View style={styles.container}>
        {this.state.firstPage? mailRegister : phoneVerify}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    // alignItems: 'center',
    backgroundColor: '#F5FCFF',
    // padding: 10,
    // paddingTop: 80
  },
  input: {
    height: 50,
    marginTop: 10,
    padding: 4,
    fontSize: 18,
    // borderWidth: 1,
    borderColor: '#48bbec',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  button: {
    height: 50,
    backgroundColor: '#48BBEC',
    alignSelf: 'stretch',
    marginTop: 10,
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 22,
    color: '#FFF',
    alignSelf: 'center'
  },
  heading: {
    fontSize: 30,
  },
  error: {
    color: 'red',
    paddingTop: 10
  },
  loader: {
    marginTop: 20
  },
  countryButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#eeeeee',
    borderBottomWidth: 1,
    height: 32,
    marginRight: 18,
  },
  smsCodeButton: {
    position: 'absolute',
    height: 48,
    right: 0,
    top: 0,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: global.gColors.buttonColor,
    position: 'absolute',
    top: 200,
    bottom: 0,
    right:0,
    left: 0,
    height: 44,
  },
  redText: {
    color: 'red'
  },
  greyText: {
    color: '#C1C1C1'
  }
});
