import React, {Component, PureComponent} from 'react'
import {
    StyleSheet,
    View,
    Text,
    Image,
    TextInput,
    ListView,
    TouchableOpacity,
    Platform,
    Alert,
    ScrollView
} from 'react-native';
import Header from '../components/HomeNavigation';
import Constant from '../common/constants';
import ImagePicker from 'react-native-image-picker';
import TabBarView from '../containers/TabBarView';
import Util from '../common/utils'

export default class Personinfoedit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            avatar: global.user.avatar,
            fileName: this.props.fileName,
            fileSource: this.props.source,
        }
    }
    _back(){
        let { navigator } = this.props;
        navigator.resetTo({
            component: TabBarView,
            name: 'TabBarView'
        });
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
                temp = response.data;
                //Or:
                if (Platform.OS === 'android') {
                    source = { uri: response.uri, isStatic: true };
                } else {
                    source = { uri: response.uri.replace('file://', ''), isStatic: true };
                }
                fName = response.fileName;
                this.setState({
                    fileName: fName,
                    fileSource: source,
                });
                this.uploadImage();
            }
        });
    }

    uploadImage() {
        let formData = new FormData();
        let url = 'http://' + Constant.url.IMG_SERV_ADDR + ':' + Constant.url.IMG_SERV_PORT + Constant.url.SERV_API_IMG_UPLOAD_SERVLET;
        console.log("url:" + url);
        let file = { uri: this.state.fileSource.uri, type: 'multipart/form-data', name: this.state.fileName };

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
                this.setState({
                    avatar: JSON.parse(responseData).images
                });
                console.log('113: '+this.state.avatar);
                //this.updateavatar();
            })
            .catch((error) => { console.error('error', error) });
    }

    async updateavatar(){

        let url ='http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_AVAT_UPDATE + global.user.id+'?token='+global.user.authentication_token;
        let data = {
            user: {
                avatar: this.state.avatar,
            }
        }
        Util.patch(url,data,
            (response)=>{
                global.user.avatar=this.state.avatar;
                Alert.alert(
                    '提示',
                    '头像更新成功',
                    [
                        { text: '确定' , onPress: () => {
                            let { navigator } = this.props;
                            navigator.resetTo({
                                component: TabBarView,
                                name: 'TabBarView'
                            });
                        }},
                    ]
                )
            },
            this.props.navigator
        )
        
    }

    render(){
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <Header
                    title='添加头像'
                    leftIcon={require('../resource/w-back.png')}
                    leftIconAction={this._back.bind(this)}
                />
                <ScrollView style={{ flex: 1, padding: 16 }}>
                    <View style={{ alignItems: 'center', marginBottom: 16 ,marginTop:70}}>
                        <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
                            <Image style={{ width: 80, height:80, borderRadius: 40 }} source={{uri:this.state.avatar}} />
                        </TouchableOpacity>
                    </View>   
                    <View style={{marginTop:100,marginLeft:20}}>
                        <Text style={{color:'#000',fontSize:16,marginBottom:10}}>完善你的形象</Text>
                        <Text>请上传你的头像，以便你的好友和潜在客户更容易找到你</Text>
                    </View>       
                </ScrollView>
                <TouchableOpacity onPress ={this.updateavatar.bind(this)} style={styles.loginButton}>
                    <Text>保存</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
const styles = StyleSheet.create({
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
})