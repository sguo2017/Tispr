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
import RecommandList from '../../me/page/recommandList';

export default class MyFavorite extends Component{
    render(){
        return(
            <View style={{backgroundColor: 'white', flex: 1}}>
                <Header
					title='我的推荐'
					leftIcon={require('../../resource/ic_back_white.png')}
					leftIconAction={()=> this.props.navigator.pop()}
				/>
				<RecommandList userId={global.user.id} navigator ={this.props.navigator}/> 
            </View>
        )
    }
}