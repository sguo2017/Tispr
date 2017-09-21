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
import breakdown from '../sys/others/breakdown'
var Contacts = require('react-native-contacts')
export default class getFriend extends Component {
    constructor(props) {
		super(props);
		this.state =({
           vilageList:[],
           vilageListStatus:[],
		});
	}
    componentWillMount(){
        let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_NEARBY_VILLAGE+ global.user.authentication_token;
        util.get(url,(response)=>{
            if(response.status == 0){
                let length = response.feeds.length
                let statusArray = Array(length).fill(false)
                this.setState({
                    vilageList:response.feeds,
                    vilageListStatus:statusArray
                })
            }
        },(error)=>{
            console.log(error)
            this.props.navigator.push({component:breakdown})
        })
    }
    
    join(v_id,index){
        let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_ADD_VILLAGES+`?token=${global.user.authentication_token}`;
        let data={
            user_id: global.user.id,
            village_id: v_id,
        }
        util.post(url, data, (response)=>{
            let statusArray = this.state.vilageListStatus;
            statusArray[index] = true;
            if(response.status == 0){
                this.setState({
                    vilageListStatus:statusArray
                })
                ToastAndroid.show('加入成功',ToastAndroid.LONG);
            }else{
                ToastAndroid.show('加入失败，最多只能加入6个社区',ToastAndroid.LONG);
            }
        },this.props.navigator)
    }
    out(v_id,index){
        let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_DELETE_VILLAGES+`?token=${global.user.authentication_token}`;
        let data={
            user_id: global.user.id,
            village_id: v_id,
        }
        util.post(url, data, (response)=>{
            if(response.status == 0){
                let statusArray = this.state.vilageListStatus;
                statusArray[index] = false;
                this.setState({
                    vilageListStatus:statusArray
                })
                ToastAndroid.show('退出成功',ToastAndroid.LONG);
            }
        },this.props.navigator)
    }
    render(){
        return (
            <View style={{flex:1}}>
                <Header
                    title='附近的社区'
                    leftIcon={require('../resource/ic_back_white.png')}
                    leftIconAction = {()=>{this.props.navigator.pop()}}
                />
                <FlatList
                    data = {this.state.vilageList}
                    style={{marginBottom:60}}
                    removeClippedSubviews={false}
                    renderItem = {(item)=>{
                        return (
                            <View style={styles.list}>
                               <View>
                                   <Text style={{color:global.gColors.themeColor,fontSize:16}}>{item.item.name}</Text>
                                </View>
                                {
                                    this.state.vilageListStatus[item.index]?
                                    <TouchableOpacity style={{flexDirection:'row'}} onPress ={this.out.bind(this,item.item.id, item.index)} >
                                        <Text style={{fontSize:16,marginRight:20}}>已加入</Text>
                                        <Text style={{color:global.gColors.themeColor,fontSize:16}}>退出</Text>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity onPress ={this.join.bind(this,item.item.id, item.index)} >
                                        <Text style={{color:global.gColors.themeColor,fontSize:16}}>加入</Text>
                                    </TouchableOpacity>
                                }
                                
                            </View>                          
                            );

                    }}
                />
                <TouchableOpacity onPress ={()=>{this.props.navigator.push({component:TabBarView})} } style={styles.loginButton}>
                    <Text style={{color:'#fff'}}>下一步</Text>
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
        height: 40, 
        borderBottomWidth: 1, 
        borderColor: '#eeeeee', 
        alignItems: 'center', 
        flexDirection: 'row', 
        justifyContent: 'space-between',
        marginHorizontal: 16
    }
})