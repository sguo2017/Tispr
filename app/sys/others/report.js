import React, { Component, PureComponent } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    StyleSheet,
    Navigator,
    TouchableHighlight,
    Alert,
    TouchableOpacity,
    ScrollView,
    PixelRatio,
    Platform,
    Keyboard
} from 'react-native'
import Header from '../../components/HomeNavigation';
import Constant from '../../common/constants';
import ImagePicker from 'react-native-image-picker';
import AutoTextInput from '../../components/AutoTextInput';
import Toast from 'react-native-easy-toast';
import SerOfferDetail from '../../explore/ServOfferDetail'
import reportSuccess from './reportSuccess'

export default class PasswordConfirm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: '',
            title: '',
            choices: [false, false, false, false, false, false, false],
            avatarSourceArray: this.props.avatarSourceArray,
            fileName: this.props.fileName,
        };
    }

    async _sendReport() {
        if(this.state.content== ''||this.state.title==''){
            Alert.alert(
                    '提示',
                    '必须选择举报类型并描述',
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
                this.setState({ showProgress: false });
                this.toast.show('上传图片失败,请稍后再试');
                return;
            }
        }
        

        try {
            let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_REPORT + `${global.user.authentication_token}`;
            let response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    report: {
                        obj_id: this.props.obj.id,
                        obj_type: this.props.obj.type,
                        tag: this.state.title,
                        content: this.state.content,
                        image: uploadedImages,
                        user_id: global.user.id,
                    }
                })
            });
            let res = await response.text();
            let result = JSON.parse(res);
            if (response.status >= 200 && response.status < 300) {
                const dismissKeyboard = require('dismissKeyboard'); 
                dismissKeyboard();
                this.props.getData(true);
                this.props.navigator.push({
					name:'reportSuccess',
					component:reportSuccess
				});
            } else {
                let error = res;
                throw error;
            }
        } catch (error) {
            console.log("error " + error);
        }
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
                                    <TouchableOpacity style={{ position: 'absolute', right: 0, top: 0, zIndex: 9999,backgroundColor: '#ffc400', borderRadius: 10, }} onPress={() => { this.deletePhoto(i) }}>
                                        <Image style={{ width: 20, height: 20, borderRadius: 10, }} source={require('../../resource/w-cancel-line-nor.png')} />
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

    render() {
        return (
            <View style={{ backgroundColor: 'white', flex: 1 }}>
                <Header
                    title='举报'
                    leftIcon={require('../../resource/ic_back_white.png')}
                    leftIconAction={() => this.props.navigator.pop()}
                    rightButton='提交'
                    rightButtonAction={this._sendReport.bind(this)}
                />
                <ScrollView>
                    <View style={{ marginHorizontal: 15, marginVertical: 25 }}>
                        <Text style={{ color: '#999999', fontSize: 14 }}>{this.state.title ? this.state.title : '理由'}</Text>
                    </View>
                    <View style={{ flexWrap: 'wrap', flexDirection: 'row', marginLeft: 5 }}>
                        <TouchableOpacity
                            style={[styles.touch, this.state.choices[0] && { backgroundColor: global.gColors.themeColor }]}
                            onPress={() => this.setState({ title: '虚假信息', choices: [true, false, false, false, false, false, false] })}
                        >
                            <Text style={[styles.text, this.state.choices[0] && { color: 'white' }]}>虚假信息</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.touch, this.state.choices[1] && { backgroundColor: global.gColors.themeColor }]}
                            onPress={() => this.setState({ title: '泄露/侵犯他人隐私', choices: [false, true, false, false, false, false, false] })}
                        >
                            <Text style={[styles.text, this.state.choices[1] && { color: 'white' }]}>泄露/侵犯他人隐私</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.touch, this.state.choices[2] && { backgroundColor: global.gColors.themeColor }]}
                            onPress={() => this.setState({ title: '盗用他人作品', choices: [false, false, true, false, false, false, false] })}
                        >
                            <Text style={[styles.text, this.state.choices[2] && { color: 'white' }]}>盗用他人作品</Text>
                        </TouchableOpacity >
                        <TouchableOpacity
                            style={[styles.touch, this.state.choices[3] && { backgroundColor: global.gColors.themeColor }]}
                            onPress={() => this.setState({ title: '侮辱、谩骂、不文明用语', choices: [false, false, false, true, false, false, false] })}
                        >
                            <Text style={[styles.text, this.state.choices[3] && { color: 'white' }]}>侮辱、谩骂、不文明用语</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.touch, this.state.choices[4] && { backgroundColor: global.gColors.themeColor }]}
                            onPress={() => this.setState({ title: '暴力、血腥、色情内容', choices: [false, false, false, false, true, false, false] })}
                        >
                            <Text style={[styles.text, this.state.choices[4] && { color: 'white' }]}>暴力、血腥、色情内容</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.touch, this.state.choices[5] && { backgroundColor: global.gColors.themeColor }]}
                            onPress={() => this.setState({ title: '消极应对、拖延时间', choices: [false, false, false, false, false, true, false] })}
                        >
                            <Text style={[styles.text, this.state.choices[5] && { color: 'white' }]}>消极应对、拖延时间</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.touch, this.state.choices[6] && { backgroundColor: global.gColors.themeColor }]}
                            onPress={() => this.setState({ title: '错误分类', choices: [false, false, false, false, false, false, true] })}
                        >
                            <Text style={[styles.text, this.state.choices[6] && { color: 'white' }]}>错误分类</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginHorizontal: 15, marginVertical: 25 }}>
                        <Text style={{ color: '#999999', fontSize: 14 }}>描述</Text>

                        <AutoTextInput
                            editable={true}
                            style={styles.innput}
                            maxLength={1000}
                            underlineColorAndroid="#F2F2F2"
                            multiline={true}
                            numberOfLines={0}
                            value={this.state.content}
                            autoFocus
                            onChangeText={(val) => {
                                this.setState({ content: val })
                            }}
                        />
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={{ color: '#B8B8B8', fontSize: 12 }}>{this.state.content ? this.state.content.length : 0}/1000</Text>
                        </View>
                    </View>
                    <View style={{ marginHorizontal: 15, marginVertical: 25, flexDirection:'row', justifyContent: 'space-between'}}>
                        <Text style={{ color: '#999999', fontSize: 14 }}>附件</Text>
                        <Text style ={{color: '#B8B8B8', fontSize: 14 }}>{this.state.avatarSourceArray ? this.state.avatarSourceArray.length : 0}/6</Text>
                    </View>
                    {this.generateImageContent()}
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    button: {
        height: 50,
        backgroundColor: global.gColors.themeColor,
        alignSelf: 'stretch',
        marginTop: 10,
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0,
    },
    buttonText: {
        fontSize: 22,
        color: '#FFF',
        alignSelf: 'center'
    },
    input: {
        height: 50,
        margin: 10,
        padding: 4,
        fontSize: 16,
        width: global.gScreen.width - 40,
        // borderWidth: 1,
        borderColor: '#48bbec',
        borderBottomWidth: 1,
        borderBottomColor: '#eeeeee',
    },
    touch: {
        borderRadius: 2,
        borderWidth: 1,
        borderColor: '#4A90E2',
        height: 28,
        paddingHorizontal: 8,
        marginLeft: 8,
        marginBottom: 8
    },
    text: {
        color: '#4A90E2',
        lineHeight: 22
    },
    avatarContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatar: {
        width: 90,
        height: 90,
    },
})