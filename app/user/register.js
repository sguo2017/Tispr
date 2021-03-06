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
  ScrollView,
  ToastAndroid,
  Modal
} from 'react-native';

import TabBarView from '../containers/TabBarView';
import Header from '../components/HomeNavigation';
import Constant from '../common/constants';
import UserDefaults from '../common/UserDefaults';
import AutoTextInput from '../components/AutoTextInput';
import nationWarning from '../sys/others/nationWarning';
import wrongCode from '../sys/others/wrongCode';
import personalinfoEdit from '../me/personalinfoEdit';
import fetchers from '../common/netRequest'
import util from '../common/utils'
import getFriend from './getFriend'
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
      seePassword: false,
      passwordValid: true,
      time: '',
      showModal: false,
      invitationCode: '',
      beRecommended: false,
      beRecommendedUserId: '',
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
    } else if (routeName == 'personalinfoEdit') {
      navigator.push({
        component: personalinfoEdit,
        name: 'personalinfoEdit',
        passProps: { newUser: true }
      })
    } else if (routeName == 'getFriend') {
      navigator.push({
        component: getFriend,
        name: 'getFriend',
      })
    }
  }
  showInvitationCodeModal() {
    this.setState({
      showModal: true
    })
  }

  recommendedUserLogin() {
    let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_PHONE_LOGIN;
    let data = {
      user: {
        num: this.state.num,
        password: this.state.password,
        district: global.user.addressComponent.district,
        city: global.user.addressComponent.city,
        province: global.user.addressComponent.province,
        country: global.user.addressComponent.country,
        latitude: global.user.addressComponent.latitude,
        longitude: global.user.addressComponent.longitude,
        regist_id: global.user.registrationId,
        device_type: global.user.device_type,
      }
    }
    fetchers.post(url, data,
      (result) => {
        if (result.error) {
          Alert.alert(
            '登录失败',
            '账户密码不正确',
            [
              { text: '登录失败' },
            ]
          )
          this.setState({ showProgress: false });
        }
        if (result.status == Constant.error_type.USER_IS_LOCK) {
          this.props.navigator.push({ component: accountBan })
        }
        if (result.user && result.token) {
          let userdetail = JSON.parse(result.user);
          UserDefaults.setObject(Constant.storeKeys.ACCESS_TOKEN_TISPR, result.token);
          let address = global.user.addressComponent;
          global.user = userdetail;
          global.user.addressComponent = address;
          global.user.authentication_token = result.token;
          //console.log(JSON.stringify(global.user))
          this._navigate('getFriend')
        }
      },
      (error) => {
        this.setState({ error: error });
        console.log("error " + error);
        if (error.message === 'request timeout') {
          this.props.navigator.push({ component: offline })
        } else {
          Alert.alert(
            '登录失败',
            '网络连接错误',
            [
              { text: '确定', onPress: () => console.log('确定') },
            ]
          )
        }
        this.setState({ showProgress: false });
      }
    )
  }

  async onRegisterPressed() {
    if (global.user == undefined) {
      global.user = {}
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
        if (result.user) {
          let userdetail = JSON.parse(result.user);
          UserDefaults.setObject(Constant.storeKeys.ACCESS_TOKEN_TISPR, result.token)
          global.user = global.user = userdetail;
          global.user.addressComponent = address;
          global.user.authentication_token = result.token;
          this._navigate('getFriend');
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
        '失败' + error,
        [
          { text: '注册失败' },
        ]
      )
      this.setState({ showProgress: false });
    }
  }

  _smsSend = () => {
    let reg = /^1[3|5|8][0-9]{9}$/;
    if (!reg.test(this.state.num)) {
      ToastAndroid.show('请正确输入手机号码', ToastAndroid.SHORT);
      return;
    }
    let currentTime = 60;
    this.setState({
      sendingCode: true
    });
    let countTime = setInterval(() => {
      this.setState({ time: currentTime });
      currentTime = currentTime - 1;
    }, 1000)
    setTimeout(() => {
      clearInterval(countTime)
      this.setState({
        sendingCode: false,
        time: '',
      });
    }, 62000)
    let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_SPI_SMS_SEND_REGISTER_PHONE;
    let data = {
      sms_send: {
        recv_num: this.state.num,
        sms_type: "code",
      }
    };
    util.post(url, data, (result) => {
      console.log("188:" + result.status)
      if (result.status == -1) {
        Alert.alert(
          '提示',
          '手机号已被注册',
          [
            { text: '确定' },
          ]
        )
        clearInterval(countTime)
        this.setState({
          sendingCode: false,
          time: '',
        });
      }
      if (result.status == -2) {
        Alert.alert(
          '提示',
          '你的操作过于频繁，请10分钟后再试',
          [
            { text: '确定' },
          ]
        )
        clearInterval(countTime)
        this.setState({
          sendingCode: false,
          time: '',
        });
      }
      if (result.status == 0) {
        Alert.alert(
          '提示',
          '短信验证码发送成功（验证码为' + result.send_content + '测试临时通知)',
          [
            { text: '确定' },
          ]
        )
      }
    },
      this.props.navigator
    )
  }

  _navigateMain() {
    this._navigate('TabBarView');
  }

  _navigateHome() {
    this._navigate('TabBarView');
  }
  _navigatePerInfo() {
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
  //验证邀请码
  validateCode() {
    if(this.state.password.length<6){
      Alert.alert(
        '提示',
        '密码长度至少要6位',
        [
          { text: '确定' },
        ]
      );
      return
    }
    let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_VALIDATE_CODE;
    data = { code: this.state.invitationCode }
    util.post(url, data, (result) => {
      if (result.status == -1) {
        console.log('邀请码已失效')
      }
      if (result.status == 0) {
        this.setState({ showModal: false })
        this.onRegisterPressed()
      }
      if (result.status == -2) {
        console.log('邀请码不正确')
        this.props.navigator.push({
          component: wrongCode
        })
      }
    },
      this.props.navigator
    )
  }
  //验证手机号验证码
  validatePhone() {
    // this._navigate('getFriend');
    let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_VALIDATE_PHONE;
    data = {
      user: {
        num: this.state.num,
        code: this.state.code
      }
    }
    util.post(url, data,
      (result) => {
        if (result.status == 0) {
          console.log("用户已被推荐")
          this.setState({ beRecommended: true, firstPage: false, beRecommendedUserId: result.id })
        }
        if (result.status == 1) {
          console.log("用户未推荐，需要邀请码")
          this.setState({ firstPage: false })
        }
        if (result.error) {
          console.log("手机号已经被注册，验证码不正确")
        }
      },
      this.props.navigator
    )
  }
  validateEmail() {
    let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_VALIDATE_EMAIL;
    data = {
      user: {
        email: this.state.email
      }
    }
    util.post(url, data,
      (result) => {
        if (result.status == 0) {
          console.log("验证通过，激活用户然后登陆")
          if (this.state.beRecommended) {
            let user_url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_ACTIVATE_USER + '/' + this.state.beRecommendedUserId;
            let user_data = {
              user: {
                status: '00A',
                email: this.state.email,
                password: this.state.password,
                name: this.state.name
              }
            }
            util.patch(user_url, user_data, (response) => {
              if (response.status == 0) {
                console.log("用户激活成功")
                this.recommendedUserLogin()
              } else {
                console.log("用户激活失败")
              }
            })
            this._navigate('getFriend')
          } else {
            this.showInvitationCodeModal()
          }
        }
        if (result.error) {
          Alert.alert(
            '注册失败',
            '邮箱已经被注册',
            [
              { text: '确定' },
            ]
          )
          console.log("邮箱已经被注册")
        }
      },
      this.props.navigator
    )
  }
  render() {
    const mailRegister = (
      <View>
        <Header
          title='注册'
          leftIcon={require('../resource/ic_back_white.png')}
          leftIconAction={this._onBack}
          rightButton='下一步'
          rightButtonAction={() => { if (this.state.isEmail && this.state.name && this.state.password) { this.validateEmail() } }}
        />
        <ScrollView style={{ paddingHorizontal: 16 }}>
          <View style={{ marginVertical: 16, flexDirection: 'row', height: 40 }}>
            <Image source={require('../resource/b-reg-smail.png')} style={{ width: 40, height: 40 }} />
            <Text style={{ fontWeight: 'bold', fontSize: 14, color: 'black', lineHeight: 30, marginLeft: 16 }} >让更多人认识您</Text>
          </View>
          <View style={{ borderBottomWidth: 1, borderBottomColor: '#eeeeee' }} >
            <TextInput
              ref="1"
              onChangeText={(text) => this.setState({ name: text })}
              style={styles.input} placeholder="真实姓名"
              value={this.state.name}
              underlineColorAndroid="transparent"
              returnKeyType='next'
              placeholderTextColor='#ccc'
              multiline={false}
              onSubmitEditing={() => this.focusNextField('2')}
              onBlur={() => { if (this.state.name) { this.setState({ nameValid: true }) } else { this.setState({ nameValid: false }) } }}
            />
          </View>

          {this.state.nameValid ? <Text style={styles.greyText}>2-4个汉字</Text> : <Text style={styles.redText}>姓名不能为空</Text>}
          <View style={{ borderBottomWidth: 1, borderBottomColor: '#eeeeee' }} >
            <TextInput
              ref="2"
              onChangeText={(text) => this.setState({ email: text })}
              style={styles.input} placeholder="您的电子邮箱"
              value={this.state.email}
              underlineColorAndroid="transparent"
              returnKeyType='next'
              placeholderTextColor='#ccc'
              multiline={false}
              onSubmitEditing={() => this.focusNextField('3')}
              onBlur={
                () => {
                  let reg = /^([a-zA-Z0-9_-_.])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
                  this.setState({ isEmail: reg.test(this.state.email) });
                }}
            />
          </View>
          {this.state.isEmail ? <Text style={{ color: '#4A90E2', marginTop: 4 }}>该电子邮箱可作为账号用于登录和密码找回</Text> : <Text style={styles.redText}>邮箱格式不正确</Text>}
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', minHeight: 48 }}>
            <View style={{ flex: 1, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#eeeeee' }}>
              <TextInput
                ref="3"
                onChangeText={(text) => this.setState({ password: text })}
                style={styles.input}
                placeholder="请设置登录密码"
                secureTextEntry={true}
                value={this.state.password}
                underlineColorAndroid="transparent"
                placeholderTextColor='#ccc'
                returnKeyType='done'
                secureTextEntry={this.state.seePassword}
                multiline={false}
                onSubmitEditing={() => { if (this.state.isEmail && this.state.name && this.state.password) { this.setState({ firstPage: false }); } }}
                onBlur={() => { if (this.state.password.length>6) { this.setState({ passwordValid: true }) } else { this.setState({ passwordValid: false }) } }}
              />
            </View>
            <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }} onPress={() => this.setState({ seePassword: !this.state.seePassword })}>
              <Image style={{ width: 25, height: 20 }} source={this.state.seePassword ? require('../resource/g_eyes_close.png') : require('../resource/g_eyes_open.png')} />
            </TouchableOpacity>
          </View>
          {this.state.passwordValid ? <Text style={{ color: '#B8B8B8', marginTop: 4 }}>8-16位字符组成，不能包含空格</Text> : <Text style={styles.redText}>密码不能为空</Text>}
        </ScrollView>
      </View>
    );
    const phoneVerify = (
      <View>
        <Header
          title='注册'
          leftIcon={require('../resource/ic_back_white.png')}
          leftIconAction={() => this.props.navigator.pop()}
        />
        <View style={{ padding: 16 }}>
          <Text style={{ color: '#1b2833', fontSize: 14, fontWeight: 'bold' }}>请输入你的手机号码验证账号</Text>

          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginTop: 16, minHeight: 48 }}>
            <TouchableOpacity style={styles.countryButton} onPress={() => this.props.navigator.push({ component: nationWarning, name: 'nationWarning' })}>
              <Image style={{ height: 12, width: 18, marginRight: 9 }} source={require('../resource/ico-china.png')} />
              <Text style={{ fontSize: 16, color: '#1b2833' }}>+86</Text>
              <Image style={{ height: 24, width: 24 }} source={require('../resource/g-arrow-drop-down.png')} />
            </TouchableOpacity>
            <View style={{ flex: 1, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#eeeeee' }}>
              <AutoTextInput
                ref="4"
                style={styles.input}
                underlineColorAndroid="transparent"
                onChangeText={(text) => this.setState({ num: text })}
                placeholder="输入您的手机号"
                placeholderTextColor="#cccccc"
                returnKeyType='next'
                returnKeyLabel='next'
                multiline={false}
                onSubmitEditing={this._smsSend.bind(this)}
                maxLength ={11}
              />
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 10, minHeight: 48 }}>
            <View style={{ flex: 1, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#eeeeee' }}>
              <AutoTextInput
                ref="5"
                style={styles.input}
                underlineColorAndroid="transparent"
                numberOfLines={1}
                maxLength={6}
                onChangeText={(text) => this.setState({ code: text })}
                placeholder="输入短信验证码"
                placeholderTextColor="#cccccc"
                returnKeyType='done'
                returnKeyLabel='done'
                multiline={false}
                maxLength ={4}
              />
            </View>
            <TouchableOpacity disabled={this.state.sendingCode} onPress={this._smsSend.bind(this)} style={styles.smsCodeButton}>
              <Text style={[styles.themeText, this.state.sendingCode && styles.greyText]}>获取短信验证码{this.state.time}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={this.validatePhone.bind(this)} style={styles.loginButton}>
            <Text style={styles.loginButtonText}>下一步</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
    const invitationCodeModal = (
      <Modal
        animationType='slide'
        transparent={true}
        visible={this.state.showModal}
        onShow={() => { }}
        onRequestClose={() => { }} >
        <View style={styles.modalStyle}>
          <View style={styles.subView}>
            <Text style={styles.titleText}>
              请输入邀请码
               </Text>
            <Text style={styles.contentText}>
              邀请码
               </Text>
            <View style={{ borderBottomWidth: 1, borderBottomColor: '#eeeeee', marginLeft: 10, marginRight: 10 }} >
              <TextInput
                onChangeText={(val) => this.setState({ invitationCode: val })}
                style={styles.input}
                value={this.state.invitationCode}
                underlineColorAndroid="transparent"
                returnKeyType='next'
                placeholderTextColor='#ccc'
                multiline={false}
                placeholder=""
              />
            </View>
            <View style={styles.buttonView}>
              <TouchableHighlight
                style={styles.button1Style}
                onPress={() => this.setState({ showModal: false })}
              >
                <Text style={{ color: '#808080', fontSize: 16 }}>
                  残忍的拒绝
                   </Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={styles.button2Style}
                onPress={() => this.validateCode()}
                disabled={false}
              >
                <Text style={{ color: '#000', fontSize: 16 }}>
                  提交
                   </Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>
    )
    return (
      <View style={styles.container}>
        {this.state.showModal ?
          <View style={styles.cover}></View>
          : null}
        {this.state.firstPage ? phoneVerify : mailRegister}
        {invitationCodeModal}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cover: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    height: global.gScreen.height,
    width: global.gScreen.width,
    zIndex: 99
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    // alignItems: 'center',
    backgroundColor: '#F5FCFF',
    // padding: 10,
    // paddingTop: 80
  },
  input: {
    height: 40,
    marginTop: 10,
    padding: 4,
    fontSize: 18,
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
    marginTop: 10
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
    right: 0,
    left: 0,
    height: 44,
  },
  redText: {
    color: 'red',
    marginTop: 4
  },
  greyText: {
    color: '#C1C1C1'
  },
  themeText: {
    color: global.gColors.themeColor,
  },
  // modal的样式  
  modalStyle: {
    // backgroundColor:'#ccc',  
    flex: 1,
    position: 'absolute',
    top: 100,
    width: 400,
    left: (global.gScreen.width - 400) / 2
  },
  // modal上子View的样式  
  subView: {
    marginLeft: 60,
    marginRight: 60,
    backgroundColor: '#fff',
    alignSelf: 'stretch',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#ccc',
  },
  // 标题  
  titleText: {
    marginTop: 10,
    marginBottom: 5,
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // 内容  
  contentText: {
    margin: 8,
    fontSize: 16,
    textAlign: 'left',
  },
  // 水平的分割线  
  horizontalLine: {
    marginTop: 5,
    height: 0.5,
    backgroundColor: '#ccc',
  },
  // 按钮  
  buttonView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button1Style: {
    flex: 1,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    borderRadius: 8
  },
  button2Style: {
    flex: 1,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: global.gColors.buttonColor,
    margin: 10,
    borderRadius: 8
  },
  // 竖直的分割线  
  verticalLine: {
    width: 0.5,
    height: 44,
    backgroundColor: '#ccc',
  },

});