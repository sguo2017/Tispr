import React, { Component, PureComponent } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Image,
	ScrollView,
	TouchableOpacity,
	TouchableHighlight,
	TextInput,
	Alert,
	Platform,
    PixelRatio,
    Keyboard
} from 'react-native'
import Header from '../../components/HomeNavigation';
import Setting from '../Setting';
import feedbackSuccess from './feedbackSuccess';
import Constant from '../../common/constants'
import AutoTextInput from '../../components/AutoTextInput'
import ImagePicker from 'react-native-image-picker';
export default class feedback extends Component {

	constructor(props) {
		super(props);
		this.state =({
			suggestion: '',
			avatarSourceArray: this.props.avatarSourceArray,
		});

	}

	_onBack = () => {
		const { navigator } = this.props;
		navigator.pop()
	}

	uploadImage = (uri) => {
        let formData = new FormData();
        let url = 'http://' + Constant.url.IMG_SERV_ADDR + ':' + Constant.url.IMG_SERV_PORT + Constant.url.SERV_API_IMG_UPLOAD_SERVLET;
        // console.log("url:" + url);
        let file = { uri: uri, type: 'multipart/form-data', name: this.state.fileName };
        formData.append("images", file);

        return fetch(url, {
            method: 'POST',
            mode: "cors",
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        }).then((response) => response.text());
    }


