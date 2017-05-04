import React, { Component } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableHighlight,
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

const screenW = Dimensions.get('window').width;

export default class Login extends Component {

  constructor() {
    super();
    this.state = {
      email: "p1@qq.com",
      password: "123456",
      error: "",
      showProgress: false,
      num: "",
      code: "",
      loginWay: 'email',
      initialPosition: 'unknown',
      lastPosition: 'unknown',
      addressComponent: { "country": "中国", "country_code": 0, "province": "广东省", "city": "广州市", "district": "番禺区", "adcode": "440113", "street": "石北路", "street_number": "", "direction": "", "distance": "" }
    };
  }
  watchID: ?number = null;

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
        this.setState({ initialPosition });
      },
      (error) => alert(JSON.stringify(error)),
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lastPosition = JSON.stringify(position);
      this.setState({ lastPosition });
      this.getGeoLocation();
    });
  }

  async getGeoLocation() {
    this.setState({ latitude: (JSON.parse(this.state.lastPosition)).coords.latitude })
    this.setState({ longitude: (JSON.parse(this.state.lastPosition)).coords.longitude })
    this.setState({ showProgress: true })
    try {
      let url = Constant.url.GEO_LOCATION_ADDR + `&location=${this.state.latitude},${this.state.longitude}`;
      console.log("URL:" + url)
      let response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      let res = await response.text();
      if (response.status >= 200 && response.status < 300) {
        var addressComponent = (JSON.parse(res)).result.addressComponent
        this.setState({ addressComponent: addressComponent});
      } else {
        let error = res;
        throw error;
      }
    } catch (error) {
      this.setState({ error: error });
      console.log("error " + error);
      this.setState({ showProgress: false });

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
          }
        })
      });
      let res = await response.text();
      let result = JSON.parse(res);
      let userdetail = JSON.parse(result.user);
      if (response.status >= 200 && response.status < 300 && result.token) {
        UserDefaults.setObject(Constant.storeKeys.ACCESS_TOKEN_TISPR, result.token)
        let t = await UserDefaults.cachedObject(Constant.storeKeys.ACCESS_TOKEN_TISPR);
        console.log("79 accessToken:" + JSON.stringify(t));
        global.user = userdetail;
        global.user.addressComponent=this.state.addressComponent;
        console.log(JSON.stringify(global.user))
        this._navigateHome();
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
        '失败',
        [
          { text: '登录失败', onPress: () => console.log('确定') },
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
      let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_USER_LOGIN;
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
          }
        })
      });
      let res = await response.text();
      let result = JSON.parse(res);
      let userdetail = JSON.parse(result.user);
      if (response.status >= 200 && response.status < 300 && result.token) {
        UserDefaults.setObject(Constant.storeKeys.ACCESS_TOKEN_TISPR, result.token)
        let t = await UserDefaults.cachedObject(Constant.storeKeys.ACCESS_TOKEN_TISPR);
        console.log("79 accessToken:" + JSON.stringify(t));
        global.user = userdetail;
        global.user.addressComponent=this.state.addressComponent;
        console.log(JSON.stringify(global.user))
        this._navigateHome();
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
        '失败',
        [
          { text: '登录失败', onPress: () => console.log('确定') },
        ]
      )
      this.setState({ showProgress: false });
    }
  }



  render() {
    return (
      <View style={styles.container}>
        <Header
          title='登录'
        />
        { this.state.loginWay =='email'?
        <View style={{padding:15}}>
          <TextInput
            onChangeText={(text) => this.setState({ email: text })}

            style={styles.input} placeholder="邮箱">
          </TextInput>
          <TextInput
            onChangeText={(text) => this.setState({ password: text })}
            style={styles.input}
            placeholder="密码"

            secureTextEntry={true}>
          </TextInput>
          <TouchableHighlight onPress={this.onLoginPressed.bind(this)} style={styles.button}>
            <Text style={styles.buttonText}>
              登录
            </Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this._navigateReg.bind(this)} style={styles.button}>
            <Text style={styles.buttonText}>
              注册
            </Text>
          </TouchableHighlight>

          <TouchableHighlight onPress={()=>this.setState({loginWay: 'phonenumber'})}>
            <Text>
              使用手机号登录
            </Text>
          </TouchableHighlight>
        </View>:

        <View style={{padding:15}}>
          <Text style={{color:'black', fontSize:16}}>使用手机号登录</Text>
          <View style={{flexDirection:'row', justifyContent:'flex-start',alignItems:'center'}}>
            <Image style={{height: 30, width: 40}} source={require('../resource/qk_china_flag.png')}/>
            <Text style={{fontSize: 20, color:'black'}}>+86</Text>
            <TextInput
              onChangeText={(text) => this.setState({ num: text })}
              style={[styles.input, {width:250}]}
              placeholder="输入您的手机号">
            </TextInput>
          </View>

          <View style={{flexDirection:'row', justifyContent:'flex-start'}}>
            <TextInput
              onChangeText={(text) => this.setState({ code: text })}
              style={[styles.input,{width:160}]}
              placeholder="输入短信验证码">
            </TextInput>
            <TouchableHighlight onPress={this._smsSend.bind(this)} style={[styles.button,{height:34,borderRadius: 5,padding:10,backgroundColor:'#4a90e2'}]}>
              <Text style={styles.buttonText}>
                获取短信验证码
              </Text>
            </TouchableHighlight>
          </View>
        
          <TouchableHighlight onPress={()=>this.setState({loginWay: 'email'})}>
            <Text>
              使用邮箱登录
            </Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this._smsCodeLogin.bind(this)} style={[styles.button, {backgroundColor:'#ffc400',position:'absolute', top: 506,flexShrink: 0, width: screenW}]}>
            <Text style={styles.buttonText}>
              登录
            </Text>
          </TouchableHighlight>
        </View>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    //alignItems: 'center',
    backgroundColor: '#F5FCFF',

  },
  input: {
    height: 50,
    marginTop: 10,
    padding: 4,
    fontSize: 18,
    borderWidth: 0,
    // borderColor: '#48bbec'
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
  success: {
    color: 'green',
    paddingTop: 10
  },
  loader: {
    marginTop: 20
  }

});