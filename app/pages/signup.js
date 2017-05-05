import React, { Component } from 'react';
import {
    Image,
    View,
    Text,
    TouchableHighlight,
    Dimensions,
} from 'react-native';
import Login from '../user/login';
import Register from '../user/register';

const screenW = Dimensions.get('window').width;
export default class signup extends Component{
    toSignup(){
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({　　
                name: "Register",
                component: Register,
            });
        }
    }
    toSignin(){
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({　　
                name: "Login",
                component: Login,
            });
        }
    }
    render(){
        return(
            <View style={{justifyContent:'flex-start',alignItems:'center',backgroundColor:'#ffffff'}}>
                <Image style={{width:screenW, resizeMode:'stretch'}} source={require('../resource/qk_signup_head.png')}/>
                <Text style={{color:'black',fontSize:16,margin: 20}}>Your marketpalce for local talents.</Text>
                <TouchableHighlight onPress={this.toSignup.bind(this)} style={{height:44,borderRadius: 5,padding:10,marginBottom:15,borderColor:'#675dc6',borderWidth:2}}>
                    <Text style={{color:'#675dc6',fontSize:16}}>
                        Create an account
                    </Text>
                </TouchableHighlight>
                 <TouchableHighlight onPress={this.toSignin.bind(this)}>
                    <Text style={{color:'#675dc6', fontSize:16, marginBottom:5, borderBottomWidth:1, borderBottomColor:'#675dc6'}}>Login to your account</Text>
                </TouchableHighlight>
                <Text>By creating an account you consent to the </Text>
                <Text>
                    <Text style={{color:'#675dc6',borderBottomWidth:1, borderBottomColor:'#675dc6'}}>Terms of Use</Text>
                     &nbsp;and&nbsp;
                    <Text style={{color:'#675dc6',borderBottomWidth:1, borderBottomColor:'#675dc6'}}>Privacy Policy</Text>
                </Text>
                <Image style={{width:screenW, resizeMode:'stretch'}} source={require('../resource/qk_signup_feet.png')}/>
            </View>
        )
    }
}