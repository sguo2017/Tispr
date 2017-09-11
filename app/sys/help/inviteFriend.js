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
import util from '../../common/utils'
import Constant from '../../common/constants'
export default class UseHelp extends Component {

	constructor(props) {
		super(props);
		this.state = {
            friendCode: ''
        }
	}

	componentWillMount(){
		let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_INVITATION_CODE+ `?token=${global.user.authentication_token}`;
		util.get(url, (response)=>{
			if(response.status == 0){
				this.setState({
					friendCode:response.code
				})
			}else{
				console.log('失败');
			}
		})
	}

	_onBack = () => {
		const { navigator } = this.props;
		navigator.pop()
	}
	
	render() {
		return (
			<View style={styles.container}>
				<Header
					title='邀请好友'
					leftIcon={require('../../resource/ic_back_white.png')}
					leftIconAction={this._onBack.bind(this)}
				/>
				<View>
					<Text  style={{fontSize: 20}}>你的邀请码：{this.state.friendCode}</Text>
				</View>
				<TouchableOpacity style={styles.loginButton}>
					<Text style={styles.loginButtonText}>分享给好友</Text>
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
	loginButton: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: global.gColors.buttonColor,
		position: 'absolute',
		bottom: 0,
		right:0,
		left: 0,
		height: 44,
	},
});