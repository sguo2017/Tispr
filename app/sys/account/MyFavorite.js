import React, { Component, PureComponent } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Image,
	ScrollView,
	TouchableOpacity,
	TouchableHighlight
} from 'react-native'
import Header from '../../components/HomeNavigation';

export default class MyFavorite extends Component{
    render(){
        return(
            <View style={{backgroundColor: '#fff'}}>
                <Header
					title='我的存档'
					leftIcon={require('../../resource/ic_back_white.png')}
					leftIconAction={()=> this.props.navigator.pop()}
				/>
            </View>
        )
    }
}