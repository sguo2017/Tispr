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

export default class UseHelp extends Component {

	constructor(props) {
		super(props);

	}

	_onBack = () => {
		const { navigator } = this.props;
		navigator.pop()
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
						<Text style={{ color: '#999999' }}>基础</Text>
					</View>
					<TouchableOpacity style={styles.rectangle_view}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={styles.rectangle_text} >
								入门指南
			  				</Text>
						</View>
						<Image source={require('../../resource/ic_my_setting_selected.png')} style={{ alignSelf: 'center', width: 20, height: 20 }} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.rectangle_view}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={styles.rectangle_text} >
								什么是奇客
			  			</Text>
						</View>
						<Image source={require('../../resource/ic_my_setting_selected.png')} style={{ alignSelf: 'center', width: 20, height: 20 }} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.rectangle_view}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={styles.rectangle_text} >
								如何下载奇客
			  				</Text>
						</View>
						<Image source={require('../../resource/ic_my_setting_selected.png')} style={{ alignSelf: 'center', width: 20, height: 20 }} />
					</TouchableOpacity>
					<View style={styles.rectangle_view}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={styles.rectangle_text} >
								如何注册和登录我的账户
			        </Text>
						</View>
						<Image source={require('../../resource/ic_my_setting_selected.png')} style={{ alignSelf: 'center', width: 20, height: 20 }} />
					</View>
					<View style={styles.rectangle_view}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={styles.rectangle_text} >
								社会准则
			                </Text>
						</View>
						<Image source={require('../../resource/ic_my_setting_selected.png')} style={{ alignSelf: 'center', width: 20, height: 20 }} />
					</View>
					<View style={styles.rectangle_view}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={styles.rectangle_text} >
								如何创建和修改我的信息
			  			</Text>
						</View>
						<Image source={require('../../resource/ic_my_setting_selected.png')} style={{ alignSelf: 'center', width: 20, height: 20 }} />
					</View>
                    <View style={{ height: 40, backgroundColor: '#f7f7f7',justifyContent:'center',paddingLeft:20 }}>
						<Text style={{color:'#999999'}}>保证品质</Text>
					</View>
					<TouchableOpacity style={styles.rectangle_view}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={styles.rectangle_text}>
								安全与信任
			  			    </Text>
						</View>
						<Image source={require('../../resource/ic_my_setting_selected.png')} style={{ alignSelf: 'center', width: 20, height: 20 }} />
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
		backgroundColor: 'white',
	},
	three_image_view: {
		paddingTop: 15,
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		backgroundColor: 'white',
	},
	vertical_view: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'white',
		paddingBottom: 15,
	},
	top_text: {
		marginTop: 5,
		color: 'black',
		fontSize: 16,
		textAlign: 'center'
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
	},
	rectangle_text: {
		color: 'black',
		fontSize: 16,
		textAlign: 'center',
		paddingLeft: 8,
	},
	button: {
		margin: 7,
		padding: 5,
		alignItems: 'center',
		backgroundColor: '#eaeaea',
		borderRadius: 3,
	},

});