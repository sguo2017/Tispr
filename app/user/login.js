import React, { Component } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableHighlight,
  ActivityIndicatorIOS,
  AsyncStorage,
  Text,
  View,
  Alert
} from 'react-native';
import Header from '../components/HomeNavigation';
import Register from '../user/register';
import Constant from '../common/constants';
import UserDefaults from '../common/UserDefaults';
import TabBarView from '../containers/TabBarView';

export default class Login extends Component {

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

  _navigateReg() {
    this._navigate('Register');
  }

  _navigateHome() {
    this._navigate('TabBarView');
  }

  constructor() {
    super();

    this.state = {
      email: "",
      password: "",
      error: "",
      showProgress: false,
    }
  }

  async onLoginPressed() {
    UserDefaults.clearCachedObject(Constant.storeKeys.ACCESS_TOKEN_TISPR);
    this.setState({ showProgress: true })
    try {
      console.log("state:" + JSON.stringify(this.state));
      let response = await fetch('http://123.56.157.233:3000/users/sign_in', {
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
      if (response.status >= 200 && response.status < 300 && result.token) {
        UserDefaults.setObject(Constant.storeKeys.ACCESS_TOKEN_TISPR, result.token)
        let t = await UserDefaults.cachedObject(Constant.storeKeys.ACCESS_TOKEN_TISPR);
        console.log("79 accessToken:" + JSON.stringify(t));
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