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
    Dimensions,
    PixelRatio,
    Alert
} from 'react-native'
import ImagePicker from 'react-native-image-picker';
import Header from '../components/HomeNavigation';
import UselessTextInput from '../components/UselessTextInput';
import UserDefaults from '../common/UserDefaults';
import Constant from '../common/constants';
import resTimes from './restTimes';
import totalResTimes from './totalResTimes';
import noConnectTimes from './noConnectTimes';
import TabBarView from'../containers/TabBarView';
const screenW = Dimensions.get('window').width;
const msg1 ='你发布的专业服务很棒！';
const msg2 ='请问你是如何收费的？';
const msg3 = '我想看一下你的更多作品。';
export default class Connect extends Component {

    constructor(props) {
        super(props);
        this.state={
            lately_chat_content: '',
            send_default_chat_conteng:true,
            button1: true,
            button2: false, 
            button3: false,
            hasSeenTotalTimes: false,
        };
        UserDefaults.cachedObject(Constant.storeKeys.HAS_SEEN_TOTAL_RESTIMES_PAGE).then((hasSeenTotalRestimesPage) => {
            if (hasSeenTotalRestimesPage != null && hasSeenTotalRestimesPage[global.user.id] == true) {
                this.setState({
                    hasSeenTotalTimes: true
                });
            }
        })
    }
    
