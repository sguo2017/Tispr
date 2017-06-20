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
    Alert
} from 'react-native';

import { observer } from 'mobx-react/native'
import { reaction } from 'mobx'
import Loading from '../components/Loading'
import LoadMoreFooter from '../components/LoadMoreFooter'
import SysMsgSingleImageCell from './SysMsgSingleImageCell'
import FeedMultiImageCell from './SysMsgMultiImageCell'
import SysMsgDetail from './SysMsgDetail'
import Toast from 'react-native-easy-toast'
import SysMsgStore from './SysMsgStore'
import Header from '../components/HomeNavigation';
import Card from './Card'
import Wrapper from './Wrapper';
import Constant from '../common/constants';
import Swiper from 'react-native-swiper';
import 'babel-polyfill';
const KNOWLEDGE_ID = 3
const itemWidth = global.gScreen.width - 20;
const itemHeight = 300;

var cardArray=[];
var styles = StyleSheet.create({
    listView: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    wrapper: {
        width: global.gScreen.width,
        height: 260,
        borderRadius: 4,
    },
    cardWrapper:{
        width: global.gScreen.width,
        height: 260,
        borderRadius: 4,
        alignItems:'center'
    },
    CardText:{
        fontSize:16,
        margin:5,
        color:global.gColors.themeColor
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
        paddingLeft: 13.7,
        marginTop: 40
    },
    line: {
        width: 122.5,
        height: 2.5,
        backgroundColor: '#EEEEEE',
        marginVertical: 20,
    },
    text1: {
        alignSelf: 'center',
        marginVertical: 16,
        height:20,
        fontWeight: 'bold',
        color: '#1B2833',
        fontSize: 14,
    },
    text2: {
        height: 20,
        color: '#9E9E9E',
        fontSize: 14,
        marginHorizontal: 13.7,
        marginVertical: 11
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
})

@observer
export default class BussList extends Component {
    constructor(props){
     super(props);
      d = this;                    
  }

    _pictureAction = () => {
        const { user: { name } } = RootStore
        if (name) {
            alert(name)
        } else {
            this.props.navigator.push({
                component: Login,
                sceneConfig: Navigator.SceneConfigs.FloatFromBottom
            })
        }
    }

    state = {
        dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        }),
        sys_msgs:this.props.sys_msgs,    
        initCard:0 ,
        swiper_mutex:true,
        swiper_1_height:230,
        swiper_2_height:230
    }

    knowledgeListStore = new SysMsgStore(KNOWLEDGE_ID)

    componentDidMount() {
        reaction(
            () => this.knowledgeListStore.page,
            () => this.knowledgeListStore.fetchFeedList()
        );
        setTimeout(()=>{
            this.setState({
                swiper_1_height:231,
            })
        },100);
        setTimeout(()=>{
            this.setState({
                swiper_2_height:231,
            })
        },100);

    }

    componentWillMount() {
        this._getSysMsgs();
    }

    componentWillReact() {
        const { errorMsg } = this.knowledgeListStore
        errorMsg && this.toast.show(errorMsg)
    }

    _renderRow = feed => <KnowledgeItem onPress={this._onPressCell} feed={feed} />


    _onPressCell = feed => {
        this.props.navigator.push({
            component: SysMsgDetail,
            passProps: { feed }
        })
    }

    _onRefresh = () => {
        this.knowledgeListStore.isRefreshing = true
        this.knowledgeListStore.fetchFeedList();
    }

    _onEndReach = () => this.knowledgeListStore.page++

   async _getSysMsgs(){
        try {
            let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_SYS_MSGS_QUERIES +global.user.authentication_token+ `&query_type=` + Constant.sysMsgCatalog.PRIVATE + `&user_id=`+global.user.id+`&page=1`;
            // console.log("148:"+url)
            fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }).then(response => {
                console.log("156:"+JSON.stringify(response))
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
                        sys_msgs:sys_msgs,
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

    async _changeSysMsgStatus(newStatus,id,lately_chat_content){
        try {         
            let t = global.user.authentication_token;
            let url = 'http:\/\/' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SSRV_API_SYS_MSGS_TIMELINES +id +'?token='+ t;            
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
                    lately_chat_content:lately_chat_content
                })
            });
            let res = await response.text();
            if (response.status >= 200 && response.status < 300) {
                if(newStatus == Constant.sys_msgs_status.FINISHED){
                    let resObject =JSON.parse(res);
                    if(resObject.status==0){
                        this._createChat(resObject.id,lately_chat_content);
                        Alert.alert(
                            '提示',
                            '联系成功！您今天的沟通次数剩余'+resObject.avaliable+"次",
                            [
                                { text: '确定', onPress: () => this.props.navigator.pop() },
                            ]
                        )
                    }else if(resObject.status==-2){
                        Alert.alert(
                            '提示',
                            '您今天的沟通机会已用完，请明天再联系',
                            [
                                { text: '确定', onPress: () => this.props.navigator.pop() },
                            ]
                        )
                    }                    
                } 
                if(newStatus == Constant.sys_msgs_status.DISCARDED)
                  alert('已忽略，不再显示')
            } else {
                alert('出错了')
            }
        } catch (error) {
            alert(error)
        } 
    }
    async _createChat(_deal_id,chat_content){
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
    _updateCard(index, newStatus, id, lately_chat_content){
      let arr=d.state.sys_msgs;
      if((index == arr.length-1) && arr){
        arr.pop();
      } else if(arr){
        arr.copyWithin(index,index+1);
        arr.pop();
      } 
      d.setState({
          sys_msgs:arr,
          initCard:index
      })

      d._changeSysMsgStatus(newStatus,id,lately_chat_content);
    }
    render() {
        const { feedList, isRefreshing, isFetching } = this.knowledgeListStore
        const { navigator } = this.props;
        cardArray =this.state.sys_msgs;
        return (
            <View style={styles.listView}>
                <Header
                    title='Qiker'
                />
                <Text style={styles.text1}>您有重要更新</Text>

                {this.state.swiper_mutex?
                    <Swiper style={styles.wrapper} height={this.state.swiper_1_height} showsButtons={false} showsPagination={false}
                         onMomentumScrollEnd={(e, state, context) => {if(state.index==2){this.setState({swiper_mutex:false,swiper_2_height:230})}}}

                        >
                            <View style={[styles.cardWrapper,{backgroundColor:'#fff'}]}>
                                <Text style={styles.CardText}>欢迎您，{global.user.name}</Text>
                                <Text style={styles.CardText}>这是您的客户需求卡片组，可以向左或</Text>
                                <Text style={styles.CardText}>向右滑动，快试试看！</Text>
                                <Image style={[{alignSelf:'center'},{width:global.gScreen.width,height:140}]} source={require('../resource/card_l_guide_b.png')}/>
                            </View>
                            <View style={styles.cardWrapper}>
                                <Image style={[{alignSelf:'center'}]} source={require('../resource/card-l-guide-2.png')}/>
                            </View>
                            <View style={styles.cardWrapper}>
                                <Image style={[{alignSelf:'center'}]} source={require('../resource/card-l-guide-3.png')}/>
                            </View>
                    </Swiper>
                    :
                    cardArray?                            
                        <Swiper style={styles.wrapper} height={this.state.swiper_2_height} showsButtons={false}
                            showsPagination={false} index={this.state.initCard}
                        >
                            { cardArray?
                            cardArray.map((data, index) => <Card key={index} content={data} navigator={navigator} update={this._updateCard} index={index} width={global.gScreen.width}/>)
                            :<View></View>   
                            }
                        </Swiper>
                        :<View>
                            <Text>没有推送</Text>
                        </View>                      

                }

                    
                <View style={[styles.view,{marginTop:10}]}>
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

    _onPress = () => {
        const { feed, onPress } = this.props
        onPress && onPress(feed)
    }

    render() {
        const { feed: { action_title, action_desc,interval,user } } = this.props
        const cellData = { action_title, action_desc,interval,user }
        return <SysMsgSingleImageCell {...cellData} onPress={this._onPress} />
    }
}