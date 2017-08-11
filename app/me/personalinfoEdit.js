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
    Dimensions,
    ScrollView
} from 'react-native';
import { Geolocation } from 'react-native-baidu-map';
import AutoTextInput from '../components/AutoTextInput';
import Header from '../components/HomeNavigation';
import Constant from '../common/constants';
import ImagePicker from 'react-native-image-picker';
import Setting from '../sys/Setting';
import UserDefaults from '../common/UserDefaults';
import TabBarView from '../containers/TabBarView';
import Util from '../common/utils'
const screenW = Dimensions.get('window').width;

export default class Personinfoedit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selfintroduce: global.user.profile,
            website: global.user.website,
            name: global.user.name,
            avatar: global.user.avatar,
            errors: this.props.errors,
            fileName: this.props.fileName,
            fileSource: this.props.source,
            addressComponent: global.user.addressComponent,
            address: global.user.addressComponent.country?`${global.user.addressComponent.country}${global.user.addressComponent.province}${global.user.addressComponent.city}${global.user.addressComponent.district}`:''
        }
    }
    _back(){
        let { navigator } = this.props;
        if(this.props.newUser){
            navigator.resetTo({
                component: TabBarView,
                name: 'TabBarView'
            });
        }else{
            navigator.pop();
            if (this.props.getdata) {
                this.props.getdata(global.user.avatar, global.user.profile, global.user.website, global.user.name);
            }
            if (navigator) {
                navigator.pop();
            }
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
        if(this.state.website) {
            let reg = /^(http(s)?:\/\/)?(www\.)?[\w-]+\.\w{2,4}(\/)?$/;
            let isValide = reg.test(this.state.website);
            if(!isValide){
                Alert.alert(
                    '提示',
                    '请输入合法的网址',
                    [
                        { text: '重新输入' },
                    ]
                );
                return
            }
        }
        if(this.state.name == '' || this.state.address == ''){
            return
        }
        let url ='http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_AVAT_UPDATE + global.user.id+'?token='+global.user.authentication_token;
        let data = {
            user: {
                avatar: this.state.avatar,
                name: this.state.name,
                profile: this.state.selfintroduce,
                website: this.state.website,
                district: global.user.addressComponent.district,
                city: global.user.addressComponent.city,
                province: global.user.addressComponent.province,
                country: global.user.addressComponent.country,
                latitude: global.user.addressComponent.latitude,
                longitude: global.user.addressComponent.longitude,
            }
        }
        Util.patch(url,data,
            (response)=>{
                global.user.name = this.state.name;
                    global.user.profile = this.state.selfintroduce;
                    global.user.website = this.state.website;
                    global.user.addressComponent= this.state.addressComponent;
                    Alert.alert(
                        '提示',
                        '个人信息更新成功',
                        [
                            { text: '确定' , onPress: () => {
                                let { navigator } = this.props;
                                if(this.props.newUser){
                                    navigator.resetTo({
                                        component: TabBarView,
                                        name: 'TabBarView'
                                    });
                                }else{
                                    navigator.pop();
                                    if (this.props.getdata) {
                                        this.props.getdata(global.user.avatar, global.user.profile, global.user.website, global.user.name);
                                    }
                                    if (navigator) {
                                        navigator.pop();
                                    }
                                }
                            
                            }},
                        ]
                    )
                    global.user.avatar=this.state.avatar;
            },
            this.props.navigator
        )
        
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

    onReplay() {
        Geolocation.getCurrentPosition()
        .then(data => {
            console.log("获取经纬度"+JSON.stringify(data));   
            if(data.cityCode){
                global.user.addressComponent = data;
                global.user.addressComponent.latitude = data.latitude;
                global.user.addressComponent.longitude = data.longitude;
                UserDefaults.setObject(Constant.storeKeys.ADDRESS_COMPONENT, global.user.addressComponent);
            }else{
                this.setState({ showProgress: false });
                Alert.alert(
                    null,
                    `请开启奇客的定位权限`,
                    [
                     { text: '确定' },
                    ]
                )
            }
         })
        .catch(e =>{
            console.warn(e, 'error');           
        })
        this.setState({
            address: global.user.addressComponent.province +
                     global.user.addressComponent.city + global.user.addressComponent.district
        })
        console.log('addr');
    }

    render(){
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <Header
                    title='编辑信息'
                    leftIcon={require('../resource/w-back.png')}
                    leftIconAction={this._back.bind(this)}
                    rightButton='保存'
                    rightButtonAction={this.updateavatar.bind(this)}
                />
                <ScrollView style={{ flex: 1, padding: 16 }}>
                    <View style={{ alignItems: 'center', marginBottom: 16 }}>
                        <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
                            <Image style={{ width: 60, height:60, borderRadius: 30 }} source={{uri:this.state.avatar}} />
                        </TouchableOpacity>
                    </View>
                    
                    <View style={{ flexDirection:'row', alignItems:'center', marginBottom: 8 }}>
                        {   
                            this.state.name == ''?
                            <Image style={{ width: 24, height: 24 }} source={require('../resource/g_name.png')}/>
                            :
                            <Image style={{ width: 24, height: 24 }} source={require('../resource/b_name.png')}/>                           
                        }
                        <TextInput
                          maxLength={20}
                          placeholder='请填写您的真实姓名'
                          placeholderTextColor='#CCCCCC'
                          style={styles.textInput}
                          underlineColorAndroid="transparent"
                          numberOfLines={1}
                          multiline={true}
                          value ={this.state.name}
                          onChangeText={(val) => {this.setState({ name: val})}}
                        />
                    </View>
                    
                    <Text style={styles.text}>1-20个字符</Text>
                    <View style={{ flexDirection:'row', alignItems:'center', marginBottom: 16 }}>
                        {
                            this.state.address == ''?
                            <Image style={{ width: 24, height: 24 }} source={require('../resource/g_location.png')}/>
                            :
                            <Image style={{ width: 24, height: 24 }} source={require('../resource/b_location.png')}/>                           
                        }
                        <View style={{ flex: 1, marginLeft: 16, flexDirection:'row', borderBottomWidth: 1, borderBottomColor: '#eeeeee' }}>
                            <TextInput
                                placeholder='获取当前地址'
                                placeholderTextColor='#CCCCCC'
                                style={[styles.textInput, { marginLeft: 0, borderBottomWidth: 0 }]}
                                underlineColorAndroid="transparent"
                                numberOfLines={1}
                                multiline={true}
                                value ={this.state.address}
                                onChangeText={(val) => {this.setState({ address: val })}}
                            />
                            <TouchableOpacity style={{ marginRight: 8 }} onPress={this.onReplay.bind(this)}>
                                <Image style={{ width: 24, height: 24 }} source={require('../resource/g-replay.png')}></Image>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flexDirection:'row', alignItems:'center', marginBottom: 8 }}>
                        {
                            this.state.selfintroduce == ''?
                            <Image style={{ width: 24, height: 24 }} source={require('../resource/g_info.png')}/>
                            :
                            <Image style={{ width: 24, height: 24 }} source={require('../resource/b_info.png')}/>                           
                        }
                        <AutoTextInput
                          placeholder='介绍下自己，获得更多关注'
                          placeholderTextColor='#CCCCCC'
                          style={styles.textInput}
                          underlineColorAndroid="transparent"
                          numberOfLines={1}
                          multiline={true}
                          value={this.state.selfintroduce}
                          onChangeText={(val) => {this.setState({ selfintroduce: val})}}
                        />
                    </View>
                    <View style={{ flexDirection:'row', justifyContent: 'flex-end', marginBottom: 8 }}>
                        <Text style={styles.lengthText}>{this.state.selfintroduce?this.state.selfintroduce.length:'0'}/200</Text>
                    </View>
                    <View style={{ flexDirection:'row', alignItems:'center', marginBottom: 8 }}>
                        {
                            this.state.website == ''?
                            <Image style={{ width: 24, height: 24 }} source={require('../resource/g_earth_nor.png')}/>
                            :
                            <Image style={{ width: 24, height: 24 }} source={require('../resource/b_earth.png')}/>                           
                        }
                        <TextInput
                          placeholder='添加网页链接'
                          placeholderTextColor='#CCCCCC'
                          style={styles.textInput}
                          underlineColorAndroid="transparent"
                          numberOfLines={1}
                          multiline={true}
                          value={this.state.website}
                          onChangeText={(val) => {this.setState({ website: val})}}
                        />
                    </View>
                    
                </ScrollView>
                {/*</KeyboardAvoidingView>*/}
            </View>
        )
    }
}


const styles = StyleSheet.create({
    textInput: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 0,
        backgroundColor: 'white',
        fontSize: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eeeeee',
        marginLeft: 16,
    },
    text: {
        marginLeft: 40,
        color: '#b8b8b8',
        fontSize: 12,
        marginBottom: 14,
    },
    lengthText: {
        marginLeft: 40,
        color: '#b8b8b8',
        fontSize: 12,
    }
});