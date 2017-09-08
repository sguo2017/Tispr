import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Image,
    InteractionManager,
    ListView,
    TouchableOpacity,
    TouchableHighlight,
    RefreshControl,
    Dimensions,
    ScrollView,
    Modal,
    Alert,
    Platform,
    AsyncStorage,
    TouchableWithoutFeedback,
    ToastAndroid,
} from 'react-native'
import { MapView, MapTypes, Geolocation } from 'react-native-baidu-map';
import { observer } from 'mobx-react/native'
import { reaction } from 'mobx'
import { CachedImage } from "react-native-img-cache";
import Swiper from 'react-native-swiper';
import * as WeChat from 'react-native-wechat';
import Loading from '../components/Loading'
import LoadMoreFooter from '../components/LoadMoreFooter'
import Toast from 'react-native-easy-toast'
import Header from '../components/HomeNavigation';
import Connect from '../buzz/Connect'
import Constant from '../common/constants';
import Report from '../sys/others/report';
import UserDefaults from '../common/UserDefaults';
import resTimes from '../buzz/restTimes';
import totalResTimes from '../buzz/totalResTimes';
import noConnectTimes from '../buzz/noConnectTimes';
import AutoTextInput from '../components/AutoTextInput';
import offerEdit from '../me/offerEdit';
import Util from '../common/utils';
import Me from '../me/index';
import breakdown from '../sys/others/breakdown';
import offline from '../sys/others/offline';
const screenW = Dimensions.get('window').width;

