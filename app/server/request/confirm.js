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
import TabBarView from '../../containers/TabBarView';


//let serv_imges_url = ["", "", "", "", "", ""];
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
            avatarSourceArray: this.props.avatarSourceArray,
            //isavatarSourceArrayFlag: this.props.isavatarSourceArrayFlag,
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
            avatarSourceArray: this.props.avatarSourceArray,
            imgBase64: this.props.imgBase64,
        });
    }

    clickJump() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({　　//navigator.push 传入name和你想要跳的组件页面
                name: "TabBarView",
                component: TabBarView,
                params: {
                    //serv_title: this.state.serv_title,
                    //serv_detail: this.state.serv_detail,
                }
            });
        }
    }

    _onBack = () => {
        const { navigator } = this.props;
        let title = this.state.serv_title;
        let detail = this.state.serv_detail;
        let imges = this.state.serv_imges;
        let SourceArray = this.state.avatarSourceArray;
        if (this.props.getdata) {
            this.props.getdata(title, detail,imges, SourceArray);
        }
        if (navigator) {
            navigator.pop();
        }
    }

    selectPhotoTapped(index) {
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
                let imgArray;
                if (this.state.avatarSourceArray === undefined) {
                    imgArray = [
                        { "uri": "", "isStatic": true },
                        { "uri": "", "isStatic": true },
                        { "uri": "", "isStatic": true },
                        { "uri": "", "isStatic": true },
                        { "uri": "", "isStatic": true },
                        { "uri": "", "isStatic": true },
                    ];
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

                imgArray[index].uri = source.uri;
                fName = response.fileName;


                this.setState({
                    imgBase64: temp,
                    fileName: fName,
                    avatarSourceArray: imgArray,
                });
                this.uploadImage(index);

            }
        });
    }

    async onServOfferPres() {
        this.setState({ showProgress: true })
        try {
            let t = await UserDefaults.cachedObject(Constant.storeKeys.ACCESS_TOKEN_TISPR);
            let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_SERV_OFFER_ADD + t;
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
                        serv_catagory: "serv_request"
                    }
                })
            });

            let res = await response.text();
            if (response.status >= 200 && response.status < 300) {
                //console.log("line:153");
                Alert.alert(
                    '提示',
                    '成功',
                    [
                        { text: '服务发布成功', onPress: () => this.clickJump() },
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

    uploadImage(index) {
        let formData = new FormData();
        let url = 'http://' + Constant.url.IMG_SERV_ADDR + ':' + Constant.url.IMG_SERV_PORT + Constant.url.SERV_API_IMG_UPLOAD_SERVLET;
        console.log("url:" + url);
        let file = { uri: this.state.avatarSourceArray[index].uri, type: 'multipart/form-data', name: this.state.fileName };

        formData.append("images", file);

        fetch(url, {
            method: 'POST',
            mode: "cors",
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        })
            .then((response) => response.text())
            .then((responseData) => {
                console.log('responseData', responseData);
                if (this.state.serv_imges === undefined) {
                    this.setState({
                        serv_imges: JSON.parse(responseData).images
                    });
                }
                else {
                    this.setState({
                        serv_imges: this.state.serv_imges + "," + JSON.parse(responseData).images
                    });
                }
                console.log('this.state.serv_imges：', this.state.serv_imges);

            })
            .catch((error) => { console.error('error', error) });

    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Header
                    title='Confrimation'
                    leftIcon={require('../../resource/t_header_arrow_left.png')}
                    leftIconAction={this._onBack}
                />

                <ProgressBarAndroid color="#60d795" styleAttr='Horizontal' progress={0.9} indeterminate={false} style={{ marginTop: -10 }} />

                <Text style={{ alignSelf: 'flex-end', color: "#a8a6b9" }}>99%</Text>

                <Text style={{ alignSelf: 'center', color: "#a8a6b9", fontSize: 12 }}>Get introduced to Video & Animation experts</Text>

                <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 20 }}>
                    <Image style={{ width: 20, height: 20, alignSelf: 'center' }} source={require('../../resource/t_text.png')} />
                    <Text style={{ color: "#a8a6b9" }}>I need </Text>
                    <Text style={{ color: "#000000" }}>{this.state.serv_title}</Text>
                </View>

                {/*<View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 20 }}>
                    <Image style={{ width: 20, height: 20, alignSelf: 'center' }} source={require('../../resource/t_heart.png')} />
                    <Text style={{ color: "#a8a6b9" }}>Get it done near</Text>
                    <Text style={{ color: "#000000" }}>{this.state.serv_detail}</Text>
                </View>*/}

                <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 20 }}>
                    <Image style={{ width: 20, height: 20, alignSelf: 'center' }} source={require('../../resource/t_loaction.png')} />
                    <Text style={{ color: "#a8a6b9" }}>Get it done near </Text>
                    <Text style={{ color: "#000000" }}>XXX</Text>
                </View>

                <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 20 }}>
                    <Image style={{ width: 20, height: 20, alignSelf: 'center' }} source={require('../../resource/t_img.png')} />
                    <Text style={{ color: "#a8a6b9" }}>Add a photo or documment (drat and drop to reorder)</Text>
                    {/*<TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
                        <View style={[styles.avatar, styles.avatarContainer, { marginBottom: 20 }]}>
                            {
                                this.state.avatarSource === null ? <Text>选择图片</Text> :
                                    <Image style={styles.avatar} source={this.state.avatarSource} />
                            }
                        </View>
                    </TouchableOpacity>*/}
                </View>

                <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 5 }}>
                    <TouchableOpacity onPress={this.selectPhotoTapped.bind(this, 0)}>
                        <View style={[styles.avatar, styles.avatarContainer, { marginBottom: 5, marginLeft: 5, border: 0 }]}>
                            {
                                this.state.avatarSourceArray instanceof Array && this.state.avatarSourceArray[0].uri != "" ?
                                    <Image style={styles.avatar} source={this.state.avatarSourceArray[0]} /> :
                                    <Image style={{ width: 100, height: 100, alignSelf: 'center' }} source={require('../../resource/t_img_upload_nil.png')} />
                            }
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.selectPhotoTapped.bind(this, 1)}>
                        <View style={[styles.avatar, styles.avatarContainer, { marginBottom: 5, marginLeft: 5, border: 0 }]}>
                            {
                                this.state.avatarSourceArray instanceof Array && this.state.avatarSourceArray[1].uri != "" ?
                                    <Image style={styles.avatar} source={this.state.avatarSourceArray[1]} /> :
                                    <Image style={{ width: 100, height: 100, alignSelf: 'center' }} source={require('../../resource/t_img_upload_nil.png')} />
                            }
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.selectPhotoTapped.bind(this, 2)}>
                        <View style={[styles.avatar, styles.avatarContainer, { marginBottom: 5, marginLeft: 5, border: 0 }]}>
                            {
                                this.state.avatarSourceArray instanceof Array && this.state.avatarSourceArray[2].uri != "" ?
                                    <Image style={styles.avatar} source={this.state.avatarSourceArray[2]} /> :
                                    <Image style={{ width: 100, height: 100, alignSelf: 'center' }} source={require('../../resource/t_img_upload_nil.png')} />
                            }
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 5 }}>
                    <TouchableOpacity onPress={this.selectPhotoTapped.bind(this, 3)}>
                        <View style={[styles.avatar, styles.avatarContainer, { marginBottom: 5, marginLeft: 5, border: 0 }]}>
                            {
                                this.state.avatarSourceArray instanceof Array && this.state.avatarSourceArray[3].uri != "" ?
                                    <Image style={styles.avatar} source={this.state.avatarSourceArray[3]} /> :
                                    <Image style={{ width: 100, height: 100, alignSelf: 'center' }} source={require('../../resource/t_img_upload_nil.png')} />
                            }
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.selectPhotoTapped.bind(this, 4)}>
                        <View style={[styles.avatar, styles.avatarContainer, { marginBottom: 5, marginLeft: 5, border: 0 }]}>
                            {
                                this.state.avatarSourceArray instanceof Array && this.state.avatarSourceArray[4].uri != "" ?
                                    <Image style={styles.avatar} source={this.state.avatarSourceArray[4]} /> :
                                    <Image style={{ width: 100, height: 100, alignSelf: 'center' }} source={require('../../resource/t_img_upload_nil.png')} />
                            }
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.selectPhotoTapped.bind(this, 5)}>
                        <View style={[styles.avatar, styles.avatarContainer, { marginBottom: 5, marginLeft: 5, border: 0 }]}>
                            {
                                this.state.avatarSourceArray instanceof Array && this.state.avatarSourceArray[5].uri != "" ?
                                    <Image style={styles.avatar} source={this.state.avatarSourceArray[5]} /> :
                                    <Image style={{ width: 100, height: 100, alignSelf: 'center' }} source={require('../../resource/t_img_upload_nil.png')} />
                            }
                        </View>
                    </TouchableOpacity>
                </View>

                <TouchableHighlight style={{ backgroundColor: '#81d49c', marginTop: 90, alignSelf: 'stretch' }} onPress={this.onServOfferPres.bind(this)} >
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
        // borderRadius: 75,
        width: 100,
        height: 100
    }
})