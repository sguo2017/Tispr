import React, { Component } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicatorIOS,
  AsyncStorage,
  Text,
  View,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import Header from '../components/HomeNavigation';
import Register from '../user/register';
import Constant from '../common/constants';
import UserDefaults from '../common/UserDefaults';
import TabBarView from '../containers/TabBarView';
import AutoTextInput from '../components/AutoTextInput';
import Loading from '../components/Loading';

export default class Login extends Component {

  constructor() {
    super();
    this.state = {
      email: "lin@qq.com",
      password: "123456",
      error: "",
      showProgress: false,
      num: "",
      code: "",
      loginWay: 'phonenumber',
      initialPosition: 'unknown',
      lastPosition: 'unknown',
      addressComponent: { "country": "中国", "country_code": 0, "province": "广东省", "city": "广州市", "district": "番禺区", "adcode": "440113", "street": "石北路", "street_number": "", "direction": "", "distance": "" },
      seePassword:true,
    };
  }

  componentWillMount() {
  }
  
  _onBack = () => {
    const { navigator } = this.props;
    if (navigator) {
      navigator.pop();
    }
  }

  _navigateReg() {
    this._navigate('Register');
  }

  _navigateHome() {
    this._navigate('TabBarView');
  }

  _navigate(routeName) {
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
    }
  }

  async onLoginPressed() {
    if(global.user == undefined){
      global.user ={}
    }
    let address = await UserDefaults.cachedObject(Constant.storeKeys.ADDRESS_COMPONENT);
    if(address)
      global.user.addressComponent = address;
    else
      global.user.addressComponent = this.state.addressComponent;
    UserDefaults.clearCachedObject(Constant.storeKeys.ACCESS_TOKEN_TISPR);
    this.setState({ showProgress: true })
    try {
      let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_USER_LOGIN;
      let response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            email: this.state.email,
            password: this.state.password,
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
      if (response.status >= 200 && response.status < 300 ) { 
        if(result.error){
            Alert.alert(
              '登录失败',
              '账户密码不正确',
              [
                { text: '登录失败'},
              ]
            )
        }        
        if(result.user && result.token){
          let userdetail = JSON.parse(result.user);
          UserDefaults.setObject(Constant.storeKeys.ACCESS_TOKEN_TISPR, result.token);
          let t = await UserDefaults.cachedObject(Constant.storeKeys.ACCESS_TOKEN_TISPR);
          let address = global.user.addressComponent;
          global.user = userdetail;
          global.user.addressComponent = address;
          global.user.authentication_token = result.token;
          //console.log(JSON.stringify(global.user))
          this._navigateHome();
        }
      } else {
        UserDefaults.clearCachedObject(Constant.storeKeys.ACCESS_TOKEN_TISPR);
        let error = res;
         Alert.alert(
          '登录失败',
          '服务器错误',
          [
            { text: '确定', onPress: () => console.log('确定') },
          ]
        )
        throw error;
      }
    } catch (error) {
      this.setState({ error: error });
      console.log("error " + error);
      Alert.alert(
        '登录失败',
        '网络连接错误',
        [
          { text: '确定', onPress: () => console.log('确定') },
        ]
      )
      this.setState({ showProgress: false });
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
            recv_num: this.state.num,
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
      this.setState({ showProgress: false });
    }
  }

  async _smsCodeLogin() {
    try {
      let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_SMS_LOGIN;
      let response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            code: this.state.code,
            num: this.state.num,
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
      let userdetail = JSON.parse(result.user);
      if (response.status >= 200 && response.status < 300 && result.token) {
        UserDefaults.setObject(Constant.storeKeys.ACCESS_TOKEN_TISPR, result.token)
        let t = await UserDefaults.cachedObject(Constant.storeKeys.ACCESS_TOKEN_TISPR);
        //console.log("79 accessToken:" + JSON.stringify(t));
        let address = global.user.addressComponent;
        global.user = userdetail;
        global.user.addressComponent = address;
        global.user.authentication_token = result.token;
        //console.log(JSON.stringify(global.user))
        this._navigateHome();
      } else {
        UserDefaults.clearCachedObject(Constant.storeKeys.ACCESS_TOKEN_TISPR);
        let error = res;
        throw error;
      }
    } catch (error) {
      this.setState({ error: error });
      Alert.alert(
        '提示',
        '失败',
        [
          { text: '登录失败', onPress: () => console.log('确定') },
        ]
      )
      this.setState({ showProgress: false });
    }
  }

  render() {
    const emailView = (
      <View style={{ flex: 1, padding: 16 }}>
        <View style={{ justifyContent: 'center', minHeight: 48}}>
          <AutoTextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            numberOfLines={1}
            onChangeText={(text) => this.setState({ email: text })}
            placeholder="邮箱"
            placeholderTextColor="#cccccc"
          />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', minHeight: 48}}>
          <View style={{ flex: 1, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#eeeeee',}}>
            <TextInput
              style={[styles.input, { borderWidth: 0 }]}
              underlineColorAndroid="transparent"
              numberOfLines={1}
              onChangeText={(text) => this.setState({ password: text })}
              placeholder="密码"
              placeholderTextColor="#cccccc"
              secureTextEntry={this.state.seePassword}
            />
          </View>
          <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }} onPress={()=>this.setState({ seePassword: !this.state.seePassword })}>
            <Image style={{ width: 25, height: 20 }} source={this.state.seePassword? require('../resource/g_eyes_close.png') : require('../resource/g_eyes_open.png')}/>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => this.setState({ loginWay: 'phonenumber' })}>
          <Text style={{ color: '#4A90E2'}}>
            使用手机号登录
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onLoginPressed.bind(this)} style={styles.loginButton}>
          <Text style={styles.loginButtonText}>
            登录
          </Text>
        </TouchableOpacity>
      </View>
    );
    const smsView = (
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ color: '#1b2833', fontSize: 14, fontWeight: 'bold' }}>使用手机号码登录</Text>

        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginTop: 16, minHeight: 48 }}>
          <TouchableOpacity style={styles.countryButton} onPress={()=>{
            Alert.alert(
              '提示',
              '奇客目前只开通中国地区注册，将很快开通其它国家注册服务。',
              [
                { text: '确定', onPress: () => {} }
              ]
            );
          }}>
            <Image style={{ height: 12, width: 18, marginRight: 9 }} source={require('../resource/qk_china_flag.png')} />
            <Text style={{ fontSize: 16, color: '#1b2833' }}>+86</Text>
            <Image style={{ height: 24, width: 24 }} source={require('../resource/g-arrow-drop-down.png')} />
          </TouchableOpacity>
          <View style={{ flex: 1, justifyContent: 'center'}}>
            <AutoTextInput
              style={styles.input}
              underlineColorAndroid="transparent"
              numberOfLines={1}
              onChangeText={(text) => this.setState({ num: text })}
              placeholder="输入您的手机号"
              placeholderTextColor="#cccccc"
            />
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 10, minHeight: 48 }}>
          <View style={{ flex: 1, justifyContent: 'center'}}>
            <AutoTextInput
              style={styles.input}
              underlineColorAndroid="transparent"
              numberOfLines={1}
              maxLength={6}
              onChangeText={(text) => this.setState({ code: text })}
              placeholder="输入短信验证码"
              placeholderTextColor="#cccccc"
            />
          </View>
          <TouchableOpacity onPress={this._smsSend.bind(this)} style={styles.smsCodeButton}>
            <Text style={styles.smsCodeButtonText}>获取短信验证码</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => this.setState({ loginWay: 'email' })}>
          <Text style={{ color: '#4A90E2'}}>
            使用邮箱登录
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this._smsCodeLogin.bind(this)} style={styles.loginButton}>
          <Text style={styles.loginButtonText}>登录</Text>
        </TouchableOpacity>
      </View>
    );
    return (
      <View style={styles.container}>
        <Header
          title='登录'
          leftIcon={require('../resource/ic_back_white.png')}
          leftIconAction={this._onBack}
        />
        {this.state.loginWay == 'email' ? emailView : smsView}
        <Loading text="登陆中" isShow={this.state.showProgress} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    //alignItems: 'center',
    backgroundColor: global.gColors.bgColor,
  },
  input: {
    flex: 1,
    maxHeight: 32,
    padding: 0,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  loginButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: global.gColors.buttonColor,
    position: 'absolute',
    bottom: 0,
    right:0,
    left: 0,
    height: 44,
  },
  loginButtonText: {
    fontSize: 16,
    color: '#ffffff',
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
  smsCodeButtonText: {
    fontSize: 14,
    color: '#4990e2',
  },
  heading: {
    fontSize: 30,
  },
  error: {
    color: 'red',
    paddingTop: 10
  },
  success: {
    color: 'green',
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
});