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


export default class UseHelp extends Component {

	constructor(props) {
		super(props);

	}


	render() {
		return (
			<View style={{backgroundColor: '#fff', height:global.gScreen.height }}>
				<Header
					title='关于奇客'
					leftIcon={require('../../resource/ic_back_white.png')}
					leftIconAction={()=>this.props.navigator.pop()}
				/>
				<Text style={{alignSelf: 'center',margin:50, color: global.gColors.themeColor,fontWeight:'bold',fontSize:60}}>Qiker</Text>
                <Text style={{color: "black",fontSize:16,margin:16}}>
					为创意类技能服务提供者，如摄影师，设计师，文艺，艺术工作者，文案编辑等，搭建一个基于位置定位的，本地化的，
					人才服务市场。为急需技能服务人才的个人或企业快速雇佣人力资源提供一个人力资源平台。
				</Text>

			</View>
		);
	}
}

const styles = StyleSheet.create({
	
});