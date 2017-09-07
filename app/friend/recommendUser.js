import React, { Component, PureComponent } from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	TouchableHighlight,
    Alert,
    TextInput,
    Image,
    ScrollView,
} from 'react-native'
import Header from '../components/HomeNavigation';
import Constant from '../common/constants';
import util from '../common/utils'
var Contacts = require('react-native-contacts')
export default class getFriend extends Component {
    constructor(props) {
		super(props);
		this.state =({
           name:'',
           num: '',
		});
	}
    recommend(){
        let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_ADD_FRIENDS;
        let data={
            friend_name: this.state.name,
            friend_num: this.state.num
        }
        util.post(url, data, (response)=>{
            console.log("32"+JSON.stringify(response.feed))
        },this.props.navigator)
    }

    render(){
        return(
            <View style={StyleSheet.container}>
                <View>
                    <Header
                        title='推荐好友'
                        leftIcon={require('../resource/ic_back_white.png')}
                        leftIconAction = {()=>this.props.navigator.pop()}
                    />
                </View>
                <View style={{ borderBottomWidth: 1, borderBottomColor: '#eeeeee' }} >
                    <TextInput
                    ref = "1"
                    onChangeText={(text) => this.setState({ name: text })}
                    style={styles.input} placeholder="好友姓名"
                    value={this.state.name}
                    underlineColorAndroid="transparent"
                    returnKeyType = 'next'
                    placeholderTextColor  = '#ccc'
                    multiline = {false}
                    />
                </View>
                
                <View style={{ borderBottomWidth: 1, borderBottomColor: '#eeeeee' }} >
                    <TextInput
                    ref = "2"
                    onChangeText={(text) => this.setState({ num: text })}
                    style={styles.input} placeholder="好友手机号"
                    value={this.state.num}
                    underlineColorAndroid="transparent"
                    returnKeyType = 'next'
                    placeholderTextColor  = '#ccc'
                    multiline = {false}
                    />
                </View>
                <TouchableOpacity onPress={this.recommend.bind(this)} style={styles.loginButton}>
                    <Text>推荐好友</Text>
                </TouchableOpacity>
            </View>
        )
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: '#F5FCFF',
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
})