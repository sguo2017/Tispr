import React, { Component, PureComponent } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Image,
	ScrollView,
	TouchableOpacity,
	TouchableHighlight,
	Modal,
	TouchableWithoutFeedback
} from 'react-native'
import * as WeChat from 'react-native-wechat';
import { observer } from 'mobx-react/native';
import { observable, computed, action, runInAction } from 'mobx';
import Header from '../../components/HomeNavigation';
import Setting from '../Setting';
import util from '../../common/utils'
import Constant from '../../common/constants'
export default class UseHelp extends Component {

	constructor(props) {
		super(props);
		WeChat.registerApp('wxa2a9d26bbc09d4ac');
		this.state = {
			friendCode: '',
			showModal: false
		}
	}

	componentWillMount() {
		let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_INVITATION_CODE + `?token=${global.user.authentication_token}`;
		util.get(url, (response) => {
			if (response.status == 0) {
				this.setState({
					friendCode: response.code
				})
			} else {
				console.log('失败');
			}
		})
	}

	_onBack = () => {
		const { navigator } = this.props;
		navigator.pop()
	}
	shareToWechatCircle() {
		WeChat.isWXAppInstalled()
			.then((isInstalled) => {
				if (isInstalled) {
					WeChat.shareToTimeline({
						title: "发现身边的人才",
						description: "发现身边的人才",
						thumbImage: global.user.avatar,
						type: 'news',
						webpageUrl: 'http://' + Constant.url.SHARE_SERV_ADDR + ':' + Constant.url.SHARE_SERV_PORT + '/goods_show?id=478' 
					})
						.catch((error) => {
							console.log("583" + JSON.stringify(error));

							if (error instanceof WeChat.WechatError) {
								console.error(error.stack);
							} else {
								throw error;
							}
						});
				} else {
					console.log('没有安装微信软件，请您安装微信之后再试');
				}
			});
	}
	shareToWechat() {
		WeChat.isWXAppInstalled()
			.then((isInstalled) => {
				if (isInstalled) {
					WeChat.shareToSession({
						title: "发现身边的人才",
						description: "发现身边的人才",
						thumbImage: global.user.avatar,
						type: 'news',
						webpageUrl: 'http://' + Constant.url.SHARE_SERV_ADDR + ':' + Constant.url.SHARE_SERV_PORT + '/goods_show?id=478'
					})
						.catch((error) => {
							console.log("566" + JSON.stringify(error));
						});
				} else {
					console.log('没有安装微信软件，请您安装微信之后再试');
				}
			});
	}
	render() {
		return (
			<View style={styles.container}>
				{this.state.showModal?
                <View style={styles.cover}></View>
                :null}
				<Header
					title='邀请好友'
					leftIcon={require('../../resource/ic_back_white.png')}
					leftIconAction={this._onBack.bind(this)}
				/>
				<View>
					<Text style={{ fontSize: 20 }}>你的邀请码：{this.state.friendCode}</Text>
				</View>
				<TouchableOpacity style={styles.loginButton} onPress={() => this.setState({ showModal: true })}>
					<Text style={styles.loginButtonText}>分享给好友</Text>
				</TouchableOpacity>
				<Modal
					animationType='slide'
					transparent={true}
					visible={this.state.showModal}
					onShow={() => { }}
					onRequestClose={() => { }}
				>
					<TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => this.setState({ showModal: false })}>
						<View style={styles.modalContainer}>
							<View style={styles.modal}>
								<TouchableWithoutFeedback onPress={() => { }}>
									<View style={{ borderRadius: 10, backgroundColor: 'white', height: 112, alignItems: 'center', justifyContent: 'center' }}>
										<View style={styles.share}>
											<TouchableOpacity style={styles.item} onPress={this.shareToWechat.bind(this)}>
												<Image source={require('../../resource/ico-wechat.png')} style={styles.img}></Image>
												<Text style={styles.text}>微信</Text>
											</TouchableOpacity>
											<TouchableOpacity style={styles.item}
												onPress={this.shareToWechatCircle.bind(this)}
											>
												<Image source={require('../../resource/ico-friend.png')} style={styles.img}></Image>
												<Text style={styles.text}>朋友圈</Text>
											</TouchableOpacity>
										</View>
									</View>
								</TouchableWithoutFeedback>
								<TouchableOpacity
									onPress={() => this.setState({ showModal: false })}
									style={{ alignItems: 'center', justifyContent: 'center', marginTop: 6, borderRadius: 10, backgroundColor: 'white', height: 56 }}>
									<Text style={styles.cancel}>取消</Text>
								</TouchableOpacity>
							</View>
						</View>
					</TouchableWithoutFeedback>
				</Modal>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	cover: {
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        position: 'absolute', 
        top: 0, 
        left: 0, 
        height: global.gScreen.height, 
        width: global.gScreen.width, 
        zIndex: 99
    },
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
		right: 0,
		left: 0,
		height: 44,
	},
	modalContainer:{  
        flex:1,  
        backgroundColor: 'transparent',  
        justifyContent:'center',  
        alignItems:'center'  
    }, 
	modal: {
        marginTop: 300,
        width: global.gScreen.width,
        position: 'absolute',
        bottom: 0,
        height: 180, 
        borderTopWidth: 0,
        paddingHorizontal: 8, 
        backgroundColor: 'transparent'
    },
    share: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        //marginTop: 20
    },
    item: {
        marginRight: 40,
        flexDirection: 'column',
        alignItems: 'center'
    },
    img: {
        height: 48,
        width: 48,
    },
    text: {
        fontSize: 12,
        color: '#1B2833',
    },
    cancel: {
        color: '#1B2833',
        fontSize: 16,
        //marginTop: 30,
        marginHorizontal: 132
    },
});