const msg1 = '你发布的专业服务很棒！';
const msg2 = '请问你是如何收费的？';
const msg3 = '我想看一下你的更多作品。';
@observer
export default class ServOfferDetail extends Component {
    constructor(props) {
        super(props);
        WeChat.registerApp('wxa2a9d26bbc09d4ac');
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            isMine: false,
            show_share: false,
            show_report: false,
            offerList: [],
            /*相关服务列表快捷回复 */
            show: false,
            button1: true,
            button2: false,
            button3: false,
            connectUserName: '',
            connectUserAvatar: '',
            connectServ: '',
            /*收藏*/
            isFavorited: this.props.feed.isFavorited,
            favorite_id: this.props.feed.favorite_id,
            hasSeenTotalTimes: false,
            editable: false,
            content: '',
            isReported: this.props.feed.isReported,
        };
        UserDefaults.cachedObject(Constant.storeKeys.HAS_SEEN_TOTAL_RESTIMES_PAGE).then((hasSeenTotalRestimesPage) => {
            if (hasSeenTotalRestimesPage != null && hasSeenTotalRestimesPage[global.user.id] == true) {
                this.setState({
                    hasSeenTotalTimes: true
                });
            }
        })
    }
    _p = feed => {
        this.props.navigator.push({
            component: Connect,
            passProps: { feed }
        })
    }
    componentWillMount() {
        this._getSameTypeOffer();
    }
    componentDidMount() {
        let longitude = 116.406568, latitude = 39.915156 //缺省是天安门位置
        if (this.props.feed.latitude != undefined || this.props.feed.longitude != undefined) {
            longitude = Number(this.props.feed.longitude), latitude = Number(this.props.feed.latitude)
        }
        Geolocation.getCurrentPosition().then(
            (data) => {
                this.setState({
                    zoom: 18,
                    markers: [{
                        latitude: data.latitude,
                        longitude: data.longitude,
                        title: '我的位置'
                    }, {
                        longitude: longitude,
                        latitude: latitude,
                        title: "对方位置"
                    }],
                    center: {
                        latitude: latitude,
                        longitude: longitude,
                    }
                })
            }
        ).catch(error => {
            console.warn(error, 'error')
        })

    }
    async _getSameTypeOffer() {
        let catalog_id = this.props.feed.goods_catalog_id;
        let serv_id = this.props.feed.id;
        if(!global.user.authentication_token){
            Util.noToken(this.props.navigator);
        }
        let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_SERV_OFFER_INDEX + global.user.authentication_token + `&catalog_id=${catalog_id}&serv_id=${serv_id}`;        
        Util.get(
            url,
            (response) => {
                let offerList = this.state.offerList
                offerList = JSON.parse(response.feeds);
                this.setState({
                    offerList: offerList,
                });
            },
            (error) => {
                if(error.message == 'Network request failed'){
                    this.props.navigator.push({component: offline})
                }else{
                    console.log("servOfferDetail错误信息"+error)
                    this.props.navigator.push({component: breakdown})
                }
            }
        )       
    }

    async _sendMessage() {
        this.setState({
            show: false
        });
        let feed = this.state.connectServ;
        let default_msg;
        default_msg = `${feed.user.name}` + '您好！';
        if (this.state.button1)
            default_msg += msg1;
        if (this.state.button2)
            default_msg += msg2;
        if (this.state.button3)
            default_msg += msg3;
        try {
            let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_ORDER_CREATE + global.user.authentication_token;
            let response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify({
                    order: {
                        serv_offer_title: feed.serv_title,
                        serv_offer_id: feed.id,
                        offer_user_id: feed.user_id,
                        serv_catagory: feed.serv_catagory,
                        lately_chat_content: default_msg,
                    }
                })
            });

            let res = await response.text();
            if (response.status >= 200 && response.status < 300) {
                //console.log("line:153");
                let resObject = JSON.parse(res);
                 let newOrder = resObject.feed;
                let avaliableTimes = resObject.avaliable;
                if (resObject.status == 0) {
                    this._createChat(newOrder, avaliableTimes, default_msg);
                } else if (resObject.status == -2) {
                    this.props.navigator.push({component: noConnectTimes})
                }
            } else {
                let error = res;
                throw error;
            }
        } catch (error) {
            console.log("error " + error);
        }
    }

    async _createChat(newOrder, avaliableTimes, chat_content){
    let type = 'offer';
        /*当前用户没有看过每天联系总数量的提示时 */
    if (!this.state.hasSeenTotalTimes) {
        UserDefaults.cachedObject(Constant.storeKeys.HAS_SEEN_TOTAL_RESTIMES_PAGE).then((hasSeenTotalRestimesPage) => {
            if (hasSeenTotalRestimesPage == null) {
                hasSeenTotalRestimesPage = {};
            }
            hasSeenTotalRestimesPage[global.user.id] = true
            UserDefaults.setObject(Constant.storeKeys.HAS_SEEN_TOTAL_RESTIMES_PAGE, hasSeenTotalRestimesPage);
        })
        this.props.navigator.push({component:totalResTimes, passProps:{feed: newOrder,type}});
    }else if(avaliableTimes == 5){
        this.props.navigator.push({component:resTimes, passProps:{feed: newOrder,type}});
    }else{
        this.props.navigator.resetTo({component:ChatRoom, passProps: {feed: newOrder, newChat: true}});
    }      
  }
    _onPressCell(feed) {
        this.props.navigator.push({
            component: ServOfferDetail,
            passProps: { feed }
        });
    }

    _selectMessage = (feed) => {
        let connectUser = feed.user
        if(connectUser){
            this.setState({
                connectUserAvatar: connectUser.avatar,
                connectUserName: connectUser.name,
                show: true,
                connectServ: feed,
            })
        }
    }

    _switch() {
        if (this.state.isFavorited) {
            this.cancelCollect()
        } else {
            this.collect()
        }
    }

    async collect() {
        try {
            let t = global.user.authentication_token;
            let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_SERV_OFFER_COLLECT + t;
            console.log("69")
            let response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    favorite: {
                        obj_id: this.props.feed.id,
                        obj_type: 'serv_offer',
                        user_id: global.user.id,
                    }
                })
            });

            let res = await response.text();
            if (response.status >= 200 && response.status < 300) {
                let rmsg = JSON.parse(response._bodyText);
                this.props.feed.favorite_id = rmsg.favorite_id;
                this.props.feed.isFavorited? (this.props.feed.isFavorited= true):(this.props.isFavorited);
                global.user.favorites_count++;
                this.setState({ isFavorited: true });
            } else {
                let error = res;
                throw error;
            }
        } catch (error) {
            console.log(`Fetch evaluating list error: ${error}`)
        }
    }

    async cancelCollect() {
        try {
            let t = global.user.authentication_token;
            let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_SERV_OFFER_COLLECT_CANCEL + '/' + this.props.feed.favorite_id + '?token=' + t;
            console.log("101")
            let response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });

            let res = await response.text();
            if (response.status >= 200 && response.status < 300) {
                this.props.feed.isFavorited = false;
                global.user.favorites_count--;
                this.setState({ isFavorited: false });
            } else {
                let error = res;
                throw error;
            }
        } catch (error) {
            console.log(`Fetch evaluating list error: ${error}`)
        }
    }
    reportOffer(id) {
        this.setState({
            show_report: false,
        })
        let obj = {
            id: id,
            type: 'good'
        };
        let _this = this;
        let getData = (a) => {
            _this.setState({isReported: a})
        }
        this.props.navigator.push({
            component: Report,
            passProps: { obj, getData}
        });
    }

    focusNextField (nextField){
        this.refs[nextField].focus();
    };

    offerEdit() {
        this.props.navigator.push({
            component: offerEdit
        })
    }

    async cancelOffer() {
        Alert.alert(
            '提示',
            '确认删除该服务？',
            [
                 { text: '取消', onPress: () => {} },
                 { text: '确定', onPress: this.deleteOffer.bind(this)}
            ]
        )
    }

    async  deleteOffer() {
        this.setState({ isMine: false});
        try {
            let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_SERV_OFFER_EDIT+ this.props.feed.id +`?token=`+ global.user.authentication_token;
            let response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            let res = await response.text();
            if (response.status >= 200 && response.status < 300) {
                global.user.offer_count--;
                let resObject =JSON.parse(res);
                if(resObject.status==0){
                    this.props.navigator.pop()
                }else{
                }
            }
        } catch(error) {

        }  
    }

    focusOnTextInput = () => {
        this.setState({ editable: true });
        InteractionManager.runAfterInteractions(() => {
        this.modelTextInput.focus();
        });
    }

    _onPressAvatar = (id) => {
        this.props.navigator.push({
            component: Me,
            passProps: {
                isBrowseMode: true,
                close: () => {
                    this.props.navigator.pop();
                },
                id: id
            }
        });
    }

    render() {
        const { feed } = this.props;
        let _images = feed.serv_images.split(',');
        let mine = feed.user.id === global.user.id? true : false;
        return (
            <View style={styles.listView}>
                {this.state.show_share||this.state.show_report||this.state.isMine?
                <View style={styles.cover}></View>
                :null}
                <Header
                    title='服务'
                    leftIcon={require('../resource/w-back.png')}
                    leftIconAction={() => this.props.navigator.pop()}
                    rightIcon={require('../resource/w-more.png')}
                    rightIconAction={() => {
                        mine? this.setState({ isMine: true}):this.setState({ show_report: true });
                        }
                    }
                    rightIcon2={require('../resource/w-share.png')}
                    rightIcon2Action={() => {
                        this.setState({ show_share: true });
                        {/* Animated.timing(
                            this.state.fadeAnim,
                            {
                                toValue: 1,
                                //duration: 5000,
                            }
                        ).start(); */}
                    }}
                    style={{ height: 50 }}
                />
                
                <ScrollView>
                    <View style={{ paddingHorizontal: 16, justifyContent: 'space-between', backgroundColor: 'white' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between',paddingVertical: 8, height: 48}}>
                            <View style={{ justifyContent: 'space-around', flexDirection: 'row', }}>
                                <TouchableOpacity onPress={this._onPressAvatar.bind(this, feed.user.id)}>
                                    <Image style={{ width: 32, height: 32, borderRadius: 16 }} source={{ uri: feed.user.avatar }} defaultsource={require('../resource/user_default_image.png')}></Image>
                                </TouchableOpacity>
                                <View style={{ marginLeft: 8, marginTop: -5 }}>
                                    <Text style={{ fontSize: 14, lineHeight: 20, color: '#000' }}>{feed.user.name}</Text>
                                    {
                                        feed.catalog ?
                                            <Text style={{ color: '#999999', fontSize: 12 }}>{feed.catalog}</Text>
                                            : <Text style={{ color: '#999999', fontSize: 12 }}>视频</Text>
                                    }
                                </View>
                            </View>
                            <View>
                                <Text style={{ color: '#999999', fontSize: 12 }}>{feed.created_at.substring(0, 4) + '/' + feed.created_at.substring(5, 7) + '/' + feed.created_at.substring(8, 10)}</Text>
                            </View>
                        </View>
                        <View style={{height: 1, backgroundColor: '#EDEDED', width: screenW, marginLeft: -16, marginBottom: 16}}></View>
                        {
                            _images.length == 1 ?
                                <Image style={{ height: 300, width: screenW-32, marginBottom: 10 }}  source={{ uri: _images[0] }}></Image>
                                :
                                <Swiper height={320} paginationStyle={{ alignSelf: 'center' }}>
                                    {
                                        _images.map((data, index) => {
                                            return (
                                                <Image style={{ height: 300, width: screenW-32, marginBottom: 10 }} key={index} source={{ uri: data }}></Image>
                                            )
                                        })
                                    }
                                </Swiper>
                        }
                        <Text style={{ color: '#000', fontSize: 18, lineHeight: 24 }}>{feed.serv_title}</Text>
                        <Text style={{ color: '#999999', fontSize: 14, lineHeight: 24 }}>{feed.serv_detail}</Text>
                        <View style={{ backgroundColor: '#FFC400', height: 18, width: 68, borderRadius: 2, justifyContent: 'center', alignItems: 'center', marginTop: 8 }}>
                            <Text style={{ color: 'white', fontSize: 12 }}>发布成功</Text>
                        </View>
                    </View>
                    {
                        feed.user_id == global.user.id ?
                            <View style={{ paddingBottom: 16, backgroundColor: 'white' }}></View> :
                            <View style={{ backgroundColor: 'white', paddingTop: 23, paddingBottom: 16 }}>
                                <TouchableOpacity 
                                    style={{ 
                                        backgroundColor: '#FFC400', 
                                        borderRadius: 4, 
                                        height: 44, 
                                        marginHorizontal: 16, 
                                        alignItems: 'center',
                                        paddingVertical: 10,
                                    }}
                                    onPress={() => this._p(feed)}
                                >
                                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>联系TA</Text>
                                </TouchableOpacity>
                            </View>
                    }
                    <View style={{paddingHorizontal:16,paddingVertical: 10, backgroundColor: 'white'}}>
                        {   
                            feed.via == 'local' ?<Text>提供{feed.province}{feed.city}{feed.district}{Constant.offer_range[feed.range]}的服务</Text>  :<Text></Text>                        
                        }
                        {
                            feed.via == 'remote'? <Text>提供远程服务</Text>:<Text></Text>
                        }
                        {
                            feed.via == 'all'?<Text>提供远程服务，以及提供{feed.province}{feed.city}{feed.district}{Constant.offer_range[feed.range]}的服务</Text>:<Text></Text>
                        }
                    </View>
        
                        <MapView
                            trafficEnabled={this.state.trafficEnabled}
                            baiduHeatMapEnabled={this.state.baiduHeatMapEnabled}
                            zoom={this.state.zoom}
                            mapType={this.state.mapType}
                            center={this.state.center}
                            marker={this.state.marker}
                            markers={this.state.markers}
                            style={styles.map}
                            onMarkerClick={(e) => {
                                console.warn(JSON.stringify(e));
                            }}
                            onMapClick={(e) => {
                            }}
                        >
                        </MapView>
                    {
                        this.state.offerList.length > 0 ?
                            <View style={{ justifyContent: 'space-around', alignItems: 'center', marginTop: 2, backgroundColor: '#eeee' }}>
                                <Text style={{ color: '#9E9E9E', fontSize: 14, paddingVertical: 20 }}>相关服务</Text>
                            </View>
                            :
                            <View></View>
                    }


                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', backgroundColor: '#eeee' }}>
                        <View>
                            {this.state.offerList.map((data, index) => {
                                if (index%2 === 1) return;
                                return (
                                    <OfferItem
                                        key={`${data.id}-${index}`}
                                        offer={data}
                                        onPress={() => this._onPressCell(data)}
                                        onCall={() => this._selectMessage(data)}
                                    />
                                )
                            })}
                        </View>
                        <View>
                            {this.state.offerList.map((data, index) => {
                                if (index%2 === 0) return;
                                return (
                                    <OfferItem
                                        key={`${data.id}-${index}`}
                                        offer={data}
                                        onPress={() => this._onPressCell(data)}
                                        onCall={() => this._selectMessage(data)}
                                    />
                                )
                            })}
                        </View>
                    </View>                    
                </ScrollView>
                {/*分享弹窗*/}
                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={this.state.show_share}
                    onShow={() => { }}
                    onRequestClose={() => { }}
                >
                    <TouchableWithoutFeedback style={{flex: 1}} onPress={()=> this.setState({show_share: false})}>
                    <View style={styles.container}>
                    <View style={styles.modal}>
                        <TouchableWithoutFeedback  onPress={() => {}}>
                        <View style={{ borderRadius: 10, backgroundColor: 'white', height: 112, alignItems: 'center', justifyContent: 'center'}}>
                            <View style={styles.share}>
                                <TouchableOpacity style={styles.item} onPress={() => {
                                    console.log("558yes")
                                    WeChat.isWXAppInstalled()
                                        .then((isInstalled) => {
                                            console.log("561yes")
                                        if (isInstalled) {
                                            console.log("563yes")
                                            WeChat.shareToSession({title: feed.serv_title,
                                            description: feed.serv_detail,
                                            thumbImage: _images[0],
                                            type: 'news',
                                            webpageUrl: 'http://'+Constant.url.SHARE_SERV_ADDR + ':' + Constant.url.SHARE_SERV_PORT + '/goods_show?id='+ feed.id})
                                            .catch((error) => {
                                            console.log("566"+JSON.stringify(error));
                                            });
                                        } else {
                                            console.log('没有安装微信软件，请您安装微信之后再试');
                                        }
                                        });
                                }}>
                                    <Image source={require('../resource/ico-wechat.png')} style={styles.img}></Image>
                                    <Text style={styles.text}>微信</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.item}
                                    onPress={() => {
                                WeChat.isWXAppInstalled()
                                    .then((isInstalled) => {
                                    if (isInstalled) {
                                WeChat.shareToTimeline({title:feed.serv_title,
                          description: feed.serv_detail,
                          thumbImage: _images[0],
                          type: 'news',
                          webpageUrl: 'http://'+Constant.url.SHARE_SERV_ADDR + ':' + Constant.url.SHARE_SERV_PORT + '/goods_show?id='+ feed.id})
                                        .catch((error) => {
                                        console.log("583"+JSON.stringify(error));

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
                            }}
                                >
                                    <Image source={require('../resource/ico-friend.png')} style={styles.img}></Image>
                                    <Text style={styles.text}>朋友圈</Text>
                                </TouchableOpacity>
                                {/*<TouchableOpacity style={styles.item}>
                                    <Image source={require('../resource/ico-qq.png')} style={styles.img}></Image>
                                    <Text style={styles.text}>QQ</Text>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Image source={require('../resource/ico-weibo.png')} style={styles.img}></Image>
                                    <Text style={styles.text}>新浪微博</Text>
                                </TouchableOpacity>*/}
                            </View>
                        </View>
                        </TouchableWithoutFeedback>
                        <TouchableOpacity 
                            onPress={() => this.setState({ show_share: false })} 
                            style={{ alignItems: 'center', justifyContent: 'center',marginTop: 6, borderRadius: 10, backgroundColor: 'white', height: 56}}>
                            <Text style={styles.cancel}>取消</Text>
                        </TouchableOpacity>
                    </View>
                    </View>
                    </TouchableWithoutFeedback>
                </Modal>

                {/*相关服务列表快捷回复弹窗*/}
                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={this.state.show}
                    onRequestClose={() => { }}
                >
                    <View style={styles.modalStyle}>
                        <View style={[styles.subView, { height: 430 }]}>
                            <View style={styles.modalHead}>
                                <TouchableOpacity onPress={() => this.setState({ show: false })}>
                                    <Text style={styles.themeColorText}>取消</Text>
                                </TouchableOpacity>
                                <Text style={{ color: 'black', fontSize: 16 }}>快捷回复</Text>
                                <TouchableOpacity onPress={this._sendMessage.bind(this)}>
                                    <Text style={styles.themeColorText}>发送</Text>
                                </TouchableOpacity>
                            </View>
                            <ScrollView>
                                <View style={{ marginLeft: 20 }}>
                                    <Image defaultSource={require('../resource/user_default_image.png')} source={{uri: this.state.connectUserAvatar}} style={styles.avatar}></Image>
                                    {/*<View style={{height:80}}>
                                        <Text style={{fontSize: 16, color: '#1B2833'}}>{this.state.connectUserName}您好！{this.state.button1&&msg1}{this.state.button2&&msg2}{this.state.button3&&msg3}</Text>
                                    </View>*/}
                                    <AutoTextInput
                                            ref={(textInput) => { this.modelTextInput = textInput; }}
                                            multiline={true}
                                            onChangeText={(text) => 
                                                {
                                                    let length= (this.state.connectUserName+'您好！'+(this.state.button1?msg1: '')+(this.state.button2?msg2: '')+(this.state.button3?msg3: '')).length;
                                                    this.setState({content: text.substring(length)});

                                                }
                                            }
                                            onBlur={() => {
                                                this.setState({editable: false})}
                                            }
                                            style={{fontSize: 16, color: '#1B2833', marginBottom: 8}}
                                            value={this.state.connectUserName+'您好！'+(this.state.button1?msg1: '')+(this.state.button2?msg2: '')+(this.state.button3?msg3: '')+this.state.content}
                                            underlineColorAndroid={'transparent'}
                                            editable={this.state.editable}
                                        />

                                    <TouchableHighlight 
                                        style={[!this.state.button1&&styles.notSelectedButton, this.state.button1&&styles.selectedButton]} 
                                        onPress={()=>this.setState({button1: !this.state.button1})}
                                    >
                                        <Text style={[!this.state.button1&&styles.themeColorText, this.state.button1&&styles.whiteText]}>{msg1}</Text>
                                    </TouchableHighlight>
                                    <TouchableHighlight 
                                        style={[!this.state.button2&&styles.notSelectedButton, this.state.button2&&styles.selectedButton]} 
                                        onPress={()=>this.setState({button2: !this.state.button2})}
                                    >
                                        <Text style={[!this.state.button2&&styles.themeColorText, this.state.button2&&styles.whiteText]}>{msg2}</Text>
                                    </TouchableHighlight>
                                    <TouchableHighlight 
                                        style={[!this.state.button3&&styles.notSelectedButton, this.state.button3&&styles.selectedButton]} 
                                        onPress={()=>this.setState({button3: !this.state.button3})}
                                    >
                                        <Text style={[!this.state.button3&&styles.themeColorText, this.state.button3&&styles.whiteText]}>{msg3}</Text>
                                    </TouchableHighlight>
                                    <TouchableHighlight 
                                        style={[styles.notSelectedButton, {width:Platform.OS ==='ios'?120:100}]} 
                                        onPress={()=> {
                                            {/* this.setState({editable: true}); */}
                                            this.focusOnTextInput();
                                        }}
                                    >
                                        <Text style={[styles.themeColorText]}>自定义信息</Text>
                                    </TouchableHighlight>
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={this.state.show_report}
                    onRequestClose={() => { }}
                >
                    <TouchableWithoutFeedback style={{flex: 1}} onPress={() => this.setState({show_report: false})}>
                    <View style={styles.container}> 
                    <View style={styles.modal}>
                        <TouchableWithoutFeedback  onPress={() => {}}>
                        <View style={{ borderRadius: 10, backgroundColor: 'white'}}>
                            <TouchableOpacity 
                                style={[styles.modalItem, {alignItems: 'center', justifyContent:'center',}]}
                                onPress={()=>{
                                    this._switch(this.state.isFavorited, this.state.favorite_id);
                                    this.setState({show_report: false})
                                }}
                            >
                                {!this.state.isFavorited?
                                <View style={{ flexDirection: 'row' }}>
                                    <Image source={require('../resource/b-archive.png')} />
                                    <Text style={styles.modalText}>收藏</Text>
                                </View>:
                                <View style={{ flexDirection: 'row' }}>
                                    <Image source={require('../resource/y-check-r.png')} />
                                    <Text style={{ lineHeight: 21 }}>已收藏</Text>
                                </View>}
                            </TouchableOpacity>
                            <View style={{height: 0.5, backgroundColor: 'rgba(237,237,237,1)'}}></View>
                            {!this.state.isReported?
                            <TouchableOpacity style={[styles.modalItem, {justifyContent: 'center', alignItems: 'center' }]}
                                onPress={
                                    this.reportOffer.bind(this, feed.id)
                                }
                            >
                                <View style={{ flexDirection: 'row' }}>
                                    <Image source={require('../resource/y-jubao.png')} />
                                    <Text style={styles.modalText}>举报</Text>
                                </View>
                            </TouchableOpacity>:
                            <View style={[styles.modalItem, {justifyContent: 'center', alignItems: 'center' }]}>
                                <Text style={{ fontSize: 14}}>已举报</Text>
                            </View>
                            }    
                        </View>
                        </TouchableWithoutFeedback>
                        <TouchableOpacity 
                            onPress={() => this.setState({ show_report: false })} 
                            style={{ alignItems: 'center', justifyContent: 'center', marginTop: 6, borderRadius: 10, backgroundColor: 'white', height: 56}}>
                            <Text style={styles.modalText}>取消</Text>
                        </TouchableOpacity>
                    </View>
                    </View>
                    </TouchableWithoutFeedback>
                </Modal>
                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={this.state.isMine}
                    onRequestClose={()=>{}}
                >
                <TouchableWithoutFeedback style={{flex: 1}} onPress={() => this.setState({isMine: false})}>
                    <View style={styles.container}> 
                    <View style={styles.modal}>
                        <TouchableWithoutFeedback  onPress={() => {}}>
                        <View style={{ borderRadius: 10, backgroundColor: 'white',  marginBottom: 6}}>
                            <TouchableOpacity 
                                style={[styles.modalItem, { justifyContent: 'center', alignItems: 'center', }]}
                                onPress={() => {
                                    this.props.navigator.push({
                                        component: offerEdit,
                                        passProps: {mine, feed}
                                    });
                                    this.setState({isMine: false});
                                }}
                            >
                                <Text 
                                    style={[styles.modalText, {color: global.gColors.themeColor}]}>编辑</Text>
                            </TouchableOpacity>
                            <View style={{height: 0.5, backgroundColor: 'rgba(237,237,237,1)'}}></View>
                            <TouchableOpacity 
                                style={[styles.modalItem, { justifyContent: 'center', alignItems: 'center',}]}
                                onPress={this.cancelOffer.bind(this)}
                            >
                                <Text style={[styles.modalText, {color: 'red'}]}>删除</Text>
                            </TouchableOpacity>
                        </View>
                        </TouchableWithoutFeedback>
                        <TouchableOpacity
                            onPress={() => this.setState({isMine: false})} 
                            style={{alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: 'white', height: 56}}>
                            <Text style={styles.modalText}>取消</Text>
                        </TouchableOpacity>

                    </View>
                    </View>
                </TouchableWithoutFeedback>
                </Modal>    
            </View>
        )
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
    container:{  
        flex:1,  
        backgroundColor: 'transparent',  
        // position: 'absolute',  
        // top: 0,  
        // bottom: 0,  
        // left: 0,  
        // right: 0,  
        justifyContent:'center',  
        alignItems:'center'  
    },  
    listView: {
        flex: 1,
        position: 'relative'
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
    modalItem: {
        height: 56,
        justifyContent: 'center',
        marginHorizontal: 22
    },
    modalText: {
        fontSize: 16,
        color: 'black',
    },
    cancel: {
        color: '#1B2833',
        fontSize: 16,
        //marginTop: 30,
        marginHorizontal: 132
    },
    cardContainer: {
        width: (screenW - 24) / 2,
        margin: 4,
        backgroundColor: '#fff',
        borderRadius: 4,
        overflow: 'hidden',
    },
    cardUserInfoView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 8,
        borderTopWidth: 1,
        borderColor: '#eeeeee',
    },

    // modal的样式
    modalStyle: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        flex: 1,
    },
    // modal上子View的样式
    subView: {
        alignSelf: 'stretch',
        justifyContent: 'flex-start',
        borderWidth: 0.5,
        backgroundColor: '#fff',
        height: 300,
    },
    // 标题
    modalHead: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10
    },
    themeColorText: {
        color: global.gColors.themeColor,
        fontSize: 16
    },
    blackText: {
        color: '#000',
        padding: 5,
        borderRadius: 3,
        fontSize: 18
    },
    whiteText: {
        color: '#fff',
        fontSize: 16,
    },
    notSelectedButton: {
        borderWidth: 1,
        borderColor: global.gColors.themeColor,
        padding:5,
        height: 36,
        marginRight: 20,
        marginBottom: 8,
        borderRadius: 4,
        width:Platform.OS === 'ios'? 250: 210,
        justifyContent: 'center'
    },
    selectedButton: {
       borderWidth: 1,
        borderColor: global.gColors.themeColor,
        backgroundColor: global.gColors.themeColor,
        padding:5,
        height: 36,
        marginRight: 20,
        marginBottom:8,
        borderRadius: 4,
        width:Platform.OS === 'ios'? 250: 210,
        justifyContent: 'center'
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginHorizontal: 130,
        marginVertical: 20
    },
    SwiperSlide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB',
    },
    map: {
        width: Dimensions.get('window').width - 40,
        height: Dimensions.get('window').height - 500,
        marginBottom: 10,
        marginLeft: 20,
    },
})

const OfferItem = ({
  offer,
    onPress,
    onCall,
}) => {
    let width = (screenW - 24) / 2;
    let imageH = 120;
    let offerUser = offer.user;
    let offerUserNil = offer.user && true;
    let serv_image = offer.serv_images && offer.serv_images != 'undefined' ? { uri: offer.serv_images.split(',')[0] } : require('../resource/qk_nav_default.png');
    if(!offerUserNil){
        return (<View></View>)
    }
    return (
        <TouchableOpacity
            activeOpacity={0.75}
            style={styles.cardContainer}
            onPress={onPress}
        >
            <CachedImage
                style={{ width: width, height: imageH, borderTopLeftRadius: 4, borderTopRightRadius: 4 }}
                defaultSource={require('../resource/qk_nav_default.png')}
                source={serv_image}
            />
            <View style={{
                width: width,
                paddingHorizontal: 15,
                paddingVertical: 8,
            }}>
                <Text style={{ fontSize: 14, color: '#1b2833', marginBottom: 4 }} numberOfLines={2}>{offer.serv_title}</Text>
                <Text style={{ fontSize: 12, color: '#999999', marginBottom: 4 }}>{offer.catalog}</Text>
                <View style={{ flexDirection: 'row' }}>
                    <Image style={{ width: 12, height: 12 }} source={require('../resource/g-location-s.png')} />
                    <Text style={{ fontSize: 12, color: '#b8b8b8' }}>{offer.district}</Text>
                </View>
            </View>
            <View style={styles.cardUserInfoView}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <CachedImage
                        style={{ height: 22, width: 22, borderRadius: 15 }}
                        source={{ uri: offerUserNil && offerUser.avatar }}
                        defaultSource={require('../resource/img_default_avatar.png')}
                    />
                    <Text
                        style={{ fontSize: 14, color: 'gray', marginLeft: 8, width: width * 0.4 }}
                        numberOfLines={1}
                    >
                        {offerUserNil && offerUser.name}
                    </Text>
                </View>
                {offer.user.id == global.user.id?<View></View>:
                <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={onCall}
                >
                    <Image style={{ height: 18, width: 18 }} source={require('../resource/y-chat.png')} />
                </TouchableOpacity>}
            </View>
        </TouchableOpacity>
    );
}

