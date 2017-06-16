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
import Header from '../components/HomeNavigation';
import Constant from '../common/constants';
import ImagePicker from 'react-native-image-picker';
import Setting from '../sys/Setting';

const screenW = Dimensions.get('window').width;

export default class Personinfoedit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selfintroduce: this.props.info,
            name: global.user.name,
            avatar: global.user.avatar,
            errors: this.props.errors,
            fileName: this.props.fileName,
            fileSource: this.props.source,
            addressComponent: global.user.addressComponent,
        }
    }
    componentWillMount(){
        //
    }

     _onBack = () => {
        const { navigator } = this.props;
        if (this.props.getdata) {
            this.props.getdata(global.user.avatar, this.state.selfintroduce);
        }
        if (navigator) {
            navigator.pop();
        }
    }
    SaveBack=()=>{
        const { navigator } = this.props;
        if (this.props.getdata) {
            this.props.getdata(global.user.avatar, this.state.selfintroduce);
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
                        avatar: this.state.avatar,
                        name: this.state.name,
                        profile: this.state.selfintroduce,
                    }
                })
            });
             let res = await response.text();
            if (response.status >= 200 && response.status < 300) {
                console.log("line:144///res"+res);
                console.log(this.state.selfintroduce);
                global.user.profile = this.state.selfintroduce;
                Alert.alert(
                    '提示',
                    '成功',
                    [
                        { text: '个人信息更新成功' , onPress: () => this.SaveBack()},
                    ]
                )
                global.user.avatar=this.state.avatar;
            } else {
                let error = res;
                throw error;
            }
        } catch (error) {
            this.setState({ error: error });
            //console.log("158 error "+error);
        }
    }

    editSetting(){
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({　　
                name: "Setting",
                component: Setting,
            });
        }
    }

    render(){
        return (
            <View style={{ flex: 1 }}>
                <Header
                    title='编辑信息'
                    leftIcon={require('../resource/w-back.png')}
                    leftIconAction={this._onBack}
                    rightButton='保存'
                    rightButtonAction={this.updateavatar.bind(this)}
                />
                <View style={{justifyContent:'flex-start',margin: 20}}>
                    <View style={{flexDirection: 'row', justifyContent:'center', marginBottom: 26}}>
                        <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
                        <Image style={{width:80, height:80, borderRadius: 40, justifyContent:'flex-end', alignItems:'flex-end'}} source={{uri:this.state.avatar}}>
                        </Image>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center', marginBottom: 12}}>
                        <Image source={require('../resource/g_name.png')}/>
                        <View style={{marginLeft: 16}}>
                            <TextInput
                            style={styles.textinput}
                            multiline={true}
                            numberOfLines={1}
                            value ={this.state.name}
                            placeholder='请填写您的真实姓名'
                            placeholderTextColor='#CCCCCC'
                            underlineColorAndroid='#CCCCCC'
                            onChangeText={(val) => {this.setState({ name: val})}}
                            />       
                            <Text style={styles.text}>2-4个汉字，或10个英文字符</Text>
                        </View> 
                    </View>
                    
                    <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center', marginBottom: 12}}>
                        <Image source={require('../resource/g_location.png')}/>
                        <View style={{marginLeft: 16, flexDirection: 'row'}}>
                            <TextInput
                            style={styles.textinput}
                            multiline={true}
                            numberOfLines={1}
                            value ={this.state.address}
                            placeholder='获取当前地址'
                            placeholderTextColor='#CCCCCC'
                            underlineColorAndroid='#CCCCCC'
                            onChangeText={(val) => {this.setState({ address: val})}}
                            />
                            <Image source={require('../resource/g-replay.png')} style={{position: 'absolute', top: 18, right: 6}}></Image>
                        </View>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center', marginBottom: 12}}>
                        <Image source={require('../resource/g_info.png')}/>
                        <View style={{marginLeft: 16}}>
                            <TextInput
                            style={styles.textinput}
                            multiline={true}
                            numberOfLines={1}
                            value ={this.state.selfintroduce}
                            placeholder='介绍下自己，获得更多关注'
                            placeholderTextColor='#CCCCCC'
                            underlineColorAndroid='#CCCCCC'
                            onChangeText={(val) => {this.setState({ selfintroduce: val})}}
                            />
                            <Text style={styles.text1}>0/200</Text>
                        </View>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                        <Image source={require('../resource/g_earth_nor.png')}/>
                        <View style={{marginLeft: 16}}>
                            <TextInput
                            style={styles.textinput}
                            multiline={true}
                            numberOfLines={1}
                            value ={this.state.address}
                            placeholder='添加网页链接'
                            placeholderTextColor='#CCCCCC'
                            underlineColorAndroid='#CCCCCC'
                            onChangeText={(val) => {this.setState({ address: val})}}
                            />
                        </View> 
                    </View>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    textinput: {
        fontSize: 16,
        width: screenW*0.8,
        height: 56,
        flexDirection: 'row'
    },
    text: {
        color: '#B8B8B8',
        fontSize: 12,
        position: 'absolute',
        top: 50,
        left: 3
    },
    text1: {
        position: 'absolute',
        right: 5,
        top: 50,
        color: '#B8B8B8',
        fontSize: 12,
    }
})