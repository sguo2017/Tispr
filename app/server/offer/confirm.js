import React, { Component, PureComponent } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    ProgressBarAndroid,
    TouchableOpacity,
    TouchableHighlight,
    Platform,
    StyleSheet,
    Navigator,
    AsyncStorage,
    PixelRatio,
    Alert
} from 'react-native'
import { observer } from 'mobx-react/native'
import { observable, computed, action, runInAction } from 'mobx';
import ImagePicker from 'react-native-image-picker';
import Header from '../../components/HomeNavigation';
import UselessTextInput from '../../components/UselessTextInput';
import Constant from '../../common/constants';
import UserDefaults from '../../common/UserDefaults';

@observer
export default class ServOfferConfirm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            serv_title: this.props.serv_title,
            serv_detail: this.props.serv_detail,
            serv_imges: this.props.serv_imges,
            errors: this.props.errors,
            fileName: this.props.fileName,
            avatarSource: this.props.avatarSource,
            imgBase64: this.props.imgBase64,
        }
    }

    componentDidMount() {
        this.setState({
            serv_title: this.props.serv_title,
            serv_detail: this.props.serv_detail,
            serv_imges: this.props.serv_imges,
            errors: this.props.errors,
            fileName: this.props.fileName,
            avatarSource: this.props.avatarSource,
            imgBase64: this.props.imgBase64,
        });
    }

    clickJump() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop();　　//navigator.pop 使用当前页面出栈, 显示上一个栈内页面.
        }
    }

    _onBack = () => {
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop({
                params: {
                    serv_title: this.state.serv_title,
                    serv_detail: this.state.serv_detail,
                }
            });
        }
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
            console.log('Response = ', response);

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
                // You can display the image using either:
                //source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};

                temp = response.data;

                //Or:
                if (Platform.OS === 'android') {
                    source = { uri: response.uri, isStatic: true };
                } else {
                    source = { uri: response.uri.replace('file://', ''), isStatic: true };
                }

                fName = response.fileName;
                this.setState({
                    avatarSource: source,
                    imgBase64: temp,
                    fileName: fName
                });

                this.uploadImage();

            }
        });
    }

    async onServOfferPres() {
        this.setState({ showProgress: true })
        try {
            let t = await UserDefaults.cachedObject(Constant.storeKeys.ACCESS_TOKEN_TISPR);
            let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_SERV_OFFER_ADD + t;
            console.log("url:"+url);
            let response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    serv_offer: {
                        serv_title: this.state.serv_title,
                        serv_detail: this.state.serv_detail,
                        serv_imges: this.state.serv_imges,
                    }
                })
            });

            let res = await response.text();
            if (response.status >= 200 && response.status < 300) {
                Alert.alert(
                    '提示',
                    '成功',
                    [
                        { text: '服务发布成功', onPress: () => console.log('确定') },
                    ]
                )
            } else {
                let error = res;
                throw error;
            }
        } catch (error) {
            this.setState({ error: error });
            console.log("error " + error);
            this.setState({ showProgress: false });

        }
    }

uploadImage(){  
  let formData = new FormData();  
  let url = 'http://' + Constant.url.IMG_SERV_ADDR + ':' + Constant.url.IMG_SERV_PORT + Constant.url.SERV_API_IMG_UPLOAD_SERVLET;
  console.log("url:"+url);    
  //console.log("uri:"+this.state.avatarSource.uri+" name:"+this.state.fileName)
  let file = {uri: this.state.avatarSource.uri, type: 'multipart/form-data', name: this.state.fileName};  
  
  formData.append("images",file);  
  
  fetch(url,{  
    method:'POST',  
    mode: "cors", 
    headers:{  
        'Content-Type':'multipart/form-data',  
    },  
    body:formData,  
  })  
  .then((response) => response.text() )  
  .then((responseData)=>{    
    console.log('responseData',responseData);  
    this.setState({
          serv_imges: JSON.parse(responseData).images
        });
    
    console.log('this.state.serv_imges：',this.state.serv_imges);  
    
  })  
  .catch((error)=>{console.error('error',error)});  
  
}  

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Header
                    title='Confrimation'
                    leftIcon={require('../../resource/t_header_arrow_left.png')}
                    leftIconAction = {this._onBack}
                />

                <ProgressBarAndroid color="#60d795" styleAttr='Horizontal' progress={0.9} indeterminate={false} style={{ marginTop: -10 }} />

                <Text style={{ alignSelf: 'flex-end', color: "#a8a6b9" }}>90%</Text>

                <Text style={{ alignSelf: 'center', color: "#a8a6b9", fontSize: 12 }}>Sell this Audio & sound service to customers</Text>

                <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 20 }}>
                    <Image style={{ width: 20, height: 20, alignSelf: 'center' }} source={require('../../resource/t_text.png')} />
                    <Text style={{ color: "#a8a6b9" }}>I will</Text>
                    <Text style={{ color: "#000000" }}>{this.state.serv_title}</Text>
                </View>

                <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 20 }}>
                    <Image style={{ width: 20, height: 20, alignSelf: 'center' }} source={require('../../resource/t_heart.png')} />
                    <Text style={{ color: "#a8a6b9" }}>I will</Text>
                    <Text style={{ color: "#000000" }}>{this.state.serv_detail}</Text>
                </View>

                <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 20 }}>
                    <Image style={{ width: 20, height: 20, alignSelf: 'center' }} source={require('../../resource/t_loaction.png')} />
                    <Text style={{ color: "#a8a6b9" }}>I will</Text>
                    <Text style={{ color: "#000000" }}>XXX</Text>
                </View>

                <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 20 }}>
                    <Image style={{ width: 20, height: 20, alignSelf: 'center' }} source={require('../../resource/t_img.png')} />
                    <Text style={{ color: "#a8a6b9" }}>Add photos or documents</Text>
                    <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
                        <View style={[styles.avatar, styles.avatarContainer, { marginBottom: 20 }]}>
                            {
                                this.state.avatarSource === null ? <Text>选择图片</Text> :
                                    <Image style={styles.avatar} source={this.state.avatarSource} />
                            }
                        </View>
                    </TouchableOpacity>
                </View>

                <TouchableHighlight style={{ backgroundColor: '#81d49c', marginTop: 60, alignSelf: 'stretch' }} onPress={this.onServOfferPres.bind(this)} >
                    <Text style={{ fontSize: 22, color: '#FFF', alignSelf: 'center', backgroundColor: '#81d49c', }}>
                        下一步
                  </Text>
                </TouchableHighlight>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    avatarContainer: {
        borderColor: '#9B9B9B',
        borderWidth: 1 / PixelRatio.get(),
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatar: {
        borderRadius: 75,
        width: 150,
        height: 150
    }
})