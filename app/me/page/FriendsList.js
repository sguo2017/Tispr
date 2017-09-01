import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  InteractionManager,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
  RefreshControl,
  Linking,
  Alert,
  FlatList
} from 'react-native';

import util from '../../common/utils'
import Constant from '../../common/constants'

export default class FriendsList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            friends: [],
            profriends: []
        }
    }

    componentWillMount() {
        try {
            let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_FRIENDS_LIST+ '2?token='+global.user.authentication_token;
            util.get(url, (result) => {
                this.setState({profriends: JSON.parse(result.feeds)});
            },(error) => {

            })
        } catch(error) {
            console.log(error);
        }

        try {
            let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_FRIENDS_LIST+ '1?token='+global.user.authentication_token;
            util.get(url, (result) => {
                this.setState({friends: JSON.parse(result.feeds)});
            },(error) => {

            })
        } catch(error) {
            console.log(error);
        }
    }

    render() {
        let friends = this.state.friends;
        console.log(friends)
        return(
            <ScrollView style={{marginHorizontal: 16, marginVertical: 8}}>
                <View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={{color: 'black'}}>你的推荐</Text>
                        <Text style={{color: '#4a90e2'}}>添加推荐</Text>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={{color: 'black'}}>待验证</Text>
                        <Text style={{color: '#4a90e2'}}>查看全部</Text>
                    </View>
                    <View>
                        <Text style={{color: 'black'}}>好友</Text>
                         { 
                            friends.map((item, index) => {
                                return(
                                    <View style={styles.list}>
                                        <Text style={{color: 'black'}}>{item.friend_name}</Text>
                                    </View>
                                )
                            })
                        } 
                    </View>
                </View>
            </ScrollView>
        )
    }
}
const styles = StyleSheet.create({
    list: {
        height: 40, 
        borderBottomWidth: 1, 
        borderColor: '#eeeeee', 
        alignItems: 'center', 
        flexDirection: 'row', 
        justifyContent: 'space-between',
    }
})