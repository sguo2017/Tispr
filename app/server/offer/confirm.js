import React, { Component, PureComponent } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    ProgressBarAndroid,
    TouchableOpacity,
    Platform,
    StyleSheet,
    Navigator,
    AsyncStorage,
    PixelRatio,
    Alert,
    ProgressViewIOS,
    ScrollView,
} from 'react-native'
import Toast from 'react-native-easy-toast';
import ImagePicker from 'react-native-image-picker';
import Header from '../../components/HomeNavigation';
import Constant from '../../common/constants';
import TabBarView from '../../containers/TabBarView';
import Loading from '../../components/Loading';
import uploadImage from './uploadImage'

export default class ServOfferConfirm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            serv_offer: this.props.serv_offer,
            serv_images: this.props.serv_images,
            fileName: this.props.fileName,
            avatarSourceArray: this.props.avatarSourceArray,            
            imgBase64: this.props.imgBase64,
        }
    }

    componentWillMount() {
        this.setState({
            imgBase64: this.props.imgBase64,
        });
    }

    clickJump() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.resetTo({　　//navigator.push 传入name和你想要跳的组件页面
                name: "TabBarView",
                component: TabBarView,
                params: {}
            });
        }
    }

    _onBack = () => {
        const { navigator } = this.props;
        if (this.props.getdata) {
            this.props.getdata(this.props.serv_offer);
        }
        if (navigator) {
            navigator.pop();
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
                if (this.state.serv_offer.avatarSourceArray === undefined) {
                    imgArray = [];
                }
                else {
                    imgArray = this.state.serv_offer.avatarSourceArray.slice(0);
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
                let offer = this.state.serv_offer;
                offer.fileName = fName;
                offer.avatarSourceArray = imgArray;

                this.setState({
                    imgBase64: temp,
                    serv_offer: offer,
                });
            }
        });
    }

    deletePhoto = (index) => {
        Alert.alert(
          '提示',
          '确认删除该图片?',
          [
              { text: '取消', onPress: () => {} },
              { text: '确定', onPress: () => {
                  let imgArray = this.state.serv_offer.avatarSourceArray.slice(0);
                  if (index == imgArray.length - 1) {
                      imgArray.pop();
                  } else if (index == 0) {
                      imgArray = imgArray.slice(1);
                  } else {
                      imgArray = imgArray.slice(0, index).concat(imgArray.slice(index + 1));
                  }
                  let offer = this.state.serv_offer;
                  offer.avatarSourceArray = imgArray;
                  this.setState({
                      serv_offer: offer,
                  });
              } },
          ]
        )
    }

    async onServOfferPres() {
        if(undefined === this.state.serv_offer.avatarSourceArray || this.state.serv_offer.avatarSourceArray.length <= 0){
            this.props.navigator.push({
                component: uploadImage
            })
            return;
        }

        this.setState({ showProgress: true })

        //上传图片
        let imageRequests = [];
        this.state.serv_offer.avatarSourceArray.map((source, i) => {
            imageRequests.push(this.uploadImage(source.uri));
        });
        let uploadedImages = '';
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

        //发布
        try {
            let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_SERV_OFFER_ADD + global.user.authentication_token;
            let response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    serv_offer: {
                        serv_title: this.state.serv_offer.serv_title,
                        serv_detail: this.state.serv_offer.serv_detail,
                        serv_images: uploadedImages,
                        serv_catagory: this.state.serv_offer.goods_tpye,
                        catalog: this.state.serv_offer.goods_catalogs_name,
                        district: global.user.addressComponent.district,
                        city: global.user.addressComponent.city,
                        province: global.user.addressComponent.province,
                        country: global.user.addressComponent.country,
                        latitude: global.user.addressComponent.latitude,
                        longitude: global.user.addressComponent.longitude,
                        goods_catalog_id: this.state.serv_offer.goods_catalogs_id,
                        via: this.state.serv_offer.via,
                        range: this.state.serv_offer.range,
                    }
                })
            });

            let res = await response.text();
            if (response.status >= 200 && response.status < 300) {
                //console.log("line:153");
                let resObject =JSON.parse(res);
                if(resObject.status==0){
                    this.clickJump();
                    global.user.offer_count++;
                    Alert.alert(
                        '提示',
                        '提交成功，请等待管理员审核'
                        [
                            { text: '确定'}
                        ]
                    )
               }else if(resObject.status==-2){
                    Alert.alert(
                        '提示',
                        '您今天的发布服务次数已用完，请明天再发布',
                        [
                            { text: '确定', onPress: () => this.props.navigator.pop() },
                        ]
                    )
               }
            } else {
                let error = res;
                throw error;
            }
        } catch (error) {
            // console.log("error " + error);
            this.setState({
                error: error,
                showProgress: false
            });
            this.toast.show('发布失败,请稍后再试');
        }
    }

    uploadImage = (uri) => {
        let formData = new FormData();
        let url = 'http://' + Constant.url.IMG_SERV_ADDR + ':' + Constant.url.IMG_SERV_PORT + Constant.url.SERV_API_IMG_UPLOAD_SERVLET;
        // console.log("url:" + url);
        let file = { uri: uri, type: 'multipart/form-data', name: this.state.serv_offer.fileName };
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

    renderProgressView = () => {
        if (Platform.OS == 'ios') {
            return (
              <ProgressViewIOS
                progressTintColor="#ffc400"
                style={styles.progressViewIOS}
                progress={0.8}
                progressViewStyle="bar"
              />
            );
        } else {
            return (
              <ProgressBarAndroid
                color="#ffc400"
                styleAttr='Horizontal'
                progress={0.8}
                indeterminate={false}
                style={styles.progressViewAndroid}
              />
            );
        }
    }

    generateImageContent = () => {
        const hasImage = this.state.serv_offer.avatarSourceArray != null && this.state.serv_offer.avatarSourceArray.length > 0;
        const fullImage = this.state.serv_offer.avatarSourceArray != null && this.state.serv_offer.avatarSourceArray.length >= 6;
        return (
          <View style={{ marginLeft: 54, flexWrap: 'wrap', flexDirection: 'row', marginTop: 5 }}>
              {
                  hasImage ?
                    this.state.serv_offer.avatarSourceArray.map((source, i) => {
                        return (
                          <View key={i} style={[styles.avatar, styles.avatarContainer, {marginBottom: 5, marginLeft: 5,}]}>
                              <TouchableOpacity style={{ position: 'absolute', right: 0, top: 0, zIndex: 9999, }} onPress={() => {this.deletePhoto(i)}}>
                                  <Image style={{ width: 20, height: 20, backgroundColor: '#ffc400', borderRadius: 10, }} source={require('../../resource/w-cancel-line-nor.png')} />
                              </TouchableOpacity>
                              <Image style={styles.avatar} source={source}/>
                          </View>
                        );
                    }) : null
              }
              {
                  fullImage ?
                    null :
                    (
                      <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
                          <View style={[styles.avatar, styles.avatarContainer, { marginBottom: 5, marginLeft: 5,  }]}>
                              <Image style={{ width: 100, height: 100, alignSelf: 'center' }} source={require('../../resource/t_img_upload_nil.png')} />
                          </View>
                      </TouchableOpacity>
                    )
              }
          </View>
        );
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <Header
                  title='确认'
                  leftIcon={require('../../resource/ic_back_white.png')}
                  leftIconAction={this._onBack.bind(this)}
                />
                {this.renderProgressView()}
                <ScrollView bounces={false} style={{ flex: 1 }}>
                    <View style={styles.headerView}>
                        <Text style={styles.contentText}>
                            向客户出售您的&nbsp;{this.state.serv_offer.goods_catalogs_name}&nbsp;服务
                        </Text>
                    </View>
                    <View style={styles.rowView}>
                        <Image style={{ width: 20, height: 20, alignSelf: 'center' }} source={require('../../resource/b-aixin-xl.png')} />
                        <View style={styles.rowTextView}>
                            <Text style={styles.contentText}>{this.state.serv_offer.serv_title}</Text>
                        </View>
                    </View>

                    <View style={styles.rowView}>
                        <Image style={{ width: 20, height: 20, alignSelf: 'center' }} source={require('../../resource/b-zanshi-xl.png')} />
                        <View style={styles.rowTextView}>
                            <Text style={styles.contentText}>{this.state.serv_offer.serv_detail}</Text>
                        </View>
                    </View>

                    <View style={styles.rowView}>
                        <Image style={{ width: 20, height: 20, alignSelf: 'center' }} source={require('../../resource/b_location.png')} />
                        <View style={styles.rowTextView}>
                            <Text style={styles.contentText}>{global.user.addressComponent.district}，{global.user.addressComponent.city}，{global.user.addressComponent.province}，{global.user.addressComponent.country}</Text>
                        </View>
                    </View>

                    <View style={styles.rowView}>
                        <Image style={{ width: 20, height: 20, alignSelf: 'center' }} source={require('../../resource/b-pic.png')} />
                        <View style={styles.uploadRowTextView}>
                            <Text style={styles.contentText}>上传作品或相关图片</Text>
                            <Text style={{ fontSize: 14, color: '#cccccc' }}>
                                {this.state.serv_offer.avatarSourceArray != null && this.state.serv_offer.avatarSourceArray.length>0 ? this.state.serv_offer.avatarSourceArray.length : '0'}/6
                            </Text>
                        </View>
                    </View>
                    {this.generateImageContent()}
                </ScrollView>
                <TouchableOpacity style={styles.confirmButton} onPress={this.onServOfferPres.bind(this)} >
                    <Text style={styles.confirmButtonText}>发布</Text>
                </TouchableOpacity>
                <Loading text="发布中" isShow={this.state.showProgress} />
                <Toast ref={toast => this.toast = toast} />
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
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatar: {
        width: 100,
        height: 100,
    },
    rowView: {
        marginHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowTextView: {
        flex: 1,
        borderBottomWidth: 0.5,
        borderBottomColor: '#e0e0e0',
        paddingVertical: 16,
        marginLeft: 18,
    },
    rowTextView: {
        flex: 1,
        borderBottomWidth: 0.5,
        borderBottomColor: '#e0e0e0',
        paddingVertical: 16,
        marginLeft: 18,
    },
    uploadRowTextView: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 16,
        marginLeft: 18,
        justifyContent: 'space-between',
    },
    headerView: {
        paddingVertical: 16,
        marginHorizontal: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: '#eeeeee',
    },
    contentText: {
        color: '#1B2833',
        fontSize: 16,
    },
    confirmButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: global.gColors.buttonColor,
        height: 44,

    },
    confirmButtonText: {
        fontSize: 16,
        color: '#FFF',
        backgroundColor:global.gColors.ButtonColor,
    },
});
