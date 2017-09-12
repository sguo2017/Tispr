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
import commentPage from './friendComment'
export default class recommendUser extends Component {
    constructor(props) {
		super(props);
		this.state =({
           name:'',
           num: '',
           email: '',
		});
	}
    recommend(){
        let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_ADD_FRIENDS + `?token=${global.user.authentication_token}`;
        let data={
            friend_name: this.state.name,
            friend_num: this.state.num,
            user_id: global.user.id,
            catalog_id: this.props.catalog_id,
            catalog_name:this.props.catalog_name,
        }
        util.post(url, data, (response)=>{
            console.log("32"+JSON.stringify(response.feed))
            this.props.navigator.push({
                component: commentPage,
                passProps: {user:response.user}
            })
        },this.props.navigator)
    }

    render(){
        return(
            <View style={styles.container}>
                <View>
                    <Header
                        title='添加专业人士'
                        leftIcon={require('../resource/ic_back_white.png')}
                        leftIconAction = {()=>this.props.navigator.pop()}
                    />
                </View>
                <View style={{ borderBottomWidth: 1, borderBottomColor: '#eeeeee' }} >
                    <TextInput
                    ref = "1"
                    onChangeText={(text) => this.setState({ name: text })}
                    style={styles.input} placeholder="真实姓名"
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
                    style={styles.input} placeholder="手机号码"
                    value={this.state.num}
                    underlineColorAndroid="transparent"
                    returnKeyType = 'next'
                    placeholderTextColor  = '#ccc'
                    multiline = {false}
                    />
                </View>
                <View style={{ borderBottomWidth: 1, borderBottomColor: '#eeeeee' }} >
                    <TextInput
                    ref = "2"
                    onChangeText={(text) => this.setState({ email: text })}
                    style={styles.input} placeholder="电子邮箱"
                    value={this.state.email}
                    underlineColorAndroid="transparent"
                    returnKeyType = 'next'
                    placeholderTextColor  = '#ccc'
                    multiline = {false}
                    />
                </View>
                <TouchableOpacity onPress={this.recommend.bind(this)} style={styles.loginButton}>
                    <Text>保存</Text>
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
        bottom: 0,
        right:0,
        left: 0,
        height: 44,
    },
})