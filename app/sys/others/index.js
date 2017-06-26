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
import { observer } from 'mobx-react/native';
import { observable, computed, action, runInAction } from 'mobx';
import Header from '../../components/HomeNavigation';
import Setting from '../Setting';
import breakdown from './breakdown';
import offline from './offline';
import nationWarning from './nationWarning';
import accountBan from './accountBan';
import sysNotice from './sysNotice';
import restTimes from './restTimes';

export default class others extends Component {

	constructor(props) {
		super(props);

	}

	_onBack = () => {
		const { navigator } = this.props;
		navigator.resetTo({ component: Setting, name: 'Setting' })
	}

	render() {
		return (
			<View style={styles.container}>
				<Header
					title='其它页面'
					leftIcon={require('../../resource/ic_back_white.png')}
					leftIconAction={this._onBack.bind(this)}
				/>
				<ScrollView ref={(scrollView) => { _scrollView = scrollView; }}>
					<View style={{ height: 40, backgroundColor: '#f7f7f7', justifyContent: 'center', paddingLeft: 20 }}>
						<Text style={{ color: '#999999' }}>基础</Text>
					</View>
					<TouchableOpacity style={styles.rectangle_view} onPress={()=>this.props.navigator.push({component:breakdown,name:'breakdown'})}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={styles.rectangle_text} >
								故障
			  				</Text>
						</View>
						<Image source={require('../../resource/ic_my_setting_selected.png')} style={{ alignSelf: 'center', width: 20, height: 20 }} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.rectangle_view} onPress={()=>this.props.navigator.push({component:offline,name:'offline'})}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={styles.rectangle_text} >
								离线
			  			    </Text>
						</View>
						<Image source={require('../../resource/ic_my_setting_selected.png')} style={{ alignSelf: 'center', width: 20, height: 20 }} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.rectangle_view}  onPress={()=>this.props.navigator.push({component:nationWarning,name:'nationWarning'})}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={styles.rectangle_text} >
								登录限制
			  				</Text>
						</View>
						<Image source={require('../../resource/ic_my_setting_selected.png')} style={{ alignSelf: 'center', width: 20, height: 20 }} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.rectangle_view}  onPress={()=>this.props.navigator.push({component:accountBan,name:'accountBan'})}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={styles.rectangle_text} >
								账号封禁
			        		</Text>
						</View>
						<Image source={require('../../resource/ic_my_setting_selected.png')} style={{ alignSelf: 'center', width: 20, height: 20 }} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.rectangle_view} onPress={()=>this.props.navigator.push({component:sysNotice,name:'sysNotice'})}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={styles.rectangle_text} >
								系统通知
			                </Text>
						</View>
						<Image source={require('../../resource/ic_my_setting_selected.png')} style={{ alignSelf: 'center', width: 20, height: 20 }} />
					</TouchableOpacity>	
					<TouchableOpacity style={styles.rectangle_view} onPress={()=>this.props.navigator.push({component:restTimes,name:'restTimes'})}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={styles.rectangle_text} >
								剩余沟通次数
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