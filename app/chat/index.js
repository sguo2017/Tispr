import React, {PureComponent} from 'react'
import {
    StyleSheet,
    View,
    Text,
    Image,
    ListView,
    TouchableOpacity,
    RefreshControl,
} from 'react-native'
import {observer} from 'mobx-react/native'
import {reaction} from 'mobx'
import Loading from '../components/Loading'
import LoadMoreFooter from '../components/LoadMoreFooter'
import ChatSingleImageCell from './ChatSingleImageCell'
import FeedDetail from './ChatDetail'
import Toast from 'react-native-easy-toast'
import FeedBaseStore from './ChatStore'
import Header from '../components/HomeNavigation';

const KNOWLEDGE_ID = 3

@observer
export default class ChatList extends PureComponent {
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

    knowledgeListStore = new FeedBaseStore(KNOWLEDGE_ID)

    componentDidMount() {
        reaction(
            () => this.knowledgeListStore.page,
            () => this.knowledgeListStore.fetchFeedList()
        )
    }

    componentWillReact() {
        const {errorMsg} = this.knowledgeListStore
        errorMsg && this.toast.show(errorMsg)
    }

    _renderRow = feed => <KnowledgeItem onPress={this._onPressCell} feed={feed}/>


    _onPressCell = feed => {
        this.props.navigator.push({
            component: FeedDetail,
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
        return (
            <View style={styles.listView}>
                <Header
                    title='Tispr'
                />

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
        //chats:[{"id":6,"deal_id":28,"serv_offer_id":76,"serv_offer_user_name":null,"serv_offer_titile":null,"lately_chat_content":"your offer is awesome","created_at":"2017-04-16T08:00:21.000Z","updated_at":"2017-04-17T07:00:44.000Z","offer_user_id":5,"request_user_id":4,"request_user":"p2t","offer_user":"Jim","serv":"p0 测试123456"}]
        const {feed: {serv_offer_user_name,serv_offer_titile,lately_chat_content,deal_id}} = this.props
        const cellData = {serv_offer_user_name,serv_offer_titile,lately_chat_content,deal_id}
        //return (<Text>1234</Text>)
        return <ChatSingleImageCell {...cellData} onPress={this._onPress}/>
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
    }
})
