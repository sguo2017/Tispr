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
import recommand from './recommendUser';
var Contacts = require('react-native-contacts')
export default class chooseInvited extends Component {
    constructor(props) {
		super(props);
		this.state =({
           friends: [],
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
                    let thisphone = data.phoneNumbers[0].number
                    thisphone = thisphone.replace(/\s/g,'');
                    let obj = {user_id: global.user.id, friend_name:thisname, friend_num: thisphone}
                    return obj
                });
                this.setState({friends:friendArr});
            }
        })
    }
    invite(item){
        this.props.navigator.push({
            component:recommand,
            passProps: {
                catalog_id:this.props.catalog_id,
                catalog_name: this.props.catalog_name,
                friend_name: item.friend_name,
                friend_num: item.friend_num
            }
        })
    }
   
    _keyExtractor = (item, index) => item.id;
    render(){
        return(
            <View style={{flex:1,backgroundColor:'#fff'}}>
                <Header
                    title='从通讯录添加'
                    leftIcon={require('../resource/ic_back_white.png')}
                    leftIconAction = {()=>this.props.navigator.pop()}
                />
                <FlatList
                    data = {this.state.friends}
                    keyExtractor={this._keyExtractor}
                    style={{marginBottom:60}}
                    removeClippedSubviews={false}
                    renderItem = {(item)=>{
                        return (
                            <TouchableOpacity style={styles.list} onPress={this.invite.bind(this,item.item)}>
                                <Text style={{color: global.gColors.themeColor, fontSize:16}}>{item.item.friend_name}</Text>
                                <Text style={{color: global.gColors.themeColor, fontSize:16}}>添加</Text>
                            </TouchableOpacity>                          
                            );

                    }}
                />
                <TouchableOpacity onPress ={()=> {}} style={styles.loginButton}>
                    <Text style={styles.loginButtonText}>下一步</Text>
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
    list: {
        height: 60, 
        borderBottomWidth: 1, 
        borderColor: '#eeeeee', 
        alignItems: 'center', 
        flexDirection: 'row', 
        justifyContent: 'space-between',
        marginHorizontal: 16
    },
    loginButtonText:{
        color:'#fff'
    }
})