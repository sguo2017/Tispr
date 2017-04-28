import React, {Component, PureComponent} from 'react'
import {
    StyleSheet,
    View,
    Text,
    Image,
    TextInput,
    ListView,
    TouchableOpacity,
    ProgressBarAndroid,
    Platform,
    RefreshControl,
    Alert,
    Navigator,
    Dimensions
} from 'react-native'
import Header from '../../components/HomeNavigation';
import Constant from '../../common/constants';
import ImagePicker from 'react-native-image-picker';
import Me from '../index';

const screenW = Dimensions.get('window').width;

export default class Personinfoedit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selfintroduce: '',
            name: global.user.name,
            avatar: global.user.avatar,
            errors: this.props.errors,
            fileName: this.props.fileName,
            fileSource: this.props.source,
            address: this.props.address,
        }
    }
    componentWillMount(){
        //
    }

     _onBack = () => {
        const { navigator } = this.props;
        if (this.props.getdata) {
            this.props.getdata(global.user.avatar);
        }
        if (navigator) {
            navigator.pop();
        }
    }
    SaveBack=()=>{
        const { navigator } = this.props;
        if (this.props.getdata) {
            this.props.getdata(global.user.avatar);
        }
        if (navigator) {
            navigator.pop();
        }
    }

    _save(){

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
        // let formData = new FormData();
        // let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_AVAT_UPDATE + global.user.id+'?token='+global.user.authentication_token;
        // console.log("122url:" + url);
        // let file = { avatar: this.state.avatar};
        // formData.append("user", file);


        try {
            let url ='http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_AVAT_UPDATE + global.user.id+'?token='+global.user.authentication_token;
            let response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify({
                    user: {
                        avatar: this.state.avatar
                    }
                })
            });
             let res = await response.text();
            if (response.status >= 200 && response.status < 300) {
                console.log("line:144///res"+res);
                Alert.alert(
                    '提示',
                    '成功',
                    [
                        { text: '头像更新成功' , onPress: () => this.SaveBack()},
                    ]
                )
                global.user.avatar=this.state.avatar;
            } else {
                let error = res;
                throw error;
            }
        } catch (error) {
            this.setState({ error: error });
            console.log("158 error "+error);

        }
    }


    render(){
        return (
            <View style={{ flex: 1 }}>
                <Header
                    title='Edit Profile'
                    leftIcon={require('../../resource/t_header_arrow_left.png')}
                    leftIconAction={this._onBack}
                    rightIcon={require('../../resource/t_header_arrow_left.png')}
                    rightIconAction={this.updateavatar.bind(this)}
                />
                <View style={{justifyContent:'flex-start',margin: 20}}>
                    <View style={{flexDirection: 'row', justifyContent:'center'}}>
                        <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
                        <Image style={{width:80, height:80, borderRadius: 40, justifyContent:'flex-end', alignItems:'flex-end'}} source={{uri:this.state.avatar}}>
                        </Image>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                        <Image style={{width: 40, height: 40}} source={require('../../resource/ic_my_order.png')}/>
                        <TextInput
                        style={{flexDirection:'row',width: screenW*0.8}}
                        multiline={true}
                        numberOfLines={1}
                        value ={this.state.name}
                        onChangeText={(val) => {this.setState({ name: val})}}
                        />
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                        <Image style={{width: 40, height: 40}} source={require('../../resource/ic_my_address.png')}/>
                        <TextInput
                        style={{flexDirection:'row',width: screenW*0.8}}
                        multiline={true}
                        numberOfLines={1}
                        value ={this.state.address}
                        onChangeText={(val) => {this.setState({ address: val})}}
                        />
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                        <Image style={{width: 40, height: 40}} source={require('../../resource/ic_my_order.png')}/>
                        <TextInput
                        style={{flexDirection:'row',width: screenW*0.8}}
                        multiline={true}
                        numberOfLines={1}
                        value ={this.state.address}
                        placeholder='Add some info about yourself'
                        onChangeText={(val) => {this.setState({ address: val})}}
                        />
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                        <Image style={{width: 40, height: 40}} source={require('../../resource/ic_my_address.png')}/>
                        <TextInput
                        style={{flexDirection:'row',width: screenW*0.8}}
                        multiline={true}
                        numberOfLines={1}
                        value ={this.state.address}
                        placeholder='Add a website link'
                        onChangeText={(val) => {this.setState({ address: val})}}
                        />
                    </View>
                </View>
            </View>
        )
    }
}