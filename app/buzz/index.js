import React, {PureComponent} from 'react'
import {
    StyleSheet,
    View,
    Text,
    Image,
    ListView,
    TouchableOpacity,
    RefreshControl,
    PanResponder
} from 'react-native'
import {observer} from 'mobx-react/native'
import {reaction} from 'mobx'
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
import StackCard from 'stack-card-z';
import Carousel from "react-native-carousel-control";
const KNOWLEDGE_ID = 3
const itemWidth =global.gScreen.width-20;
const itemHeight =300;
const cardArray =[{},
    {user_name:'zengkm',action_desc:'aaa,我需要一个创造性艺术专业可以做类似的服务，我发现你很适合，希望了解更多'},
    {user_name:'zhangsan',action_desc:'bbb我需要一个创造性艺术专业可以做类似的服务，我发现你很适合，希望了解更多'},
    {user_name:'lisi',action_desc:'ccc我需要一个创造性艺术专业可以做类似的服务，我发现你很适合，希望了解更多'},
    {user_name:'wangwu',action_desc:'ddd我需要一个创造性艺术专业可以做类似的服务，我发现你很适合，希望了解更多'},
    {user_name:'liuqi',action_desc:'eee我需要一个创造性艺术专业可以做类似的服务，我发现你很适合，希望了解更多'}
];
@observer
export default class BussList extends PureComponent {
    
    _pictureAction = () => {
        const {user: {name}} = RootStore
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
        })
    }

    knowledgeListStore = new SysMsgStore(KNOWLEDGE_ID)

    componentDidMount() {
        reaction(
            () => this.knowledgeListStore.page,
            () => this.knowledgeListStore.fetchFeedList()
        )
    }
    componentWillMount(){
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
        const {errorMsg} = this.knowledgeListStore
        errorMsg && this.toast.show(errorMsg)
    }

    _renderRow = feed => <KnowledgeItem onPress={this._onPressCell} feed={feed}/>


    _onPressCell = feed => {
        this.props.navigator.push({
            component: SysMsgDetail,
            passProps: {feed}
        })
    }   

    _onRefresh = () => {
        this.knowledgeListStore.isRefreshing = true
        this.knowledgeListStore.fetchFeedList()
    }

    _onEndReach = () => this.knowledgeListStore.page ++

    _renderFooter = () => <LoadMoreFooter/>
    render() {
        const {feedList, isRefreshing, isFetching} = this.knowledgeListStore
        const {navigator} = this.props;
        return (
            <View style={styles.listView}>
                <Header
                    title='Qiker'
                />
                
                <Carousel>
                    {
                        cardArray.map((data,index) => <Card content={data} navigator={navigator}/>)
                    }
                </Carousel>
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
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={this._onRefresh}
                            colors={['rgb(217, 51, 58)']}
                        />
                    }


                />

                }
                <Loading isShow={isFetching}/>
                <Toast ref={toast => this.toast = toast}/>
            </View>
        )
    }
}

class KnowledgeItem extends PureComponent {

    static propTypes = {
        feed: React.PropTypes.object,
        onPress: React.PropTypes.func
    }

    _onPress = () => {
        const {feed, onPress} = this.props
        onPress && onPress(feed)
    }

    render() {
        const {feed: {action_title,action_desc,user}} = this.props
        const cellData = {action_title,action_desc,user}
        return <SysMsgSingleImageCell {...cellData} onPress={this._onPress}/>
    }
}

const styles = StyleSheet.create({
    listView: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    loadingContainer: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    }})
