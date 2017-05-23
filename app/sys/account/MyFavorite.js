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
            <View>
                <Header
					title='我的存档'
					leftIcon={require('../../resource/t_header_arrow_left.png')}
					leftIconAction={()=> this.props.navigator.pop()}
				/>
            </View>
        )
    }
}