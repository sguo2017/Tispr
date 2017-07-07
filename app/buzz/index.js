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
        fontSize: 16,
        margin: 5,
        color: global.gColors.themeColor
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    },
    view: {
        backgroundColor: '#FFFFFF',
        height: 40,
        flexDirection: 'row',
        marginBottom: -2,
        marginTop: 40
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
        swiper_2_height: 230
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

    _renderRow = feed => <KnowledgeItem onPressAvatar={this._onPressAvatar} onPressOffer ={this._onPressOffer} feed={feed} />

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

    _onPressOffer = feed => {  
        let offer = feed.serv_offer;
        /*产生动态消息的用户是提供offer的人时*/
        if(offer.user_id == feed.user_id)
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
        this.knowledgeListStore.isRefreshing = true
        this.knowledgeListStore.fetchFeedList();
        this._getSysMsgs();
    }

    _onEndReach = () => this.knowledgeListStore.page++

    async _getSysMsgs() {
        try {
            let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_SYS_MSGS_QUERIES + global.user.authentication_token + `&query_type=` + Constant.sysMsgCatalog.PRIVATE + `&user_id=` + global.user.id + `&page=1`;
            // console.log("148:"+url)
            fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }).then(response => {
                if (response.status == 200) return response.json()
                return null
            }).then(responseData => {
                // console.log("160:"+JSON.stringify(responseData.feeds))
                if (responseData) {
                    let sys_msgs = this.state.sys_msgs;
                    // console.log("163:")
                    sys_msgs = responseData.feeds;
                    // console.log("165:"+JSON.stringify(sys_msgs))
                    this.setState({
                        sys_msgs: sys_msgs,
                    });
                    //console.log("167:"+JSON.stringify(this.state.sys_msgs))
                } else {

                }
            }).catch(error => {
                console.log(`Fetch evaluating list error: ${error}`)

            })
        } catch (error) {
            console.log(`Fetch evaluating list error: ${error}`)
        }
    }

    _renderFooter = () => <LoadMoreFooter />

    async _changeSysMsgStatus(newStatus, id, lately_chat_content) {
        try {
            let t = global.user.authentication_token;
            let url = 'http:\/\/' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SSRV_API_SYS_MSGS_TIMELINES + id + '?token=' + t;
            let response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sys_msgs_timeline: {
                        status: newStatus,
                    },
                    lately_chat_content: lately_chat_content
                })
            });
            let res = await response.text();
            if (response.status >= 200 && response.status < 300) {
                if (newStatus == Constant.sys_msgs_status.FINISHED) {
                    let resObject = JSON.parse(res);
                    if (resObject.status == 0) {
                        this._createChat(resObject.id, lately_chat_content);
                        Alert.alert(
                            '提示',
                            '联系成功！您今天的沟通次数剩余' + resObject.avaliable + "次",
                            [
                                { text: '确定', onPress: () => this.props.navigator.pop() },
                            ]
                        )
                    } else if (resObject.status == -2) {
                        Alert.alert(
                            '提示',
                            '您今天的沟通机会已用完，请明天再联系',
                            [
                                { text: '确定', onPress: () => this.props.navigator.pop() },
                            ]
                        )
                    } else if (resObject.status == -1) {
                        Alert.alert(
                            '提示',
                            '对方的邀标达到上限，无法接单了',
                            [
                                { text: '确定', onPress: () => this.props.navigator.pop() },
                            ]
                        )
                    }
                }
                if (newStatus == Constant.sys_msgs_status.DISCARDED)
                    alert('已忽略，不再显示')
            } else {
                alert('出错了')
            }
        } catch (error) {
            alert(error)
        }
    }
    async _createChat(_deal_id, chat_content) {
        try {
            let URL = 'http:\/\/' + Constant.url.IMG_SERV_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_CHAT + global.user.authentication_token;
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
        } catch (error) {
            console.log("error " + error);
        }
    }
    _updateCard(index, newStatus, id, lately_chat_content) {
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
            d._changeSysMsgStatus(newStatus, id, lately_chat_content);
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
                        fontSize: 20,
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
                        <Text style={styles.CardText}>欢迎您，{global.user.name}</Text>
                        <Text style={styles.CardText}>这是您的客户需求卡片组，可以向左或</Text>
                        <Text style={styles.CardText}>向右滑动，快试试看！</Text>
                        <Image style={{ width: global.gScreen.width - 16, flex: 1 }} source={require('../resource/card_l_guide_b.png')} />
                    </View>
                </View>
                <View style={[styles.cardWrapper, { width: global.gScreen.width, height: this.state.swiper_1_height }]}>
                    <Image resizeMode='stretch' style={{ flex: 1, width: global.gScreen.width - 16 }} source={require('../resource/card-l-guide-2.png')} />
                </View>
                <View style={[styles.cardWrapper, { width: global.gScreen.width, height: this.state.swiper_1_height }]}>
                    <Image resizeMode='stretch' style={{ flex: 1, flexDirection: 'row', width: global.gScreen.width - 16 }} source={require('../resource/card-l-guide-3.png')}>
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
    render() {
        const { feedList, isRefreshing, isFetching } = this.knowledgeListStore
        let cardArray = this.state.sys_msgs;
        return (
            <View style={styles.listView}>
                <Header title='Qiker' />
                <Text style={styles.text1}>{cardArray && cardArray.length > 0 ? "您有重要更新" : "想要更多机会?"}</Text>
                {this.generateSwiper()}
                <View style={[styles.view, { marginTop: 10 }]}>
                    <View style={styles.line}></View>
                    <Text style={styles.text2}>奇客动态</Text>
                    <View style={styles.line}></View>
                </View>
                {!isFetching &&
                    <ListView
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
                }
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

    _pressOffer = () => {
        const { feed, onPressOffer } = this.props
        onPressOffer && onPressOffer(feed)
    }
    render() {
        const { feed: { action_title, action_desc, interval, user } } = this.props
        const cellData = { action_title, action_desc, interval, user }
        return <SysMsgSingleImageCell {...cellData} onPressAvatar={this._pressAvatar} onPressAvatar2={this._pressAvatar2} onPressOffer={this._pressOffer} />
    }
}
