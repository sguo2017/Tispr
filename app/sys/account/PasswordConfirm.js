import React, { Component, PureComponent } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    StyleSheet,
    Navigator,
    TouchableHighlight,
    TouchableOpacity
} from 'react-native'
import Header from '../../components/HomeNavigation';
import accountSetting from './accountSetting';
export default class PasswordConfirm extends Component{
    constructor(props) {
		super(props);
        this.state = {
            password:this.props.password,
            seePassword:true,
            passVerify:true,
        }
	}
    _check(){
        if(this.state.password=='123456'){
            this.setState({passVerify:true});
            this.props.navigator.push({
                component:accountSetting,
                name:'accountSetting'
            });
            
        }
        else{
            this.setState({passVerify:false});
        }
    }
    render(){
        return(
            <View style={{height:global.gScreen.height}}>
                <Header
					title='密码验证'
					leftIcon={require('../../resource/t_header_arrow_left.png')}
					leftIconAction={()=> this.props.navigator.pop()}
				/>
                <View style={{flexDirection:'row',alignItems:'center',paddingLeft:20,paddingRight:20,marginTop:10}}>
                    <Image style={{width:30,height:30,top:5}} source={require('../../resource/b_key.png')}/>
                    <View style={{flexDirection:'row'}}>
                        <TextInput
                            onChangeText={(text) => this.setState({ password: text })}
                            style={[styles.input,{width:global.gScreen.width*0.7}]}
                            placeholder="请输入密码"
                            secureTextEntry={this.state.seePassword}>
                        </TextInput>
                        {
                            this.state.seePassword?
                            <TouchableOpacity onPress={()=>this.setState({seePassword:false})}>
                            <Image style={{ marginLeft: 5, marginRight: 8,marginTop:25, width: 25, height: 20,    
                            resizeMode: 'stretch'}} source={require('../../resource/g_eyes_open.png')}/>
                            </TouchableOpacity>:
                            <TouchableOpacity onPress={()=>this.setState({seePassword:true})}>
                            <Image style={{ marginLeft: 5, marginRight: 8,marginTop:25, width: 25, height: 20,    
                            resizeMode: 'stretch'}} source={require('../../resource/g_eyes_close.png')}/>
                            </TouchableOpacity>
                        }
                    </View>
                </View>
                <View style={{paddingLeft:53,paddingRight:20}}>
                    {
                        this.state.passVerify?
                        <Text>8至16个字符</Text>:
                        <View style={{justifyContent:'space-between',flexDirection:'row',marginRight:40}}>
                            <Text style={{color:'red'}}>密码验证不成功</Text>
                            <Image style={{width:20,height:20}} source={require('../../resource/r_warning.png')}/>
                        </View>
                    }    
                </View>
                <TouchableOpacity style={{marginTop:30,paddingLeft:53}}>
                    <Text style={{fontSize:16, color:global.gColors.themeColor}}>忘记密码？</Text>
                </TouchableOpacity>
                <TouchableHighlight onPress={this._check.bind(this)} style={[styles.button, { backgroundColor: global.gColors.buttonColor, position: 'absolute', bottom:22, flexShrink: 0, width: global.gScreen.width }]}>
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