import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ListView,
    TouchableOpacity,
    RefreshControl,
    PanResponder,
    ViewPagerAndroid,
    TouchableHighlight,
    Alert,
    Dimensions,
    InteractionManager,
    Platform,
} from 'react-native';
import { observer } from 'mobx-react/native'
import { reaction } from 'mobx'
import Swiper from 'react-native-swiper';
import 'babel-polyfill';
import UserDefaults from '../common/UserDefaults'
import Loading from '../components/Loading'
import LoadMoreFooter from '../components/LoadMoreFooter'
import SysMsgSingleImageCell from './SysMsgSingleImageCell'
import Toast from 'react-native-easy-toast'
import SysMsgStore from './SysMsgStore'
import Header from '../components/HomeNavigation';
import Card from './Card'
import Constant from '../common/constants';
import Server from '../server/index';
import Me from '../me/index';
import ServOfferDetail from '../explore/ServOfferDetail'
import resTimes from './restTimes';
import noConnectTimes from './noConnectTimes';
import totalResTimes from './totalResTimes';
import ChatRoom from '../chat/ChatRoom';
import Util from '../common/utils'
import breakdown from '../sys/others/breakdown';
import offline from '../sys/others/offline';
import TabBarView from '../containers/TabBarView';
const KNOWLEDGE_ID = 3

var styles = StyleSheet.create({
    listView: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    wrapper: {
    },
    cardWrapper: {
        flex: 1,
        alignItems: 'center',
        padding: 8,
    },
    CardText: {
        fontSize: 14,
        color: global.gColors.themeColor
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    },
    view: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        marginTop: 40,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#EEEEEE',
        marginVertical: 20,
        marginHorizontal: 18,
    },
    text1: {
        alignSelf: 'center',
        marginVertical: 16,
        fontWeight: 'bold',
        color: '#1B2833',
        fontSize: 14,
    },
    text2: {
        color: '#9E9E9E',
        fontSize: 14,
        marginVertical: 12
    },
    button: {
        height: 50,
        backgroundColor: global.gColors.themeColor,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: 22,
        color: '#FFF',
        alignSelf: 'center'
    },
    swiperBeginButton: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        backgroundColor: '#ffca28',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 5,
    },
    swiperBeginButtonText: {
        fontSize: 17,
        color: 'white',
    }
})

@observer
export default class BussList extends Component {
    constructor(props) {
        super(props);
        d = this;
        UserDefaults.cachedObject(Constant.storeKeys.HAS_SEEN_SWIPER_USER).then((hasSeenSwiperUser) => {
            if (hasSeenSwiperUser != null && hasSeenSwiperUser[global.user.id] == true) {
                this.setState({
                    hasSeenSwiperIntroduce: true
                });
            }
        });
        UserDefaults.cachedObject(Constant.storeKeys.HAS_SEEN_TOTAL_RESTIMES_PAGE).then((hasSeenTotalRestimesPage) => {
            if (hasSeenTotalRestimesPage != null && hasSeenTotalRestimesPage[global.user.id] == true) {
                this.setState({
                    hasSeenTotalTimes: true
                });
            }
        })
    }

    _pictureAction = () => {
        const { user: { name } } = RootStore
        if (name) {
            alert(name)
        } else {
            // this.props.navigator.push({
            //     component: Login,
            //     sceneConfig: Navigator.SceneConfigs.FloatFromBottom
            // })
        }
    }

