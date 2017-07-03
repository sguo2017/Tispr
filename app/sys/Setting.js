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
import Header from '../components/HomeNavigation';
import PersonalinfoEdit from '../me/personalinfoEdit';
import UserAgreement from './UserAgreement';
import PasswordConfirm from './account/PasswordConfirm';
import userMsg from '../me/personalinfoEdit';
import MyFavorite from './account/MyFavorite';
import UseHelp from './help/UseHelp';
import feedback from './help/feedback';
import inviteFriend from './help/inviteFriend';
import aboutQike from './help/aboutQike';
import others from './others';
import signup from '../pages/signup';
import Constant from '../common/constants'
import PhoneSetting from './account/PhoneSetting';
export default class Setting extends Component {

	constructor(props) {
		super(props);

	}

	_onBack = () => {
		const { navigator } = this.props;
		navigator.pop();
	}
	clickJump =() =>{
		const { navigator } = this.props;
		navigator.push({
			component: UserAgreement,
			name:'UserAgreement'
		})
	}
	async logout(){
		try {
            let t = global.user.authentication_token;
            let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_USER_LOGIN + '/' + global.user.id+'?token=' + t;
            let response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });

            let res = await response.text();
            if (response.status >= 200 && response.status < 300) {
				//console.log('退出登录成功');
                this.props.navigator.resetTo({component:signup}); 
            } else {
                let error = res;
                throw error;
            }
        } catch (error) {
            console.log(`Fetch evaluating list error: ${error}`)
        }
	}
	render() {
		return (
			<View style={styles.container}>
				<Header
					title='个人设置'
					leftIcon={require('../resource/ic_back_white.png')}
					leftIconAction={this._onBack.bind(this)}
				/>
				<ScrollView ref='_scrollView'>
					<View style={{ height: 40, backgroundColor: '#f7f7f7', justifyContent: 'center', paddingLeft: 20 }}>
						<Text style={{ color: '#999999' }}>账户</Text>
					</View>
					<TouchableOpacity style={[styles.rectangle_view, { borderTopColor: '#dedfe0', borderTopWidth: 0.5 }]} onPress={() => this.props.navigator.push({component:PasswordConfirm,name:'PasswordConfirm'})}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={styles.rectangle_text}>账户</Text>
						</View>
						<Image source={require('../resource/g_chevron right.png')} style={{ alignSelf: 'center', width: 20, height: 20 }} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.rectangle_view} onPress={() => this.props.navigator.push({component:userMsg,name:'userMsg', passProps: { info: global.user.profile }})}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={styles.rectangle_text} >
								个人信息
			  			</Text>
						</View>
						<Image source={require('../resource/g_chevron right.png')} style={{ alignSelf: 'center', width: 20, height: 20 }} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.rectangle_view} onPress={() => this.props.navigator.push({component:MyFavorite,name:'MyFavorite'})}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={styles.rectangle_text} >
								我的存档
			  				</Text>
						</View>
						<Image source={require('../resource/g_chevron right.png')} style={{ alignSelf: 'center', width: 20, height: 20 }} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.rectangle_view} onPress={() => this.props.navigator.push({component:PhoneSetting,name:'PhoneSetting'})}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={styles.rectangle_text} >
								电话设置
			  			</Text>
						</View>
						<Image source={require('../resource/g_chevron right.png')} style={{ alignSelf: 'center', width: 20, height: 20 }} />
					</TouchableOpacity>
					<View style={{ height: 40, backgroundColor: '#f7f7f7',justifyContent:'center',paddingLeft:20 }}>
						<Text style={{color:'#999999'}}>帮助</Text>
					</View>
					<TouchableOpacity style={[styles.rectangle_view, { borderTopColor: '#dedfe0', borderTopWidth: 0.5 }]} onPress={() => this.props.navigator.push({component:UseHelp,name:'UseHelp'})}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={styles.rectangle_text} >如何使用</Text>
						</View>
						<Image source={require('../resource/g_chevron right.png')} style={{ alignSelf: 'center', width: 20, height: 20 }} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.rectangle_view} onPress={() => this.props.navigator.push({component:feedback,name:'feedback'})}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }} >
							<Text style={styles.rectangle_text} >
								意见反馈
							</Text>
						</View>
						<Image source={require('../resource/g_chevron right.png')} style={{ alignSelf: 'center', width: 20, height: 20 }} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.rectangle_view} onPress={() => this.props.navigator.push({component:aboutQike,name:'aboutQike'})}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={styles.rectangle_text} >
								关于奇客
			  			</Text>
						</View>
						<Image source={require('../resource/g_chevron right.png')} style={{ alignSelf: 'center', width: 20, height: 20 }} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.rectangle_view} onPress={this.clickJump.bind(this)}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={styles.rectangle_text}>
								用户协议
			  			</Text>
						</View>
						<Image source={require('../resource/g_chevron right.png')} style={{ alignSelf: 'center', width: 20, height: 20 }} />
					</TouchableOpacity>

					<TouchableOpacity style={styles.rectangle_view} onPress={() => this.props.navigator.push({component:inviteFriend,name:'inviteFriend'})}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={styles.rectangle_text} >
								邀请好友
							</Text>
						</View>
						<Image source={require('../resource/g_chevron right.png')} style={{ alignSelf: 'center', width: 20, height: 20 }} />
					</TouchableOpacity>

					<TouchableOpacity style={styles.rectangle_view} onPress={() => this.props.navigator.push({component:others,name:'others'})}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={styles.rectangle_text} >
								其它
			  				</Text>
						</View>
						<Image source={require('../resource/g_chevron right.png')} style={{ alignSelf: 'center', width: 20, height: 20 }} />
					</TouchableOpacity>
					{/*<View style={{ height: 16, backgroundColor: '#f7f7f7' }} />*/}
					<TouchableOpacity style={[styles.rectangle_view, { marginTop: 16, borderTopColor: '#dedfe0', borderTopWidth: 0.5 }]} onPress={this.logout.bind(this)}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={styles.rectangle_text} >
								退出登录
							</Text>
						</View>
						<Image source={require('../resource/g_chevron right.png')} style={{ alignSelf: 'center', width: 20, height: 20 }} />
					</TouchableOpacity>
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f7f7f7',
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
		paddingLeft: 10,
		paddingRight: 15,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: 'white',
		borderBottomColor: '#dedfe0',
		borderBottomWidth: 0.5,
		height:50
	},
	rectangle_text: {
		color: '#1b2833',
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