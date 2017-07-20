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
import SysMsgSingleImageCell from './SysMsgSingleImageCell'
import Toast from 'react-native-easy-toast'
import SysMsgStore from './SysMsgStore'
import Util from '../common/utils'
const KNOWLEDGE_ID = 3
const itemWidth =global.gScreen.width-20;
const itemHeight =300;

@observer
export default class BussList extends PureComponent {
    // _pictureAction = () => {
    //     const {user: {name}} = RootStore
    //     if (name) {
    //         alert(name)
    //     } else {
    //         this.props.navigator.push({
    //             component: Login,
    //             sceneConfig: Navigator.SceneConfigs.FloatFromBottom
    //         })
    //     }
    // }

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

    componentWillReact() {
        const {errorMsg} = this.knowledgeListStore
        errorMsg && this.toast.show(errorMsg)
    }

    _renderRow = feed => <KnowledgeItem feed={feed}/> 

    _onRefresh = () => {
        if(!global.user.authentication_token){
            Util.noToken(this.props.navigator);
        }
        this.knowledgeListStore.isRefreshing = true
        this.knowledgeListStore.fetchFeedList()
    }

    _onEndReach = () => this.knowledgeListStore.page ++

    _renderFooter = () => <LoadMoreFooter/>
    render() {
        const {feedList, isRefreshing, isFetching, isLoadMore} = this.knowledgeListStore
        const {navigator} = this.props;
        return (
            <View style={styles.listView}>
                {!isFetching &&
                <ListView
                    dataSource={this.state.dataSource.cloneWithRows(feedList.slice(0))}
                    renderRow={this._renderRow}
                    renderFooter={() => {
                        if (isLoadMore) {
                            return this._renderFooter();
                        } else {
                            return null;
                        }
                    }}
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

    render() {
        const { feed: { action_title, action_desc,interval,user_name } } = this.props
        const cellData = { action_title, action_desc,interval,user_name }
        return <SysMsgSingleImageCell {...cellData}/>
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
