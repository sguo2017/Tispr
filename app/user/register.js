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
    UserDefaults.clearCachedObject(Constant.storeKeys.ACCESS_TOKEN_TISPR);
    this.setState({ showProgress: true })
    try {
      console.log("state:" + JSON.stringify(this.state));
      let response = await fetch('http://123.56.157.233:3000/users.json', {
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
          }
        })
      });
      let res = await response.text();
      if (response.status >= 200 && response.status < 300) {
        let accessToken = res;
        console.log(accessToken);
        UserDefaults.setObject(Constant.storeKeys.ACCESS_TOKEN_TISPR, accessToken.token)
        console.log("accessToken.token"+accessToken.token)
        console.log('accessToken:'+ UserDefaults.cachedObject(Constant.storeKeys.ACCESS_TOKEN_TISPR));
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
          { text: '注册失败', onPress: () => console.log('确定') },
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


  render() {
    return (
      <View style={styles.container}>
        <Header
          title='注册'
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