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
import VillageList from '../../explore/VillageList';

export default class MyFavorite extends Component{
    render(){
        return(
            <View style={{backgroundColor: 'white', flex: 1}}>
                <Header
					title='我的社区'
					leftIcon={require('../../resource/ic_back_white.png')}
					leftIconAction={()=> this.props.navigator.pop()}
				/>
				<VillageList qry_type={2} exploreparams={{title:''}} navigator ={this.props.navigator}/> 
            </View>
        )
    }
}