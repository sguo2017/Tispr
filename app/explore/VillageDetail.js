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
} from 'react-native'
import Header from '../components/HomeNavigation';
import Constant from '../common/constants';
import util from '../common/utils'
var Contacts = require('react-native-contacts')
export default class getFriend extends Component {
    constructor(props) {
		super(props);
		this.state =({
           name:'',
           num: '',
		});
	}
    join(){
        // let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_ADD_FRIENDS;
        // let data={
        //     friend_name: this.state.name,
        //     friend_num: this.state.num
        // }
        // util.post(url, data, (response)=>{
        //     console.log("32"+JSON.stringify(response.feed))
        // },this.props.navigator)
    }

    render(){
        let v = this.props.village
        return(
            <View style={styles.container}>
                <View>
                    <Header
                        title='社区详情'
                        leftIcon={require('../resource/ic_back_white.png')}
                        leftIconAction = {()=>this.props.navigator.pop()}
                    />
                </View>
                <View>
                    <Text style ={{fontSize:20,alignSelf: 'center'}}>{v.name}</Text>
                </View>
                <TouchableOpacity onPress={this.join.bind(this)} style={styles.loginButton}>
                    <Text>加入社区</Text>
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