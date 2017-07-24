import React, { Component, PureComponent } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Image,
	ScrollView,
	TouchableOpacity,
	TouchableHighlight,
	TextInput
} from 'react-native'

import Header from '../../components/HomeNavigation';
import Setting from '../Setting';
import HelpDetail from './helpDetail'

export default class UseHelp extends Component {

	constructor(props) {
		super(props);
		this.state = {
			question_num: [false, false, false, false, false, false],
			content: ''
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
					rightButton='联系我们'
				/>
				<View style={{backgroundColor: '#4a90e2', height: 40, marginTop: -2, paddingLeft: 16}}>
					<View style={styles.searchBox}>
						<Image source={require('../../resource/w-search.png')} style={styles.searchIcon} />
						<TextInput style={styles.inputText}
							underlineColorAndroid='transparent'
							keyboardType='web-search'
							value={this.state.content}
							placeholder='搜索'
							returnKeyType = 'search'
							returnKeyLabel = 'search'
							placeholderTextColor='white'
							selectTextOnFocus ={true}
							onChangeText={(val) => {
								this.setState({ content: val })
							}}
						/>
					</View>
				</View>
				<ScrollView ref={(scrollView) => { _scrollView = scrollView; }}>
					<View style={{ height: 40, backgroundColor: '#f7f7f7', justifyContent: 'center', paddingLeft: 20 }}>
						<Text style={{ color: '#999999' }}>常见问题</Text>
					</View>
					<TouchableOpacity style={styles.rectangle_view} 
						onPress={() => {
							let num = 0;
							let title = '在哪里查看客户项目需求？';
							this.props.navigator.push({ component: HelpDetail, passProps: {num, title} })
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
							let title = '竞标项目的流程是怎样？';
							this.props.navigator.push({ component: HelpDetail, passProps: {num, title} })
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
							let title = '项目服务费用如何结算？';
							this.props.navigator.push({ component: HelpDetail, passProps: {num, title} })
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
							let title = '平台在交易中收取服务费吗？'
							this.props.navigator.push({ component: HelpDetail, passProps: {num, title} })
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
							let title = '最多可以发布多少个服务？';
							this.props.navigator.push({ component: HelpDetail, passProps: {num, title} })
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
							let title = '发布是否需要审核？审核时间多久？'
							this.props.navigator.push({ component: HelpDetail, passProps: {num, title} })
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
	searchBox: {//搜索框
        flexDirection: 'row',   // 水平排布
        borderRadius: 5,  // 设置圆角边
        backgroundColor: 'rgba(255,255,255,0.24)',
        alignItems: 'center',
        width: 330,
        height: 32,
    },
    searchIcon: {//搜索图标
        height: 24,
        width: 24,
        marginLeft: 5,
        resizeMode: 'stretch'
    },
    inputText: {
        backgroundColor: 'transparent',
        fontSize: 14,
        width: 330,
        padding: 0,
    },
});