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
			<View style={{backgroundColor: '#fff', flex: 1 }}>
				<Header
					title='关于我们'
					leftIcon={require('../../resource/ic_back_white.png')}
					leftIconAction={()=>this.props.navigator.pop()}
				/>
				<View style={{alignItems: 'center', paddingHorizontal: 16}}>
					<Image source={require('../../resource/launch-logo-s.png')} style={{marginTop: 62}}/>
					<Text style={{color: '#999999', fontSize: 12, marginTop: 40, marginBottom: 35}}>当前版本  1.01</Text>
					<Text style={{color: "black",fontSize:14, marginBottom:16}}>
						奇客——是一个沟通、协作、基于项目制工作的自由人才服务平台。拥有奇特才华与专业技能的你就是“奇客”。通过平台，奇客们可以轻松获得客户需求信息，即时与客户沟通，高效承接工作任务，开始自由的追求事业梦想！
					</Text>
					<Text style={{color: '#4A90E2'}}>我们致力于创造一个可持续，可信赖，安全可靠的人才服务生态系统。</Text>
				</View>
				<View style={{paddingLeft: 110, marginTop: 45}}>
					<View style={{flexDirection: 'row'}}>
						<Image source={require('../../resource/aboutus-ico-weibo.png')}/>
						<Text style={{color: '#999999', fontSize: 12, lineHeight: 20, marginLeft: 8, marginBottom: 8}}>微博 @奇客qike</Text>
					</View>
					<View style={{flexDirection: 'row'}}>
						<Image source={require('../../resource/aboutus-ico-email.png')}/>
						<Text style={{color: '#999999', fontSize: 12, lineHeight: 20, marginLeft: 8, marginBottom: 8}}>邮箱 info@qikework.com</Text>
					</View>
					<View style={{flexDirection: 'row'}}>
						<Image source={require('../../resource/aboutus-ico-qq.png')}/>
						<Text style={{color: '#999999', fontSize: 12, lineHeight: 20, marginLeft: 8}}>QQ 3558182357</Text>
					</View>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	
});