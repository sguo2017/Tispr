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
import RequestsList from '../../me/page/requestsList'

export default class MyFavorite extends Component{
    render(){
        return(
            <View style={{backgroundColor: 'white', flex: 1}}>
                <Header
					title='我的存档'
					leftIcon={require('../../resource/ic_back_white.png')}
					leftIconAction={()=> this.props.navigator.pop()}
				/>
				<RequestsList/> 
            </View>
        )
    }
}