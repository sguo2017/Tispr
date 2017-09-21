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
    FlatList,
    ToastAndroid
} from 'react-native'
import Header from '../components/HomeNavigation';
import Constant from '../common/constants';
import util from '../common/utils'
import TabBarView from '../containers/TabBarView';
import uploadAvatar from './uploadAvatar';
var Contacts = require('react-native-contacts')
export default class getFriend extends Component {
    constructor(props) {
		super(props);
		this.state =({
           friends: [],
           friendList:[],
           friendListStatus: [],
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
                    let obj = {user_id: global.user.id, friend_name:thisname, friend_num: thisphone}
                    return obj
                });
                this.setState({friends:friendArr});
                console.log("36姓名："+ friendArr[0].friend_name +'，号码：' + friendArr[0].friend_num);
            }
        })
    }
    getFriendDetail(){
        let friendList = [];
        let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_CONTACTS_LIST+ `?token=${global.user.authentication_token}`;
        let data= {friends: this.state.friends};
        util.post(url,data, (result)=>{
                console.log("55:"+result.feeds[0].friend_name + result.feeds[0].status)
                console.log(result.feeds[2])
                let length = result.feeds.length
                let statusArray = Array(length).fill(true)
                this.setState({friendList: result.feeds, showList: true, friendListStatus: statusArray})
                friendList = result.feeds;
            },
            this.props.navigator
        )
        
    }

    async deleteFriend(id,index) {
        try {
            let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_DELETE_FRIEND+'/'+ id + '?token='+ global.user.authentication_token;
            let response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            let res = await response.text();
            if (response.status >= 200 && response.status < 300) {
                let resObject =JSON.parse(res);
                if(resObject.status==0){
                    let statusArray = this.state.friendListStatus;
                    statusArray[index] = false;
                    this.setState({
                        friendListStatus:statusArray
                    })
                }else{
                    ToastAndroid.show('移除失败',ToastAndroid.SHORT);
                }
            }
        } catch(error) {
            console.log(107)
        }
    }
    addFriend(id,index){
        let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_ADD_FRIENDS+'/'+id +'?token='+global.user.authentication_token;
        let data = {
            status: 'created'
        }
        util.patch(url, data,(result)=>{
            let statusArray = this.state.friendListStatus;
            statusArray[index] = true;
            if(result.status == 0){
                this.setState({
                    friendListStatus:statusArray
                })
            }else{
                ToastAndroid.show('添加失败',ToastAndroid.SHORT);
            }
        }, this.props.navigator)
    }
    toUploadAvatar(){
        const { navigator} = this.props;
        navigator.push({
            component: uploadAvatar
        })
    }
    _keyExtractor = (item, index) => item.id;
    render(){
        var friendListView = (
            <View style={{flex:1}}>
                <Header
                    title='你的朋友'
                    leftIcon={require('../resource/ic_back_white.png')}
                    leftIconAction = {()=>this.props.navigator.resetTo({component: uploadAvatar})}
                />
                <FlatList
                    data = {this.state.friendList}
                    keyExtractor={this._keyExtractor}
                    style={{marginBottom:60}}
                    removeClippedSubviews={false}
                    renderItem = {(item)=>{
                        return (
                            <View style={styles.list}>
                                <Text style={{color: 'black', }}>{item.item.friend_name}</Text>
                                { this.state.friendListStatus[item.index]?
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <Text>已自动添加为好友</Text>
                                 <TouchableOpacity style={{marginLeft: 10}} onPress={this.deleteFriend.bind(this, item.item.id, item.index)}>
                                     <Text style={{color: 'red', }}>移除好友</Text>
                                 </TouchableOpacity>

                                </View>:
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <Text>已解除好友关系</Text>
                                 <TouchableOpacity style={{marginLeft: 10}} onPress={this.addFriend.bind(this, item.item.id, item.index)}>
                                     <Text style={{color: 'red', }}>加为好友</Text>
                                 </TouchableOpacity>
                                </View>
                                }
                            </View>                          
                            );

                    }}
                />
                <TouchableOpacity onPress ={()=> this.toUploadAvatar()} style={styles.loginButton}>
                    <Text style={styles.loginButtonText}>下一步</Text>
                </TouchableOpacity>
            </View>
        )
        return(
            <View style={styles.container}>
                {
                    this.state.showList?friendListView:
                    <View style={{flex:1}}>
                        <Header
                            title='获取通讯录'
                            leftIcon={require('../resource/ic_back_white.png')}
                            leftIconAction = {()=>this.props.navigator.resetTo({component: uploadAvatar})}
                            rightButton='跳过'
                            rightButtonAction= {()=>this.props.navigator.resetTo({component: uploadAvatar})}
                
                        />
                        <View style={{justifyContent: 'center',alignItems: 'center'}}>
                            <Text style={{fontSize: 16,margin:20, color: '#000'}}>找找哪些熟人在用奇客</Text>
                            <Text>将展示出你可能认识的好友，他们也正在使用奇客</Text>                            
                        </View>
                        <TouchableOpacity onPress ={()=> this.getFriendDetail()} style={styles.loginButton}>
                            <Text>确定</Text>
                        </TouchableOpacity>
                    </View>
                    
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
        bottom: 0,
        right:0,
        left: 0,
        height: 44,
    },
    list: {
        height: 40, 
        borderBottomWidth: 1, 
        borderColor: '#eeeeee', 
        alignItems: 'center', 
        flexDirection: 'row', 
        justifyContent: 'space-between',
        marginHorizontal: 16
    }
})