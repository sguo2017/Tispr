import React, { Component } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableHighlight,
  AsyncStorage,
  ActivityIndicatorIOS,
  Text,
  View,
  Alert
} from 'react-native';

import TabBarView from '../containers/TabBarView';
import Header from '../components/HomeNavigation';
import Constant from '../common/constants';
import UserDefaults from '../common/UserDefaults';

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
    }
  }

  async onRegisterPressed() {
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
            password_confirmation: this.state.password_confirmation,
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
        }else if(result.user){
          let userdetail =JSON.parse(result.user);    
          UserDefaults.setObject(Constant.storeKeys.ACCESS_TOKEN_TISPR, result.token)
          global.user = global.user = userdetail;
          global.user.authentication_token = result.token;  
          this._navigateHome();
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
        '失败',
        [
          { text: '注册失败'},
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

  _onBack = () => {        
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop();
        }
 }

  render() {
    return (
      <View style={styles.container}>
        <Header
          title='注册'
          leftIcon={require('../resource/ic_back_dark.png')}
          leftIconAction = {this._onBack}
        />
        <TextInput
          onChangeText={(text) => this.setState({ email: text })}
          style={styles.input} placeholder="邮箱">
        </TextInput>
        <TextInput
          onChangeText={(text) => this.setState({ name: text })}
          style={styles.input} placeholder="姓名">
        </TextInput>
        <TextInput
          onChangeText={(text) => this.setState({ password: text })}
          style={styles.input}
          placeholder="密码"
          secureTextEntry={true}>
        </TextInput>
        <TextInput
          onChangeText={(text) => this.setState({ password_confirmation: text })}
          style={styles.input}
          placeholder="确认密码"
          secureTextEntry={true}>
        </TextInput>
        <TouchableHighlight onPress={this.onRegisterPressed.bind(this)} style={styles.button}>
          <Text style={styles.buttonText}>
            注册
          </Text>
        </TouchableHighlight>


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
    borderColor: '#48bbec'
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
  }
});
