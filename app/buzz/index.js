import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ListView,
    TouchableOpacity,
    RefreshControl,
    PanResponder
} from 'react-native';

import Swiper from 'react-native-swiper';

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
import ElasticStack from 'react-native-elastic-stack';
import Card from './Card'
import Wrapper from './Wrapper';
import Constant from '../common/constants';
const KNOWLEDGE_ID = 3
const itemWidth = global.gScreen.width - 20;
const itemHeight = 300;
const cardArray = [{},
{ user_name: 'zengkm', action_desc: 'aaa,我需要一个创造性艺术专业可以做类似的服务，我发现你很适合，希望了解更多' },
{ user_name: 'zhangsan', action_desc: 'bbb我需要一个创造性艺术专业可以做类似的服务，我发现你很适合，希望了解更多' },
{ user_name: 'lisi', action_desc: 'ccc我需要一个创造性艺术专业可以做类似的服务，我发现你很适合，希望了解更多' },
{ user_name: 'wangwu', action_desc: 'ddd我需要一个创造性艺术专业可以做类似的服务，我发现你很适合，希望了解更多' },
{ user_name: 'liuqi', action_desc: 'eee我需要一个创造性艺术专业可以做类似的服务，我发现你很适合，希望了解更多' }
];


var styles = StyleSheet.create({
    listView: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    wrapper: {
    },
    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB',
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5',
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9',
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    }
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
        initCard:0    
    }

    knowledgeListStore = new SysMsgStore(KNOWLEDGE_ID)

    componentDidMount() {
        reaction(
            () => this.knowledgeListStore.page,
            () => this.knowledgeListStore.fetchFeedList()
        )
    }

    componentWillMount() {
        this._getSysMsgs();
        this._panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: (e, gestureState) => {
                if (
                    Platform.OS == 'android'
                    && (gestureState.dx < 2 && gestureState.dx > -2)
                    && (gestureState.dy < 2 && gestureState.dy > -2)
                ) {
                    return false;
                }

                return true;
            }
        })
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
        this.knowledgeListStore.fetchFeedList()
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
                    this.setState({sys_msgs:sys_msgs})
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
                alert('已通知对方');
            } else {
                alert('出错了')
            }
        } catch (error) {
            alert(error)
        } 
    }
    
    _updateCard(index, newStatus, id, lately_chat_content){
      let arr=d.state.sys_msgs;
      if(index == arr.length-1){
        arr.pop()
      } else{
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
        const { navigator } = this.props
        if(this.state.sys_msgs)
        {
            cardArray=this.state.sys_msgs;
            if(cardArray[0]!=='0')
                cardArray.unshift('0');
        }
        return (
            <View style={styles.listView}>
                <Header
                    title='Qiker'
                />
                <Text style={{ alignSelf: 'center', margin: 8 }}>您有重要更新!</Text>
                <Swiper style={styles.wrapper} height={230} showsButtons={false}
                    showsPagination={false} index={this.state.initCard}
                >
                    {
                       cardArray.map((data, index) => <Card content={data} navigator={navigator} update={this._updateCard} index={index}/>)
                    }       
                </Swiper>
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
        const { feed: { action_title, action_desc, user } } = this.props
        const cellData = { action_title, action_desc, user }
        return <SysMsgSingleImageCell {...cellData} onPress={this._onPress} />
    }
}