import React, { Component, PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    TouchableHighlight,
    ToastAndroid
} from 'react-native'
import Header from '../../components/HomeNavigation';
import Constant from '../../common/constants';
import util from '../../common/utils'
export default class MyPending extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profriends: []
        }
    }
    componentWillMount() {
        try {
            let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_FRIENDS_LIST + '?user_id=' + global.user.id + '&qry_type=2&token=' + global.user.authentication_token;
            util.get(url, (result) => {
                this.setState({ profriends: JSON.parse(result.feeds) });
            }, (error) => {

            })
        } catch (error) {
            console.log(error);
        }
    }
     agreeApply(id) {
        let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_AGREE_FRIENDS + '/' + id + `?token=${global.user.authentication_token}`
        let data = {
            status: 'created',
        }
        util.patch(url, data, (response) => {
            if (response.status == 0) {
                ToastAndroid.show('你和他成为了好友', ToastAndroid.LONG);
            }
        }, this.props.navigator)
    }
    render() {
        let profriends = this.state.profriends;
        return (
            <View style={{ backgroundColor: 'white', flex: 1 }}>
                <Header
                    title='待验证好友'
                    leftIcon={require('../../resource/ic_back_white.png')}
                    leftIconAction={() => this.props.navigator.pop()}
                />
                {
                    profriends[0] ?
                        <View style={{ justifyContent: 'flex-start' }}>
                            {
                                profriends.map((item, index) => {
                                    return (
                                        <View style={styles.list} key={item.id}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', margin: 6, paddingHorizontal: 12 }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Image source={{ uri: item.avatar }} style={{ width: 50, height: 50, borderRadius: 25 }} />
                                                    <Text style={{ color: 'black', marginLeft: 20 }}>{item.friend_name}</Text>
                                                </View>
                                                <TouchableOpacity onPress={this.agreeApply.bind(this, item.id)}>
                                                    <Text style={{ color: global.gColors.themeColor }}>通过验证</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )
                                })
                            }
                        </View>
                        :
                        null
                }

            </View>
        )
    }
}