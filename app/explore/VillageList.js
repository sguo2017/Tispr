import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  RefreshControl,
  Linking,
  Alert,
} from 'react-native';
import Util from '../common/utils';
import Constant from '../common/constants';
export default class FriendList extends Component{

    constructor(props) {
        super(props);
        this.state = {
            villages:[],
            exploretitle:''
        };
    }

    componentWillMount(){
        let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_VILLAGE_SEARCH + '?token='+global.user.authentication_token
        Util.get(url, (response)=>{
            this.setState({
                villages: response.feeds
            })
        },(error)=>{
            console.log("21"+error)
        },
        {title:this.props.title}
        )
    }
    jumpVillageDetail(user_id){

    }
    render(){
        let v = this.state.villages
        return(
            <ScrollView style={{flex:1, backgroundColor: '#eee',padding: 10}}>
               {
                   v.map((data, index)=>{
                        return(
                            <TouchableOpacity key={index} onPress={this.jumpVillageDetail.bind(this, data.id)} style={{flexDirection:'row',alignItems: 'center',margin:6, paddingHorizontal: 12}}>
                                <Text style={{color:'#000',margin:10}}>{data.name}</Text>
                            </TouchableOpacity>
                        )
                   })
               } 
            </ScrollView>
        
        )
    }
} 