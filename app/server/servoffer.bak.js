import React, {PureComponent} from 'react'
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Image,
    ListView,
    TouchableOpacity,
    TouchableHighlight,
    RefreshControl,
    AppRegistry
} from 'react-native'
import Util from '../common/utils';
import Store from 'react-native-simple-store'

export default class ServOffer extends PureComponent {

 

 state = {
      logined: false,
      phone: "",
      code: "",
      secondsElapsed: 0
  }

  componentDidMount() {
    Store.get('user').then((userdata)=>{
      this.setState({
        phone:userdata.user_name,
    })});
  }

  tick() {
    var secondsElapsed = this.state.secondsElapsed-1;
    if(secondsElapsed==0){
      this.setState({secondsElapsed: 0});
      return;
    }
    this.setTimeout(
        () => {
          this.setState({secondsElapsed: secondsElapsed});
          this.tick();
        },
        500
    );
  }

  getCode() {
    let phone = this.state.phone;
    if(!this.checkPhone(phone)){
      alert("请输入正确的手机号码");
      return;
    }
    var thiz = this;
    Util.post(API.getSmsCode(),{'tel':phone,'type':'verifiycode'},function (ret){
      if(ret.code==0){
        thiz.setState({secondsElapsed: 60});
        thiz.tick();
      }
      Util.log(ret.msg);
    });
  }

  login() {
    var phone = this.state.phone;
    var code = this.state.code;
     if(!this.checkPhone(phone)){
      alert("请输入正确的手机号码");
      return;
    }
     if(!this.checkCode(code)){
      alert("验证码为4位数字");
      return;
    }

    var data = {
      "phone":phone,
      "code":code
    }

    Util.get(Util.ADDRESSLIST("ADD"),data, (response) => {
        console.log('success');
    }, (error) => {
        console.log('Fetch sort types error: ' + error);
    })    

  }

  _loginSucc(userData){
    this.props.loginResult(userData);
  }

  logout(){
    this.setState({logined:false});
  }

  checkPhone(phone) {
    return phone&&phone.length>10;
  }

  checkCode(code) {
    return code&&code.length===4;
  }

  renderLogined() {
    return (
        <View style={[styles.container]}>
          <Text style={{alignItems:'center',justifyContent:'center'}}>欢迎你:user_id:{user_id} access_token:{access_token}</Text>
          <TouchableHighlight style={[styles.btn,styles.marginTop30]} onPress={this.logout}>
            <Text style={{color:'#fff'}}>退出</Text>
          </TouchableHighlight>
        </View>);
  }

  renderLogin() {

    var getCode_text = this.state.secondsElapsed==0?'获取验证码':(this.state.secondsElapsed+'秒后重试');

    return (
      
        <View style={styles.loginform}>
        <Text style={[styles.title,{marginTop:40}]} >发布服务：</Text>
          <View style={[styles.inputRow,{marginTop:90}]}>
            <Text style={styles.label} >服务标题</Text>
            <TextInput
              keyboardType ='default'
              clearButtonMode='while-editing'
              style={styles.input}
              placeholder="请输入服务标题"
              onChangeText={(text) => this.setState({phone: text})}/>
          </View>
          <View style={[styles.line]} />
          <View style={[styles.inputRow,{marginTop:10}]}>
            <Text style={styles.label}>服务描述</Text>
            <TextInput
              keyboardType ='default'
              clearButtonMode='while-editing'
              style={styles.input}
              placeholder="请输入服务描述"
              multiline={true}
              numberoflines={5}
              onChangeText={(text) => this.setState({code: text})}/>
            
          </View>
          <View style={[styles.line,{marginTop:2}]} />
          <TouchableHighlight style={[styles.btn,styles.marginTop30]} underlayColor='#0057a84a' onPress={this.login}>
            <Text style={{color:'#fff'}}>发布</Text>
          </TouchableHighlight>
        </View>
      );
    }
    
  render() {
      if(this.state.logined){
        return this.renderLogined();
      }
      return this.renderLogin();
  }
  
  };

const styles = StyleSheet.create({
   container: {
    flex:1,
  },
  loginform:{
    paddingLeft:40,
    paddingRight:40,
  },
  transparent:{
     backgroundColor:'#ff0000',
  },
  title: {
    color:'#000000',
    fontSize:20,
    flex:1,
    textAlign:'center',
  },
  action:{
    height:50,
  },
  line:{
    height:1,
    backgroundColor: '#ffffff',
  },
  marginleft10:{
    marginLeft:10,
  },
   marginTop20:{
    marginTop:20,
  },
  marginTop30:{
    marginTop:30,
  },
  marginRight10:{
    marginRight:10,
  },
  inputRow:{
    backgroundColor:'#000000',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
  },
  input:{
    height:35,
    borderColor:'#ccc',
    color:'#fff',
    flex:1,
    fontSize:14,
  },
  label: {
    width:80,
    fontSize: 14,
    color:'#ffffff'
  },
  btn:{
    height:35,
    backgroundColor:'#4d796e',
    justifyContent:'center',
    alignItems:'center',
    borderRadius: 10,
    borderWidth:1,
    borderColor:'#ffffff',
  }


})


module.exports = ServOffer;
