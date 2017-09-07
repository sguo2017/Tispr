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
            friends:[],
            exploretitle:''
        };
    }

    componentWillMount(){
        let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_FRIEND_SEARCH + '?token='+global.user.authentication_token
        Util.get(url, (response)=>{
            this.setState({
                friends: response.feeds
            })
        },(error)=>{
            console.log("21"+error)
        },
        {title:this.props.title}
        )
    }
    render(){
        let f = this.state.friends
        return(
            <ScrollView style={{flex:1, backgroundColor: '#eee',padding: 10}}>
               {
                   f.map((data, index)=>{
                        return(
                            <View key={index} style={{flexDirection:'row',alignItems: 'center',margin:6, paddingHorizontal: 12}}>
                                <Image source={{uri: data.avatar}} style={{width:50, height:50, borderRadius:25}}/>
                                <Text style={{color:'#000',margin:10}}>{data.name}</Text>

                            </View>
                        )
                   })
               } 
            </ScrollView>
        
        )
    }
} 