    state = {
        dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        }),
        sys_msgs: this.props.sys_msgs,
        initCard: 0,
        hasSeenSwiperIntroduce: false,
        swiper_1_height: 230,
        swiper_2_height: 230,
        hasSeenTotalTimes: false,
    }

    knowledgeListStore = new SysMsgStore(KNOWLEDGE_ID)

    componentDidMount() {
        reaction(
            () => this.knowledgeListStore.page,
            () => this.knowledgeListStore.fetchFeedList()
        );
        setTimeout(() => {
            this.setState({
                swiper_1_height: 231,
            })
        }, 100);

        setTimeout(() => {
            this.setState({
                swiper_2_height: 231,
            })
        }, 100);
    }

    componentWillMount() {
        this._getSysMsgs();
    }

    componentWillReact() {
        const { errorMsg } = this.knowledgeListStore
        errorMsg && this.toast.show(errorMsg)
    }

    _renderRow = feed => <KnowledgeItem onPressAvatar={this._onPressAvatar} onPressAddress={this._onPressAddress} onPressOffer ={this._onPressOffer} feed={feed} />

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

    _onPressAddress = ( city ) => {
        console.log("你点击了地址："+city);
        this.props.navigator.resetTo({
            component: TabBarView,
            passProps: {
                city: city,
                initialPage: 1
            }
        });
    }
    _onPressOffer = feed => {  
        let offer = feed.serv_offer;
         /*加入奇客的动态offer为空*/
        if(offer){          
            /*产生动态消息的用户是提供offer的人时*/
            if( offer.user_id == feed.user_id)
                offer.user = feed.user;  
            /*存在被动接触的用户时，offer用户是被接触用户*/
            else if(feed.link_user){
                offer.user = feed.link_user;  
            }else{
                offer.user = feed.user;  
            }
            this.props.navigator.push({
                component: ServOfferDetail,
                passProps: { feed: offer }
            });
        }         
    }

    _onPressSwiperBeginButton = () => {
        this.setState({
            hasSeenSwiperIntroduce: true
        });
        UserDefaults.cachedObject(Constant.storeKeys.HAS_SEEN_SWIPER_USER).then((hasSeenSwiperUser) => {
            if (hasSeenSwiperUser == null) {
                hasSeenSwiperUser = {};
            }
            hasSeenSwiperUser[global.user.id] = true
            UserDefaults.setObject(Constant.storeKeys.HAS_SEEN_SWIPER_USER, hasSeenSwiperUser);
        })
    }

    _onRefresh = () => {
        if(!global.user.authentication_token){
            Util.noToken(this.props.navigator);
        }
    
        this.knowledgeListStore.isRefreshing = true
        this.knowledgeListStore.fetchFeedList();
        this._getSysMsgs();
    }

    _onEndReach = () => this.knowledgeListStore.page++

    async _getSysMsgs() {
            if(!global.user.authentication_token){
               Util.noToken(this.props.navigator);
            }
       
            let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_SYS_MSGS_QUERIES + global.user.authentication_token + `&query_type=` + Constant.sysMsgCatalog.PRIVATE + `&user_id=` + global.user.id + `&page=1`;

            Util.get(
                url,
                (response) => {
                    let sys_msgs = this.state.sys_msgs;
                    // console.log("163:")
                    sys_msgs = (response.feeds);
                    // console.log("165:"+JSON.stringify(sys_msgs))
                    this.setState({
                        sys_msgs: sys_msgs,
                    });
                },
                (error) => {
                    if(error.message == 'Network request failed'){
                        this.props.navigator.push({component: offline})
                    }else{
                        this.props.navigator.push({component: breakdown})
                    }
                }
            )       
    }

    _renderFooter = () => <LoadMoreFooter />

    async _changeSysMsgStatus(newStatus, id, lately_chat_content, receive_user_id) {
        let t = global.user.authentication_token;
        let url = 'http:\/\/' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SSRV_API_SYS_MSGS_TIMELINES + id + '?token=' + t;
        let data ={
            sys_msgs_timeline: {
                status: newStatus,
            },
            lately_chat_content: lately_chat_content
        };
        Util.patch(url,data,
            (response)=>{
                if (newStatus == Constant.sys_msgs_status.FINISHED) {
                    let resObject = response;
                    let avaliableTimes =resObject.avaliable;
                    let newOrder = resObject.feed;
                    if (resObject.status == 0) {
                        this._createChat(newOrder,avaliableTimes, lately_chat_content);
                    } else if (resObject.status == -2) {
                        this.props.navigator.push({component: noConnectTimes});
                    } else if (resObject.status == -1) {
                        Alert.alert(
                            '提示',
                            '对方的邀标达到上限，无法接单了',
                            [
                                { text: '确定'},
                            ]
                        )
                    }
                }
                if (newStatus == Constant.sys_msgs_status.DISCARDED)
                    alert('已忽略，不再显示')
            },
            this.props.navigator
        )
        
    }
    async _createChat(newOrder, avaliableTimes, chat_content) {
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
    _updateCard(index, newStatus, id, lately_chat_content, receive_user_id) {
        let arr = d.state.sys_msgs;
        if (!arr || arr == undefined || arr.length < 1) { return }
        if (index == arr.length - 1) {
            arr.pop();
        } else if (index == 0) {
            arr = arr.slice(1);
        } else {
            arr = arr.slice(0, index).concat(arr.slice(index + 1));
        }
        d.setState({
            sys_msgs: arr,
            initCard: index,
        });
        InteractionManager.runAfterInteractions(() => {
            d._changeSysMsgStatus(newStatus, id, lately_chat_content, receive_user_id);
        });
    }
    generateSwiper = () => {
        const { navigator } = this.props;
        let cardArray = this.state.sys_msgs;
        let pushSwiper = (
            <Swiper
                index={this.state.initCard}
                style={styles.wrapper}
                height={this.state.swiper_2_height}
                showsButtons={false}
                showsPagination={false}
            >
                {
                    cardArray && cardArray.length > 0 ?
                        cardArray.map((data, index) =>
                            <Card
                                key={index}
                                content={data}
                                navigator={navigator}
                                update={this._updateCard}
                                index={index}
                                width={global.gScreen.width}
                            />)
                        : (<View />)
                }
            </Swiper>
        );
        let pushServer = (
            <View style={{ height: 75, justifyContent: 'center', alignItems: 'center' }} >
                <TouchableOpacity
                    onPress={() => { navigator.resetTo({ component: Server, name: 'Server', passProps: {} }) }}
                    style={{
                        borderRadius: 8,
                        width: 120,
                        height: 40,
                        justifyContent: 'center',
                        backgroundColor: global.gColors.buttonColor,
                        shadowColor: global.gColors.buttonColor,
                        shadowOffset: {
                            width: 0,
                            height: 3
                        },
                        shadowRadius: 5,
                        shadowOpacity: 0.8,
                    }}
                >
                    <Text style={{
                        fontSize: 16,
                        color: '#FFF',
                        alignSelf: 'center'
                    }}>发布服务</Text>
                </TouchableOpacity>
            </View>
        );
        let introduceSwiper = (
            <Swiper
                height={this.state.swiper_1_height}
                loop={false}
                showsButtons={false}
                showsPagination={false}
            >
                <View style={[styles.cardWrapper, { width: global.gScreen.width, height: this.state.swiper_1_height }]}>
                    <View style={{ flex: 1, alignItems: 'center', backgroundColor: 'white' }}>
                        <Text style={[styles.CardText, {fontSize: 18, fontWeight: 'bold', marginBottom: 12, marginTop: 24}]}>欢迎{global.user.name}</Text>
                        <Text style={[styles.CardText,{ marginBottom: 3 }]}>这是您的客户需求卡片组，可以向左或</Text>
                        <Text style={styles.CardText}>向右滑动，快试试看！</Text>
                        <View style={{ flex: 1 }} />
                        <Image style={{ width: this.state.swiper_1_height / 228 * 344, height: 105 / 342 * this.state.swiper_1_height / 228 * 344 }} source={require('../resource/card_l_guide_b.png')} />
                    </View>
                </View>
                <View style={[styles.cardWrapper, { width: global.gScreen.width, height: this.state.swiper_1_height }]}>
                    <Image resizeMode='stretch' style={{ flex: 1, width: this.state.swiper_1_height / 228 * 344 }} source={require('../resource/card-l-guide-2.png')} />
                </View>
                <View style={[styles.cardWrapper, { width: global.gScreen.width, height: this.state.swiper_1_height }]}>
                    <Image resizeMode='stretch' style={{ flex: 1, flexDirection: 'row', width: this.state.swiper_1_height / 228 * 344 }} source={require('../resource/card-l-guide-3.png')}>
                        <TouchableOpacity style={styles.swiperBeginButton} onPress={() => this._onPressSwiperBeginButton()}>
                            <Text style={styles.swiperBeginButtonText}>立即开始</Text>
                        </TouchableOpacity>
                    </Image>
                </View>
            </Swiper>
        );

        if (this.state.hasSeenSwiperIntroduce) {
            if (cardArray && cardArray.length > 0) {
                return pushSwiper;
            } else {
                return pushServer;
            }
        } else {
            return introduceSwiper;
        }
    }
    renderHeader = () => {
        let cardArray = this.state.sys_msgs;
        return (
            <View>
                <Text style={styles.text1}>{cardArray && cardArray.length > 0 ? "您有重要更新" : "想要更多机会?"}</Text>
                {this.generateSwiper()} 
                {/* <View style={[styles.view, { marginTop: 10 }]}>
                    <View style={styles.line}></View>
                    <Text style={styles.text2}>奇客动态</Text>
                    <View style={styles.line}></View>
                </View> */}
            </View>
        );
    };
    render() {
        const { feedList, isRefreshing, isFetching } = this.knowledgeListStore
        let cardArray = this.state.sys_msgs;
        return (
            <View style={styles.listView}>
                <View style={{
                    height: Platform.OS === 'android' ? 44 : 64,
                    paddingTop: Platform.OS === 'android' ? 0 : 20, 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    backgroundColor: '#4a90e2'
                }}>
                    <Image source={require('../resource/navbar-w-logo.png')}/>
                </View>
                {/* {!isFetching && */}
                <ListView
                    renderHeader={()=>this.renderHeader()}
                    renderSectionHeader = {() => {
                        return (
                            <View>
                                <View style={[styles.view, { marginTop: 0 }]}>
                                    <View style={styles.line}></View>
                                    <Text style={styles.text2}>奇客动态</Text>
                                    <View style={styles.line}></View>
                                </View> 
                            </View>
                        );
                    }}
                    stickySectionHeadersEnabled={true}
                    dataSource={this.state.dataSource.cloneWithRows(feedList.slice(0))}
                    renderRow={this._renderRow}
                    renderFooter={this._renderFooter}
                    enableEmptySections
                    initialListSize={3}
                    onScroll={this._onScroll}
                    onEndReached={this._onEndReach}
                    onEndReachedThreshold={30}
                    removeClippedSubviews={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={this._onRefresh}
                            colors={['rgb(217, 51, 58)']}
                        />
                    }
                />
                {/* } */}
                <Loading isShow={isFetching} />
                <Toast ref={toast => this.toast = toast} />

            </View>
        )
    }
}

class KnowledgeItem extends Component {

    static propTypes = {
        feed: React.PropTypes.object,
        onPress: React.PropTypes.func
    }

    _pressAvatar = () => {
        const { feed, onPressAvatar } = this.props
        onPressAvatar && onPressAvatar(feed.user_id)
    }
    _pressAvatar2 = () =>{
        const { feed, onPressAvatar } = this.props
        onPressAvatar && onPressAvatar(feed.link_user_id)
    }
    _pressAddress =() =>{
        const { feed, onPressAddress } = this.props
        let cityName = feed.action_desc.split("__")[1]
        onPressAddress && onPressAddress(cityName)
    }
    _pressOffer = () => {
        const { feed, onPressOffer } = this.props
        onPressOffer && onPressOffer(feed)
    }
    render() {
        const { feed: { action_title, action_desc, interval, user, link_user } } = this.props
        const cellData = { action_title, action_desc, interval, user, link_user }
        return <SysMsgSingleImageCell {...cellData} onPressAddress={this._pressAddress} onPressAvatar={this._pressAvatar} onPressAvatar2={this._pressAvatar2} onPressOffer={this._pressOffer} />
    }
}
