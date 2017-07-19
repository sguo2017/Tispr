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
import Setting from '../Setting';
import HelpDetail from './helpDetail'

export default class UseHelp extends Component {

	constructor(props) {
		super(props);
		this.state = {
			question_num: [false, false, false, false, false, false]
		}
	}

	_onBack = () => {
		const { navigator } = this.props;
		navigator.pop()
	}

	_onDetail = (num) => {
		//const { navigator } = this.props;
		
	}

	render() {
		return (
			<View style={styles.container}>
				<Header
					title='帮助'
					leftIcon={require('../../resource/ic_back_white.png')}
					leftIconAction={this._onBack.bind(this)}
				/>
				<ScrollView ref={(scrollView) => { _scrollView = scrollView; }}>
					<View style={{ height: 40, backgroundColor: '#f7f7f7', justifyContent: 'center', paddingLeft: 20 }}>
						<Text style={{ color: '#999999' }}>常见问题</Text>
					</View>
					<TouchableOpacity style={styles.rectangle_view} 
						onPress={() => {
							let num = 0;
							this.props.navigator.push({ component: HelpDetail, passProps: {num} })
						}}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={styles.rectangle_text} >
								在哪里查看客户项目需求？
			  				</Text>
						</View>
						<Image source={require('../../resource/g_chevron right.png')} style={{ alignSelf: 'center', width: 20, height: 20 }} />
					</TouchableOpacity>
					 <TouchableOpacity style={styles.rectangle_view} 
					 	onPress={() => {
							let num = 1;
							this.props.navigator.push({ component: HelpDetail, passProps: {num} })
						}}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={styles.rectangle_text} >
								竞标项目的流程是怎样？
			  				</Text>
						</View>
						<Image source={require('../../resource/g_chevron right.png')} style={{ alignSelf: 'center', width: 20, height: 20 }} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.rectangle_view}
						onPress={() => {
							let num = 2;
							this.props.navigator.push({ component: HelpDetail, passProps: {num} })
						}}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={styles.rectangle_text} >
								项目服务费用如何结算？
			  				</Text>
						</View>
						<Image 
							source={require('../../resource/g_chevron right.png')} 
							style={{ alignSelf: 'center', width: 20, height: 20 }} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.rectangle_view}
						onPress={() => {
							let num = 3;
							this.props.navigator.push({ component: HelpDetail, passProps: {num} })
						}}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={styles.rectangle_text} >
								平台在交易中收取服务费吗？
			  				</Text>
						</View>
						<Image source={require('../../resource/g_chevron right.png')} style={{ alignSelf: 'center', width: 20, height: 20 }} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.rectangle_view}
						onPress={() => {
							let num = 4;
							this.props.navigator.push({ component: HelpDetail, passProps: {num} })
						}}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={styles.rectangle_text} >
								最多可以发布多少个服务？
			  				</Text>
						</View>
						<Image source={require('../../resource/g_chevron right.png')} style={{ alignSelf: 'center', width: 20, height: 20 }} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.rectangle_view}
						onPress={() => {
							let num = 5;
							this.props.navigator.push({ component: HelpDetail, passProps: {num} })
						}}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={styles.rectangle_text} >
								发布是否需要审核？审核时间多久？
			  				</Text>
						</View>
						<Image source={require('../../resource/g_chevron right.png')} style={{ alignSelf: 'center', width: 20, height: 20 }} />
					</TouchableOpacity> 
				</ScrollView>
				<TouchableOpacity
					style={styles.button}
					onPress={() => { _scrollView.scrollTo({ y: 0 }); }}>
					<Text>回到顶部</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white'
	},
	button: {
		margin: 7,
		padding: 5,
		alignItems: 'center',
		backgroundColor: '#eaeaea',
		borderRadius: 3,
	},
	rectangle_view: {
		paddingTop: 8,
		paddingBottom: 8,
		paddingLeft: 15,
		paddingRight: 15,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: 'white',
		borderBottomColor: '#dedfe0',
		borderBottomWidth: 1,
		height: 50
	},
	rectangle_text: {
		color: 'black',
		fontSize: 16,
		paddingLeft: 8,
	},
});