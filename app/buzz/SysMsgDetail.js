import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    WebView,
    Image,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    ScrollView,
    Platform,
    Dimensions,
    Alert
} from 'react-native';
import Header from '../components/HomeNavigation';
import Constant from '../common/constants';
import ShareView from '../components/ShareView';
import UserDefaults from '../common/UserDefaults';

const screenW = Dimensions.get('window').width;
export default class SysMsgDetail extends Component {

    async _createDeal(feed) {       
        console.log("feed:" + JSON.stringify(feed))
        console.log("deal:" + JSON.stringify({
                    deal: {
                        serv_offer_title: feed.serv_offer.serv_title,
                        serv_offer_id: feed.serv_offer_id,
                        offer_user_id: feed.user_id,
                    }
                }))
        try {
            let t = await UserDefaults.cachedObject(Constant.storeKeys.ACCESS_TOKEN_TISPR);
            let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_DEAL_CREATE + t;
            let response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify({
                    deal: {
                        serv_offer_title: feed.serv_offer.serv_title,
                        serv_offer_id: feed.id,
                        offer_user_id: feed.user_id,
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
                        { text: '已通知到对方'},
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

    render(){
        const {feed} = this.props;
        return (
                <FoodCardComponent
                    popAction={() => this.props.navigator.pop()}
                    shareAction={() => this.shareView.share()}
                    collectAction={() => this._createDeal(feed)}
                    feed ={feed}
                />
        )
    }
}

const WebViewComponent = ({
    popAction}) => {
    return (
        <View style={{flex: 1, backgroundColor: 'white'}}>
            <Header
                leftIconAction={popAction}
                title='资讯详情'
                leftIcon={require('../resource/ic_back_dark.png')}
            />
            <WebView
                startInLoadingState={true}
                bounces={false}
                scalesPageToFit={true}
                style={styles.webView}
            />
        </View>
    )
};

const FoodCardComponent = ({
    popAction,
    shareAction,
    collectAction,
    feed
}) => {

    let platformMargin = Platform.OS === 'ios' ? -40 : -30;

    return (
        <View style={{flex: 1, backgroundColor: 'white'}}>
            <Header
                leftIconAction={popAction}
                title='查看详情'
                leftIcon={require('../resource/ic_back_dark.png')}
                rightIcon={require('../resource/ic_photo_share.png')}
                rightIconSize={16}
                rightIconAction={shareAction}
            />
            <View style={[styles.cardImageContent]}>
                <ScrollView
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    removeClippedSubviews={true}
                    contentContainerStyle={{backgroundColor: 'white'}}
                >
                    <View style={{
                        flexDirection: 'row',
                        paddingVertical: 10,
                        paddingHorizontal: 15,
                        alignItems: 'center',
                        overflow: 'hidden'
                    }}>
                        <Image style={{width: 30, height: 30, marginRight: 5, marginLeft: 3}} source={{uri:feed.user.avatar}} defaultSource={require('../resource/user_default_image.png')}/>
                        <View style={{marginLeft: 10}}>
                            <Text style={{color: 'black',fontSize: 18}}>{feed.user_name}</Text>
                            <Text style={{color: 'gray',fontSize: 18}}>{feed.action_title}</Text>
                        </View>
                    </View>
                    <Image style={{width: screenW}} source={{uri:feed.serv_offer.serv_imges}} defaultSource={require('../resource/img_buzz_detail_default.png')}/>
                    <View style={{
                        borderColor: '#ccc',
                        borderTopWidth: 0.5,
                        paddingVertical: 20,
                        paddingHorizontal: 15,
                        justifyContent: 'center',
                        marginTop: 5
                    }}>
                        <Text style={{color: 'black',fontSize: 18}}>{feed.action_desc}</Text>
                        <Text style={{color: 'gray',fontSize: 18}}>{feed.action_title}</Text>
                    </View>
                    {/*<TouchableHighlight style={[styles.bottomToolBar,{height: 40 }]}>
                        <Text style={{ fontSize: 22, color: '#FFF', alignSelf: 'center', backgroundColor: '#81d49c' }}>
                            Connect
                        </Text>
                    </TouchableHighlight>*/}
                </ScrollView>
            </View>
            <TouchableOpacity
                activeOpacity={0.75}
                style={[styles.bottomToolBar, {borderTopWidth: Constant.window.onePR, width: screenW}]}
                onPress={collectAction}
            >
                <Text style={{ fontSize: 22, color: '#FFF' }}>
                    Connect
                </Text>
            </TouchableOpacity>
        </View>
    )
};

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
    }
})
