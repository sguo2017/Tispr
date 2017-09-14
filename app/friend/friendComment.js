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
    ToastAndroid
} from 'react-native'
import Header from '../components/HomeNavigation';
import Constant from '../common/constants';
import util from '../common/utils'
import recommandSuccess from './recommandSuccess'
export default class friendComment extends Component {
    constructor(props) {
		super(props);
		this.state =({
           content: ''
		});
	}

    commentFriend(){
        let u = this.props.user
        let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_COMMENT + `?token=${global.user.authentication_token}`
        let data={
            comment:{
                obj_id: u.id,
                obj_type: 'user',
                user_id: global.user.id,
                content: this.state.content
            }
        }
        util.post(url, data, (response)=>{
            console.log("32"+JSON.stringify(response.feed))
            if(this.props.newUser){
                this.props.navigator.push({
                    component: recommandSuccess,
                    passProps: {user: this.props.user}
                })
            }else{
                ToastAndroid.show('评价成功',ToastAndroid.LONG);
                this.props.getData(true);
                this.props.navigator.pop();
            }
        },this.props.navigator)
    }

    render(){
        let placeholderContent = "发表你对"+this.props.user.name+"的评价"
        return(
            <View style={styles.container}>
                <View>
                    <Header
                        title='推荐TA'
                        leftIcon={require('../resource/ic_back_white.png')}
                        leftIconAction = {()=>this.props.navigator.pop()}
                    />
                </View>
                <View style={{flexDirection: 'row',margin: 60,justifyContent:'space-around'}}>
                    <Image source={{uri:global.user.avatar}} style={{width:50, height: 50,borderRadius:25}}/>
                    <Image source={require('../resource/ic_account_favour.png')} style={{width:50, height: 50,borderRadius:25}}/>
                    <Image source={{uri:this.props.user.avatar}} style={{width:50, height: 50,borderRadius:25}}/>
                </View>
                <View style={{margin:10}}>
                    <TextInput
                    onChangeText={(text) => this.setState({ content: text })}
                    style={{height:100,borderWidth: 1, borderColor: '#ccc',marginBottom: 20}} 
                    placeholder={placeholderContent}
                    value={this.state.content}
                    underlineColorAndroid="transparent"
                    returnKeyType = 'next'
                    placeholderTextColor  = '#ccc'
                    multiline = {true}
                    />
                    <Text>您的朋友们将会看到您的推荐，稍后向你表示感谢</Text>
                </View>
                <TouchableOpacity onPress={this.commentFriend.bind(this)} style={styles.loginButton}>
                    <Text>完成</Text>
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