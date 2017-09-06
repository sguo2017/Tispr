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
           
		});
	}

    render(){
        return(
            <View style={StyleSheet.container}>
                <View>
                    <Header
                        title='推荐好友'
                        leftIcon={require('../resource/ic_back_white.png')}
                        leftIconAction = {()=>this.props.navigator.pop()}
                    />
                </View>
                    <TouchableOpacity  style={styles.loginButton}>
                        <Text>推荐好友</Text>
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
        top: 200,
        bottom: 0,
        right:0,
        left: 0,
        height: 44,
    },
})