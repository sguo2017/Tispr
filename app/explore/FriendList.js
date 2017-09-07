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
import Me from '../me/index';
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
    jumpUserDetail(user_id){
        this.props.navigator.push({
            component: Me,
            passProps: {
                isBrowseMode: true,
                close: () => {
                    this.props.navigator.pop();
                },
                id: user_id
            }
        })
    }
    render(){
        let f = this.state.friends
        return(
            <ScrollView style={{flex:1, backgroundColor: '#eee',padding: 10}}>
               {
                   f.map((data, index)=>{
                        return(
                            <TouchableOpacity key={index} onPress={this.jumpUserDetail.bind(this, data.id)} style={{flexDirection:'row',alignItems: 'center',margin:6, paddingHorizontal: 12}}>
                                <Image source={{uri: data.avatar}} style={{width:50, height:50, borderRadius:25}}/>
                                <Text style={{color:'#000',margin:10}}>{data.name}</Text>

                            </TouchableOpacity>
                        )
                   })
               } 
            </ScrollView>
        
        )
    }
} 