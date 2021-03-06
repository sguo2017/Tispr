import React, { Component, PureComponent } from 'react';
import {
    View,
    Text,
    Image,
    InteractionManager,
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
    Alert,
    ScrollView,
} from 'react-native'
import Header from '../components/HomeNavigation';
import UselessTextInput from '../components/UselessTextInput';
import UserDefaults from '../common/UserDefaults';
import Constant from '../common/constants';
import resTimes from './restTimes';
import totalResTimes from './totalResTimes';
import noConnectTimes from './noConnectTimes';
import TabBarView from'../containers/TabBarView';
import AutoTextInput from '../components/AutoTextInput'
import ChatRoom from '../chat/ChatRoom'
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
            content: '',
            editable: false
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
            if (this.state.content)
                default_msg += this.state.content;
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
                let newOrder = resObject.feed;
                if(resObject.status==0){
                    this._createChat(newOrder,avaliableTimes);            
                }else if(resObject.status==-2){
                    let connect = true;
                    this.props.navigator.push({component: noConnectTimes, passProps: {connect}})
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

    async _createChat( newOrder, avaliableTimes ){
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
            let connect = true;
            this.props.navigator.push({component:totalResTimes, passProps:{connect, feed: newOrder,type}});
        }else if(avaliableTimes == 5){
            let connect = true;
            this.props.navigator.push({component:resTimes, passProps:{ connect, feed: newOrder,type}});
        }else{
            this.props.navigator.resetTo({component:ChatRoom, passProps: {feed: newOrder, newChat: true}});
        } 
    }

    focusOnTextInput = () => {
        this.setState({ editable: true });
        InteractionManager.runAfterInteractions(() => {
            this.modelTextInput.focus();
        });
    }

    render() {
        const { feed } = this.props;
        let button1 = this.state.button1;
        let button2 = this.state.button2;
        let button3 = this.state.button3;
        let name = feed.user.name;
        let content = this.state.content;
        let send_default_chat_conteng = this.state.send_default_chat_conteng;
        let length = 0;
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <Header
                    title='联系TA'
                    leftIcon={require('../resource/ic_back_white.png')}
                    leftIconAction={() => this.props.navigator.pop()}
                />
                <ScrollView>
                    <View style={{paddingHorizontal: 20}}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Image defaultSource={require('../resource/user_default_image.png')} source={{uri: feed.user.avatar}} style={styles.avatar} />
                        </View>
                        <View style={{ marginTop: 8 }} >
                            <View style={{ alignItems: 'flex-start' }}>
                                <TouchableOpacity 
                                    style={[!this.state.button1&&styles.notSelectedButton, this.state.button1&&styles.selectedButton]} 
                                    onPress={()=>this.setState({button1: !this.state.button1})}
                                >
                                    <Text style={[!this.state.button1&&styles.themeColorText, this.state.button1&&styles.whiteText]}>{msg1}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[!this.state.button2&&styles.notSelectedButton, this.state.button2&&styles.selectedButton]} 
                                    onPress={()=>this.setState({button2: !this.state.button2})}
                                >
                                    <Text style={[!this.state.button2&&styles.themeColorText, this.state.button2&&styles.whiteText]}>{msg2}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[!this.state.button3&&styles.notSelectedButton, this.state.button3&&styles.selectedButton]} 
                                    onPress={()=>this.setState({button3: !this.state.button3})}
                                >
                                    <Text style={[!this.state.button3&&styles.themeColorText, this.state.button3&&styles.whiteText]}>{msg3}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ borderBottomColor: '#eeeeee', borderBottomWidth: 1, marginBottom: 8 }}>
                                <AutoTextInput
                                    ref={(textInput) => { this.modelTextInput = textInput; }}
                                    multiline={true}
                                    onChangeText={(text) => 
                                        {
                                            length= (name+'您好！'+(button1?msg1: '')+(button2?msg2: '')+(button3?msg3: '')).length;
                                            this.setState({content: text.substring(length)});

                                        }
                                    }
                                    onBlur={() => {
                                        this.setState({editable: false})}
                                    }
                                    underlineColorAndroid="transparent"
                                    style={{fontSize: 16, color: '#1B2833'}}
                                    value={name+'您好！'+(button1?msg1: '')+(button2?msg2: '')+(button3?msg3: '')+content}
                                    editable={this.state.editable}
                                />
                            </View>
                            <Text onPress={()=> {
                                this.focusOnTextInput();
                                }} style={[styles.themeColorText]}>
                                自定义信息
                            </Text>
                            {/* <View>
                                <Text style={{color: '#999999', marginVertical: 36}}>获得更多竞标</Text>
                            </View> */}
                        </View>  
                        
                        {/*<View style={{flexDirection: 'row', marginTop: -10, marginBottom: 26}}>
                            <Text style={{fontSize: 16, color: 'black', marginRight: 162}}>为我找到更多人才</Text>
                            <Text style={{lineHeight: 20}}>是</Text>
                            <Image source={require('../resource/g_chevron right.png')} style={{justifyContent: 'flex-end'}}></Image>
                        </View> */}
                    </View>
                </ScrollView>
                <TouchableOpacity 
                    style={{height: 44, backgroundColor: '#FFC400', alignItems: 'center', justifyContent: 'center'}}  
                    onPress={this._createDeal.bind(this)}>
                    <Text style={{fontSize: 16, color: 'white',}}>发送</Text>
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
    themeColorText: {
        color:global.gColors.themeColor,
        fontSize:16,
    },
    whiteText: {
        color:'#fff',
        fontSize:16,
    },
    notSelectedButton: {
        borderWidth: 1,
        borderColor: global.gColors.themeColor,
        paddingHorizontal: 10,
        height: 36,
        marginBottom: 8,
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedButton:{
        borderWidth: 1,
        borderColor: global.gColors.themeColor,
        backgroundColor: global.gColors.themeColor,
        paddingHorizontal: 10,
        height: 36,
        marginBottom: 8,
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
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
        marginVertical: 20,
    }
})
