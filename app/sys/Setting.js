import React, { Component, PureComponent } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Image,
	ScrollView,
	TouchableOpacity,
} from 'react-native'
import { observer } from 'mobx-react/native';
import { observable, computed, action, runInAction } from 'mobx';
import Header from '../components/HomeNavigation';
import PersonalinfoEdit from '../me/personalinfoEdit';

@observer
export default class Setting extends Component {

	constructor(props) {
		super(props);

	}

	_onBack = () => {
		const { navigator } = this.props;
		navigator.resetTo({ component: PersonalinfoEdit, name: 'PersonalinfoEdit' })
	}

	render() {
		return (
			<View style={styles.container}>
				<Header
					title='个人设置'
					leftIcon={require('../resource/t_header_arrow_left.png')}
					leftIconAction={this._onBack.bind(this)}
				/>
				<ScrollView ref={(scrollView) => { _scrollView = scrollView; }}>
					<View style={{ height: 40, backgroundColor: '#f7f7f7', justifyContent: 'center', paddingLeft: 20 }}>
						<Text style={{ color: '#999999' }}>账户</Text>
					</View>
					<View style={styles.rectangle_view}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Image source={require('../resource/ic_my_setting_selected.png')} style={{ alignSelf: 'center', width: 30, height: 30 }} />
							<Text style={styles.rectangle_text} >
								账户
			  </Text>
						</View>
						<Image source={require('../resource/ic_my_setting_selected.png')} style={{ alignSelf: 'center', width: 20, height: 20 }} />
					</View>
					<View style={styles.rectangle_view}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Image source={require('../resource/ic_my_setting_selected.png')} style={{ alignSelf: 'center', width: 30, height: 30 }} />
							<Text style={styles.rectangle_text} >
								个人信息
			  			</Text>
						</View>
						<Image source={require('../resource/ic_my_setting_selected.png')} style={{ alignSelf: 'center', width: 20, height: 20 }} />
					</View>
					<View style={styles.rectangle_view}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Image source={require('../resource/ic_my_setting_selected.png')} style={{ alignSelf: 'center', width: 30, height: 30 }} />
							<Text style={styles.rectangle_text} >
								我的存档
			  	</Text>
						</View>
						<Image source={require('../resource/ic_my_setting_selected.png')} style={{ alignSelf: 'center', width: 20, height: 20 }} />
					</View>
					<View style={{ height: 40, backgroundColor: '#f7f7f7',justifyContent:'center',paddingLeft:20 }}>
						<Text style={{color:'#999999'}}>帮助</Text>
					</View>
					<View style={styles.rectangle_view}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Image source={require('../resource/ic_my_setting_selected.png')} style={{ alignSelf: 'center', width: 30, height: 30 }} />
							<Text style={styles.rectangle_text} >
								如何使用
			        </Text>
						</View>
						<Image source={require('../resource/ic_my_setting_selected.png')} style={{ alignSelf: 'center', width: 20, height: 20 }} />
					</View>
					<View style={styles.rectangle_view}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Image source={require('../resource/ic_my_setting_selected.png')} style={{ alignSelf: 'center', width: 30, height: 30 }} />
							<Text style={styles.rectangle_text} >
								意见反馈
			  </Text>
						</View>
						<Image source={require('../resource/ic_my_setting_selected.png')} style={{ alignSelf: 'center', width: 20, height: 20 }} />
					</View>
					<View style={styles.rectangle_view}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Image source={require('../resource/ic_my_setting_selected.png')} style={{ alignSelf: 'center', width: 30, height: 30 }} />
							<Text style={styles.rectangle_text} >
								关于奇客
			  </Text>
						</View>
						<Image source={require('../resource/ic_my_setting_selected.png')} style={{ alignSelf: 'center', width: 20, height: 20 }} />
					</View>
					<View style={styles.rectangle_view}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Image source={require('../resource/ic_my_setting_selected.png')} style={{ alignSelf: 'center', width: 30, height: 30 }} />
							<Text style={styles.rectangle_text} >
								用户协议
			  </Text>
						</View>
						<Image source={require('../resource/ic_my_setting_selected.png')} style={{ alignSelf: 'center', width: 20, height: 20 }} />
					</View>

					<View style={styles.rectangle_view}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Image source={require('../resource/ic_my_setting_selected.png')} style={{ alignSelf: 'center', width: 30, height: 30 }} />
							<Text style={styles.rectangle_text} >
								邀请好友
			  </Text>
						</View>
						<Image source={require('../resource/ic_my_setting_selected.png')} style={{ alignSelf: 'center', width: 20, height: 20 }} />
					</View>
					<View style={styles.rectangle_view}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Image source={require('../resource/ic_my_setting_selected.png')} style={{ alignSelf: 'center', width: 30, height: 30 }} />
							<Text style={styles.rectangle_text} >
								退出登录
			  </Text>
						</View>
						<Image source={require('../resource/ic_my_setting_selected.png')} style={{ alignSelf: 'center', width: 20, height: 20 }} />
					</View>
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