import React, {PureComponent} from 'react'
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    Platform,
    RefreshControl,
    Linking,
    Alert,
    ActivityIndicator
} from 'react-native';

import { connect } from 'react-redux';
import { fetchFriendList } from '../../actions/MeFriendListActions';
import Loading from '../../components/Loading';
import util from '../../common/utils'
import Constant from '../../common/constants'
import recommend from '../../friend/recommendUser'
class FriendsList extends PureComponent {

    constructor(props) {
        super(props);
        this._onMomentumScrollEnd = this._onMomentumScrollEnd.bind(this);
        this._onRefresh = this._onRefresh.bind(this);
        this.state = {
            profriends: []
        }
    }
    componentWillMount() {
        try {
            let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_FRIENDS_LIST+ '?user_id='+global.user.id+ '&qry_type=2&token='+global.user.authentication_token;
            util.get(url, (result) => {
                this.setState({profriends: JSON.parse(result.feeds)});
            },(error) => {

            })
        } catch(error) {
            console.log(error);
        }
    }
    componentDidMount() {
        const { dispatch } = this.props;
        if(!global.user.authentication_token){
            Util.noToken(this.props.navigator);
        }
        dispatch(fetchFriendList(1, this.props.navigator));
    }
    _onMomentumScrollEnd(event) {
        const { dispatch, MeFriendList } = this.props;
        // if (!MeFriendList.canLoadMore || MeFriendList.isLoadMore) return;

        const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
        let contentSizeH = contentSize.height;
        let viewBottomY = contentOffset.y + layoutMeasurement.height;

        if (Math.abs(viewBottomY - contentSizeH) <= 40) {
            dispatch(fetchFriendList(MeFriendList.page + 1, this.props.navigator));
        }
    }
    _onRefresh() {
        if (!global.user.authentication_token) {
            Util.noToken(this.props.navigator);
        }
        const { dispatch } = this.props;
        dispatch(fetchFriendList(1, this.props.navigator));
    }
    recommendUser(){
        this.props.navigator.push({component: recommend})
    }
    agreeApply(id) {
        let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_AGREE_FRIENDS + '/' + id + `?token=${global.user.authentication_token}`
        let data = {
            status: 'created',
        }
        util.patch(url, data, (response) => {
            if (response.status == 0) {
                ToastAndroid.show('你和他成为了好友', ToastAndroid.LONG);
            }
        }, this.props.navigator)
    }

    render() {
        const { MeFriendList } = this.props;
        let profriends = this.state.profriends;
        return (
            <View style={styles.container}>
                {!MeFriendList.isLoading &&
                    <ScrollView
                        ref={scrollView => this.scrollView = scrollView}
                        style={{ flex: 1 }}
                        automaticallyAdjustContentInsets={false}
                        removeClippedSubviews={true}
                        scrollEventThrottle={16}
                        onMomentumScrollEnd={this._onMomentumScrollEnd}
                        bounces={true}
                        refreshControl={
                            <RefreshControl
                                refreshing={MeFriendList.isLoading}
                                onRefresh={this._onRefresh}
                                colors={['rgb(217, 51, 58)']}
                            />
                        }
                    >
                        <View style={styles.contentContainer}>
                            <View style={{ flex: 1 }}>
                                {
                                    profriends[0]?
                                    <View style={{ justifyContent: 'flex-start'}}>
                                        <Text style={{color: 'black',fontSize:16}}>待验证</Text>
                                        { 
                                            profriends.map((item, index) => {
                                                return(
                                                    <View style={styles.list} key={item.id}>
                                                        <View style={styles.list}>
                                                            <Image source ={{uri:item.avatar}} style={{width:50,height:50,borderRadius:25}}/>
                                                            <Text style={{color: 'black', marginLeft:20}}>{item.friend_name}</Text>
                                                        </View>
                                                        <TouchableOpacity onPress={this.agreeApply.bind(this, item.id)}>
                                                            <Text style={{color:global.gColors.themeColor}}>通过验证</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                )
                                            })
                                        } 
                                        <TouchableOpacity>
                                            <Text style={{color: '#4a90e2',fontSize:16}}>查看全部</Text>
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    null
                                }
                                
                                <Text style={{color: '#000',fontSize:16}}>我的好友</Text>
                                {MeFriendList.friendList.map((data, index) => {
                                    return (
                                        <TouchableOpacity key={index} style={{flexDirection:'row',alignItems: 'center',margin:6, paddingHorizontal: 12}}>
                                            <Image source={{uri: data.avatar}} style={{width:50, height:50, borderRadius:25}}/>
                                            <Text style={{color:'#000',margin:10,fontSize:16}}>{data.friend_name}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                        {
                            MeFriendList.isLoadMore ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator />
                                    <Text style={{ fontSize: 14, marginLeft: 5 }}>正在加载更多的数据...</Text>
                                </View>
                            ) : null
                        }
                    </ScrollView>
                }
                <Loading isShow={MeFriendList.isLoading} />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    contentContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        overflow: 'hidden',
        padding: 4,
    },
    loadingContainer: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
})


export default connect((state) => {
    const {MeFriendList} = state;
    return {MeFriendList}
})(FriendsList);