    async _createDeal() {
        const { feed } = this.props;
        if(this.state.send_default_chat_conteng){
            let default_msg;
            default_msg =`${feed.user.name}` + '您好！';
            if(this.state.button1)
                default_msg += msg1;
            if(this.state.button2)
                default_msg += msg2;
            if(this.state.button3)
                default_msg += msg3;
            this.state.lately_chat_content = default_msg;
        }
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
                        serv_offer_title: feed.serv_title?feed.serv_title:feed.serv_offer.serv_title,
                        serv_offer_id: feed.id,
                        offer_user_id: feed.user_id,
                        serv_catagory: feed.serv_catagory,
                        lately_chat_content: this.state.lately_chat_content,
                    }
                })
            });

            let res = await response.text();
            if (response.status >= 200 && response.status < 300) {
                //console.log("line:153");
                let resObject =JSON.parse(res);
                let avaliableTimes =resObject.avaliable;
                let type = 'offer';
                if(resObject.status==0){
                    this._createChat(resObject.id,this.state.lately_chat_content);
                    /*当前用户没有看过每天联系总数量的提示时 */
                    if (!this.state.hasSeenTotalTimes) {
                        UserDefaults.cachedObject(Constant.storeKeys.HAS_SEEN_TOTAL_RESTIMES_PAGE).then((hasSeenTotalRestimesPage) => {
                            if (hasSeenTotalRestimesPage == null) {
                                hasSeenTotalRestimesPage = {};
                            }
                            hasSeenTotalRestimesPage[global.user.id] = true
                            UserDefaults.setObject(Constant.storeKeys.HAS_SEEN_TOTAL_RESTIMES_PAGE, hasSeenTotalRestimesPage);
                        })
                        this.props.navigator.push({component:totalResTimes, passProps:{avaliableTimes,type}});
                    }else if(avaliableTimes == 5){
                        this.props.navigator.push({component:resTimes, passProps:{avaliableTimes,type}});
                    }else{
                        this.props.navigator.resetTo({component:TabBarView, passProps: {initialPage: 3}});
                    }                   
                }else if(resObject.status==-2){
                    this.props.navigator.push({component: noConnectTimes})
                }
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

    async _createChat(_deal_id){
        let chat_content = this.state.lately_chat_content;
        try {
            let URL = `http://` + Constant.url.IMG_SERV_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_CHAT + `${global.user.authentication_token}`;
            let response = await fetch(URL, {
                method: 'POST',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                },

                body: JSON.stringify({
                chat: {
                    deal_id: _deal_id,
                    chat_content: chat_content,
                    user_id: global.user.id,
                    catalog: 2
                    }
                })
            });

            let res = await response.text();
            if (response.status >= 200 && response.status < 300) {
                console.log("line:99");
            } else {
                let error = res;
                throw error;
            }
        } catch (error) {
            console.log("error " + error);
        }
    }

    render() {
        const { feed } = this.props;
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <Header
                    title='联系TA'
                    leftIcon={require('../resource/ic_back_white.png')}
                    leftIconAction={() => this.props.navigator.pop()}
                />
                {
                    this.state.send_default_chat_conteng?
                    <View style={{paddingHorizontal: 20}}>
                        <Image defaultSource={require('../resource/user_default_image.png')} source={{uri: feed.user.avatar}} style={styles.avatar}></Image>                                
                        <View style={{height:80}}>
                            <Text style={{fontSize: 16, color: '#1B2833'}}>{feed.user.name} 您好！{this.state.button1&&msg1}{this.state.button2&&msg2}{this.state.button3&&msg3}</Text>
                        </View>                       
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

                        <View style={{height: 1, backgroundColor: 'rgba(0,0,0,0.12)', marginVertical: 13.7}}></View>

                        <TouchableHighlight 
                            style={[styles.notSelectedButton, {width:Platform.OS ==='ios'?120:100}]} 
                            onPress={()=>this.setState({send_default_chat_conteng:false})}
                        >
                            <Text style={[styles.themeColorText]}>自定义信息</Text>
                        </TouchableHighlight>
                        <View>
                            <Text style={{color: '#999999', marginVertical: 36}}>获得更多竞标</Text>
                        </View>
                        {/*<View style={{flexDirection: 'row', marginTop: -10, marginBottom: 26}}>
                            <Text style={{fontSize: 16, color: 'black', marginRight: 162}}>为我找到更多人才</Text>
                            <Text style={{lineHeight: 20}}>是</Text>
                            <Image source={require('../resource/g_chevron right.png')} style={{justifyContent: 'flex-end'}}></Image>
                        </View> */}
                    </View>:          
                    <View style={{paddingHorizontal: 20}}>
                        <Image defaultSource={require('../resource/user_default_image.png')} source={{uri: feed.user.avatar}} style={styles.avatar}></Image>                                
                        <Text style={{ marginTop:30, color: "#a8a6b9", fontSize: 16}}>联系{feed.user.name}询问服务细节</Text>
                        <TextInput
                            multiline={true}
                            numberOfLines={3}
                            value ={this.state.lately_chat_content}
                            placeholder='请输入聊天内容'
                            onChangeText={(val) => {
                                this.setState({ lately_chat_content: val })
                                }}
                        />
                        <TouchableHighlight 
                            onPress={()=>this.setState({send_default_chat_conteng:true})}
                        >
                            <Text style={[styles.themeColorText]}>发送默认消息</Text>
                        </TouchableHighlight>
                    </View>
                }
                
                <TouchableOpacity style={{height: 44, backgroundColor: '#FFC400'}}  onPress={this._createDeal.bind(this)}>
                    <Text style={{fontSize: 16, color: 'white', marginVertical: 10, marginHorizontal: 164}}>发送</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    webView: {
        width: Constant.window.width,
        height: Constant.window.height - Platform.OS === 'ios' ? 64 : 50,
    },
    bottomToolBar: {
        height: 44,
        width: Constant.window.width,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopColor: '#ccc',
        position: 'absolute',
        bottom: 5,
        backgroundColor: '#81d49c'
    },
    themeColorText:{
        color:global.gColors.themeColor,
        fontSize:16
    },
    whiteText: {
        color:'#fff',
        fontSize:16
    },
    notSelectedButton: {
        borderWidth: 1,
        borderColor: global.gColors.themeColor,
        padding:5,
        height: 36,
        width:Platform.OS === 'ios'? 260: 210,
        marginRight: 20,
        marginBottom: 8,
        borderRadius: 2
    },
    selectedButton:{
        borderWidth: 1,
        borderColor: global.gColors.themeColor,
        backgroundColor: global.gColors.themeColor,
        padding:5,
        height: 36,
        width:Platform.OS === 'ios'? 260: 210,
        marginRight: 20,
        marginBottom: 8,
        borderRadius: 2
    },
    cardImageContent: {
        height: Constant.window.height - (Platform.OS === 'ios' ? 64 : 50) - 44,
        width: Constant.window.width,
        backgroundColor: '#f5f5f5',
        top: Platform.OS === 'ios' ? 64 : 50,
        bottom: 44,
        position: 'absolute'
    },
    line: {
        height: 30,
        width: Constant.window.onePR,
        backgroundColor: '#ccc'
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginHorizontal: 130,
        marginVertical: 20
    }
})
