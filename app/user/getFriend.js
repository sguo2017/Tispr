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
    FlatList
} from 'react-native'
import Header from '../components/HomeNavigation';
import Constant from '../common/constants';
import util from '../common/utils'
var Contacts = require('react-native-contacts')
export default class getFriend extends Component {
    constructor(props) {
		super(props);
		this.state =({
           friends: [],
           friendList:[],
           showList: false
		});
	}
    componentDidMount(){
        Contacts.getAll((err, contacts) => {
            console.log("25:")
            if(err === 'denied'){
                // error
            } else {
                let friendArr = contacts.map((data,index)=>{
                    let thisname='';
                    if(data.familyName){
                        thisname = thisname + data.familyName;
                    }
                    if(data.middleName){
                        thisname = thisname + data.middleName;
                    }
                    if(data.givenName){
                        thisname = thisname + data.givenName;
                    }
                    console.log("31姓名："+thisname+'，号码：'+ data.phoneNumbers[0].number)
                    let thisphone = data.phoneNumbers[0].number
                   // thisphone = thisphone.replace(/" "/g, "");
                    thisphone = thisphone.replace(/\s/g,'');
                    let obj = {user_id: 3, friend_name:thisname, friend_num: thisphone}
                    return obj
                });
                this.setState({friends:friendArr});
                console.log("36姓名："+ friendArr[0].friend_name +'，号码：' + friendArr[0].friend_num);
            }
        })
    }
    getFriendDetail(){
        let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_CONTACTS_LIST;
        let data= {friends: this.state.friends};
        util.post(url,data, (result)=>{
                console.log("55:"+result.feeds[0].friend_name + result.feeds[0].status)
                this.setState({friendList: result.feeds, showList: true})
            },
            this.props.navigator
        )
    }
    _keyExtractor = (item, index) => item.id;
    render(){
        var friendListView = (
            <View>
                <FlatList
                    data = {this.state.friendList}
                    keyExtractor={this._keyExtractor}
                    style={{marginBottom:60}}
                    removeClippedSubviews={false}
                    renderItem = {(item)=>{
                        return (
                                <Text>{item.item.friend_name}{item.item.friend_num}{item.item.status}</Text>                               
                            );

                    }}
                />
            </View>
        )
        return(
            <View style={StyleSheet.container}>
                <View>
                    <Header
                        title='获取通讯录'
                        leftIcon={require('../resource/ic_back_white.png')}
                        leftIconAction = {()=>this.props.navigator.pop()}
                    />
                </View>
                {
                    this.state.showList?friendListView:
                    <TouchableOpacity onPress ={()=> this.getFriendDetail()} style={styles.loginButton}>
                        <Text style={styles.loginButtonText}>查看通讯录</Text>
                    </TouchableOpacity>
                }
                
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