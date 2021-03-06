import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Image,
    ListView,
    TouchableOpacity,
    RefreshControl,
} from 'react-native'
import { observer } from 'mobx-react/native'
import { reaction } from 'mobx'
import Loading from '../../components/Loading'
import LoadMoreFooter from '../../components/LoadMoreFooter'
import RequestMsgSingleImageCell from '../request/RequestMsgSingleImageCell'
import RequestMsgDetail from '../request/RequestMsgDetail'
import RequestMsgStore from '../request/RequestMsgStore'
import Toast from 'react-native-easy-toast'
import Util from '../../common/utils'
import Constant from '../../common/constants'

const KNOWLEDGE_ID = 3

@observer
export default class RequestsList extends Component {
    state = {
        dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        }),
    };

    knowledgeListStore = new RequestMsgStore(KNOWLEDGE_ID, this.props.userId, this.props.archived);

    componentDidMount() {
        if (!global.user.authentication_token) {
            Util.noToken(this.props.navigator);
        }
        reaction(
            () => this.knowledgeListStore.page,
            () => this.knowledgeListStore.fetchFeedList()
        )
    }

    componentWillReact() {
        const { errorMsg } = this.knowledgeListStore;
        errorMsg && this.toast.show(errorMsg);
    }

    _renderRow = feed => <KnowledgeItem onPress={this._onPressCell} refreshList={this._onRefresh} feed={feed} archivedNotShow={this.props.archivedNotShow}/>


    _onPressCell = feed => {
        this.props.navigator.push({
            component: RequestMsgDetail,
            passProps: { feed }
        })
    }

    _onRefresh = () => {
        if (!global.user.authentication_token) {
            Util.noToken(this.props.navigator);
        }
        this.knowledgeListStore.isRefreshing = true;
        this.knowledgeListStore.fetchFeedList();
    }

    _onEndReach = () => this.knowledgeListStore.page++;

    _renderFooter = () => {
        const { isLoadMore } = this.knowledgeListStore;
        if (isLoadMore == true) {
            return <LoadMoreFooter />
        } else {
            return null
        }
    }

    render() {
        const { feedList, isRefreshing, isFetching } = this.knowledgeListStore;
        return (
            <View style={styles.listView}>
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
                <Loading isShow={isFetching} />
                <Toast ref={toast => this.toast = toast} />
            </View>
        );
    }

}
class KnowledgeItem extends Component {

    static propTypes = {
        feed: React.PropTypes.object,
        onPress: React.PropTypes.func
    };

    _onPress = () => {
        const { feed, onPress } = this.props;
        onPress && onPress(feed)
    };

    _onRefresh(){
        const { refreshList } = this.props;
        console.log("刷新")
        refreshList && refreshList()
    }
    _archivedPress = () => {
        const { feed, archived } = this.props;
        console.log(feed.serv_detail)
        let t = global.user.authentication_token;
        let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_SERV_OFFER_COLLECT + t;
        let data ={
            favorite: {
                obj_id: this.props.feed.id,
                obj_type: 'serv_request',
                user_id: global.user.id,
            }
        };
        Util.post(url, data, ()=>{this._onRefresh()}, this.props.navigator);
    }
    render() {
        const { feed: { serv_detail, created_at, catalog }, archivedNotShow} = this.props;
        const cellData = { serv_detail, created_at, catalog, archivedNotShow};
        return <RequestMsgSingleImageCell {...cellData} onPress={this._onPress} archivedPress={this._archivedPress}/>
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
});
