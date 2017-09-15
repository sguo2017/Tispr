import React, { PureComponent } from 'react';
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
import { fetchFriendList } from '../actions/UserListActions';
import Loading from '../components/Loading';
import Util from '../common/utils';
import Constant from '../common/constants';
import Me from '../me/index';
class FriendList extends PureComponent {

    constructor(props) {
        super(props);
        this._onMomentumScrollEnd = this._onMomentumScrollEnd.bind(this);
        this._onRefresh = this._onRefresh.bind(this);
    }
    componentDidMount() {
        const { dispatch } = this.props;
        if(!global.user.authentication_token){
            Util.noToken(this.props.navigator);
        }
        let exploreparams = this.props.exploreparams;

        dispatch(fetchFriendList(1, exploreparams, this.props.navigator));
    }

    _onMomentumScrollEnd(event) {
        const { dispatch, UserList } = this.props;
        if (!UserList.canLoadMore || UserList.isLoadMore) return;

        const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
        let contentSizeH = contentSize.height;
        let viewBottomY = contentOffset.y + layoutMeasurement.height;

        if (Math.abs(viewBottomY - contentSizeH) <= 40) {
            dispatch(fetchFriendList(UserList.page + 1, this.props.exploreparams, this.props.navigator));
        }
    }

    _onRefresh() {
        if (!global.user.authentication_token) {
            Util.noToken(this.props.navigator);
        }
        const { dispatch } = this.props;
        dispatch(fetchFriendList(1, this.props.exploreparams, this.props.navigator));
    }
    jumpUserDetail(user_id){
        this.props.navigator.push({
            component: Me,
            passProps: {
                isBrowseMode: true,
                close: () => {
                    this.props.navigator.pop();
                },
                id: user_id
            }
        })
    }

    render() {
        const { UserList } = this.props;
        return (
            <View style={styles.container}>
                {!UserList.isLoading &&
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
                                refreshing={UserList.isLoading}
                                onRefresh={this._onRefresh}
                                colors={['rgb(217, 51, 58)']}
                            />
                        }
                    >
                        <View style={styles.contentContainer}>
                            <View style={{ flex: 1 }}>
                                {UserList.userList.map((data, index) => {
                                    return (
                                        <TouchableOpacity key={index} onPress={this.jumpUserDetail.bind(this, data.id)} style={{flexDirection:'row',alignItems: 'center',margin:6, paddingHorizontal: 12}}>
                                            <Image source={{uri: data.avatar}} style={{width:50, height:50, borderRadius:25}}/>
                                            <View>
                                                <Text style={{color:'#000',marginLeft:10,fontSize:16}}>{data.name}</Text>
                                                {
                                                    data.comments_count == 0 ?null:
                                                    <Text style={{marginLeft:10}}>推荐了{data.comments_count}个专业人士</Text>
                                                }
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                        {
                            UserList.isLoadMore ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator />
                                    <Text style={{ fontSize: 14, marginLeft: 5 }}>正在加载更多的数据...</Text>
                                </View>
                            ) : null
                        }
                    </ScrollView>
                }
                <Loading isShow={UserList.isLoading} />
            </View>
        );
    }
}
export default connect((state) => {
    const { UserList } = state;
    return { UserList }
})(FriendList);

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
    backgroundColor: '#eee'
  },
});