	async sendFeedback(){
		if(this.state.suggestion == ''){
			Alert.alert(
				'提示',
				'必须输入反馈',
				[
					{ text: '继续编辑', onPress: () => console.log('确定') },
				]
			);
            return;
		}
		let uploadedImages = '';
        if(this.state.avatarSourceArray && this.state.avatarSourceArray.length > 0){
            let imageRequests = [];
            this.state.avatarSourceArray.map((source, i) => {
                imageRequests.push(this.uploadImage(source.uri));
            });
            
            try {
                const datas = await Promise.all(imageRequests);
                console.log(datas);
                if (datas == null || datas.length <= 0) throw new Error();
                let seperate = '';
                datas.map((data, i) => {
                    uploadedImages = uploadedImages + seperate + JSON.parse(data).images;
                    seperate = ',';
                });
            } catch (error) {
                this.toast.show('上传图片失败,请稍后再试');
                return;
            }
        }

		try{
			let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_SUGGESTION + global.user.authentication_token;
			let response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    suggestion: {
                        user_id : global.user.id,
						content: this.state.suggestion,
						image: uploadedImages,
                    }
                })
            });
            let res = await response.text();
            console.log(response.status)
            const dismissKeyboard = require('dismissKeyboard'); 
            dismissKeyboard();
            if (response.status >= 200 && response.status < 300) {
                this.props.navigator.push({
					name:'feedbackSuccess',
					component:feedbackSuccess
				});
            } else {
                let error = res;
                throw error;
            }
        } catch (error) {
            console.log("error " + error);
        }
	}

	generateImageContent = () => {
        const hasImage = this.state.avatarSourceArray != null && this.state.avatarSourceArray.length > 0;
        const fullImage = this.state.avatarSourceArray != null && this.state.avatarSourceArray.length >= 6;
        return (
            <View style={{ marginLeft: 10, flexWrap: 'wrap', flexDirection: 'row', marginTop: 5 }}>
                {
                    hasImage ?
                        this.state.avatarSourceArray.map((source, i) => {
                            return (
                                <View key={i} style={[styles.avatar, styles.avatarContainer, { marginBottom: 5, marginLeft: 5, }]}>
                                    <TouchableOpacity style={{ position: 'absolute', right: 0, top: 0, zIndex: 9999,borderRadius: 10, backgroundColor: '#FFC400'}} onPress={() => { this.deletePhoto(i) }}>
                                        <Image style={{ width: 20, height: 20, borderRadius: 10,  }} source={require('../../resource/w-cancel-line-nor.png')} />
                                    </TouchableOpacity>
                                    <Image style={styles.avatar} source={source} />
                                </View>
                            );
                        }) : null
                }
                {
                    fullImage ?
                        null :
                        (
                            <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
                                <View style={[styles.avatar, styles.avatarContainer, { marginBottom: 5, marginLeft: 5, }]}>
                                    <Image style={{ width: 90, height: 90, alignSelf: 'center' }} source={require('../../resource/t_img_upload_nil.png')} />
                                </View>
                            </TouchableOpacity>
                        )
                }
            </View>
        );
	}

	selectPhotoTapped() {
        const options = {
            title: '请选择',
            cancelButtonTitle: '取消',
            takePhotoButtonTitle: '拍照',
            chooseFromLibraryButtonTitle: '选择相册',
            quality: 0.75,
            maxWidth: 500,
            maxHeight: 500,
            allowsEditing: true,
            noData: false,
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };

        ImagePicker.showImagePicker(options, (response) => {
            // console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled photo picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                var source, temp, fName;
                let imgArray;
                if (this.state.avatarSourceArray === undefined) {
                    imgArray = [];
                }
                else {
					imgArray = this.state.avatarSourceArray.slice(0);
					console.log('rrr')
                }
                // You can display the image using either:
                //source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};

                temp = response.data;

                //Or:
                if (Platform.OS === 'android') {
                    source = { uri: response.uri, isStatic: true };
                } else {
                    source = { uri: response.uri.replace('file://', ''), isStatic: true };
				}
                imgArray.push(source);
                fName = response.fileName;
                this.setState({
                    avatarSourceArray: imgArray,
                    fileName: fName,
                })
            }
        });
    }
	
	deletePhoto = (index) => {
        Alert.alert(
            '提示',
            '确认删除该图片?',
            [
                { text: '取消', onPress: () => { } },
                {
                    text: '确定', onPress: () => {
                        let imgArray = this.state.avatarSourceArray.slice(0);
                        if (index == imgArray.length - 1) {
                            imgArray.pop();
                        } else if (index == 0) {
                            imgArray = imgArray.slice(1);
                        } else {
                            imgArray = imgArray.slice(0, index).concat(imgArray.slice(index + 1));
                        }
                        this.setState({
                            avatarSourceArray: imgArray,
                        });
                    }
                },
            ]
        )
    }

	render() {
		return (
			<View style={{flex: 1, backgroundColor: '#fff'}}>
				<Header
					title='意见反馈'
					leftIcon={require('../../resource/ic_back_white.png')}
					leftIconAction={this._onBack.bind(this)}
				/>
				<View style={{justifyContent:'flex-end', margin:10}}>
                    <AutoTextInput
                    style={{flexDirection:'row',width: global.gScreen.width-20, fontSize: 16}}
                    multiline={true}
                    numberOfLines={1}
					placeholder='输入您的意见和建议'
					underlineColorAndroid="#dedfe0"
					val={this.state.suggestion}
					onChangeText={(val) => {
                      this.setState({ suggestion: val});
                    }}
                    />
					<Text style={{color: '#B8B8B8', fontSize: 12, marginLeft: 300}}>{this.state.suggestion?this.state.suggestion.length:0}/200</Text>
                </View>
				<View style={{ marginHorizontal: 15, marginVertical: 25, flexDirection:'row', justifyContent: 'space-between'}}>
					<Text style={{ color: '#999999', fontSize: 14 }}>附件</Text>
					<Text style ={{color: '#4990e2', fontSize: 14 }}>{this.state.avatarSourceArray ? this.state.avatarSourceArray.length : 0}/6</Text>
				</View>
				{this.generateImageContent()}
				<TouchableHighlight onPress={this.sendFeedback.bind(this)} style={[styles.button, { backgroundColor: global.gColors.buttonColor, flexShrink: 0, width: global.gScreen.width }]}>
                    <Text style={styles.buttonText}>
                        确定
                    </Text>
                </TouchableHighlight>
			</View>
		);
	}
}

const styles = StyleSheet.create({
 button: {
    height: 50,
    backgroundColor: global.gColors.themeColor,
    alignSelf: 'stretch',
    //marginTop: 10,
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0
  },
  buttonText: {
    fontSize: 22,
    color: '#FFF',
    alignSelf: 'center',
  },
    avatarContainer: {
       // borderColor: '#9B9B9B',
       // borderWidth: 1 / PixelRatio.get(),
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatar: {
        width: 90,
		height: 90,
		borderRadius: 4
    },
});