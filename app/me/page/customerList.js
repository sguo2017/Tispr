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
import { fetchCustomerList } from '../../actions/MeCustomerListActions';
import Loading from '../../components/Loading';
import util from '../../common/utils'
import Constant from '../../common/constants'
import recommend from '../../friend/recommendUser'
class CustomersList extends PureComponent {

    constructor(props) {
        super(props);
        this._onMomentumScrollEnd = this._onMomentumScrollEnd.bind(this);
        this._onRefresh = this._onRefresh.bind(this);
        this.state = {

        }
    }

    componentDidMount() {
        const { dispatch } = this.props;
        if(!global.user.authentication_token){
            Util.noToken(this.props.navigator);
        }
        dispatch(fetchCustomerList(1, this.props.navigator));
    }
    _onMomentumScrollEnd(event) {
        const { dispatch, MeCustomerList } = this.props;
        // if (!MeCustomerList.canLoadMore || MeCustomerList.isLoadMore) return;

        const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
        let contentSizeH = contentSize.height;
        let viewBottomY = contentOffset.y + layoutMeasurement.height;

        if (Math.abs(viewBottomY - contentSizeH) <= 40) {
            dispatch(fetchCustomerList(MeCustomerList.page + 1, this.props.navigator));
        }
    }
    _onRefresh() {
        if (!global.user.authentication_token) {
            Util.noToken(this.props.navigator);
        }
        const { dispatch } = this.props;
        dispatch(fetchCustomerList(1, this.props.navigator));
    }
    recommendUser(){
        this.props.navigator.push({component: recommend,passProps:{recommendCustomer:true}})
    }
    openSms(friend_num){
        let message = "我刚刚在【为邻】上推荐了你，你可以免费注册，并完善你的资料，这样我的朋友们可以通过为邻订购你的服务"
        Linking.canOpenURL(`sms:${friend_num}`).then(supported => {
        if (!supported) {
            Alert.alert(
            '提示',
            '无法打开短信',
            [
                { text: '确定', onPress: null },
            ]
            )
        } else {
            Linking.openURL((`sms:${friend_num}?body=${message}`) )
        }
        }).catch(err => {
            Alert.alert(
                null,
                '出错了',
                [
                { text: '确定', onPress: null },
                ]
            );
        });
    }
    render() {
        const { MeCustomerList } = this.props;
        let profriends = this.state.profriends;
        return (
            <View style={styles.container}>
                {!MeCustomerList.isLoading &&
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
                                refreshing={MeCustomerList.isLoading}
                                onRefresh={this._onRefresh}
                                colors={['rgb(217, 51, 58)']}
                            />
                        }
                    >
                        <View style={styles.contentContainer}>
                            <View style={{ flex: 1 }}>
                                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                    <Text style={{color: '#000',fontSize:16}}>我的客户</Text>
                                    <Text style={{color: global.gColors.themeColor,fontSize:16}} onPress={this.recommendUser.bind(this)}>
                                    添加客户
                                    </Text>
                                </View>
                                {MeCustomerList.customerList.map((data, index) => {
                                    return (
                                        <View key={index}>
                                            <View style={styles.line}></View>
                                            <View  style={{flexDirection:'row',justifyContent:'space-between',alignItems: 'center',padding:6, paddingHorizontal: 12,backgroundColor:'#fff'}}>
                                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                                    <Image source={{uri: data.avatar}} style={{width:50, height:50, borderRadius:25}}/>
                                                    <View>
                                                        <Text style={{color:'#000',marginLeft:10,fontSize:16}}>{data.friend_name}</Text>
                                                        {
                                                            data.status == "unregistered"?
                                                            <Text style={{marginLeft:10}}>还未加入奇客</Text>
                                                            :null
                                                        }
                                                    </View>
                                                </View>
                                                {
                                                    data.status == "unregistered"?
                                                    <TouchableOpacity
                                                    onPress={this.openSms.bind(this, data.friend_num)}
                                                    style={{backgroundColor:global.gColors.buttonColor,padding:8,borderRadius:8,width:80,alignItems:'center'}}>
                                                        <Text style={{color:'#fff',fontSize:16}}
                                                        >邀请</Text>
                                                    </TouchableOpacity>
                                                    :null
                                                }
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                        {
                            MeCustomerList.isLoadMore ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator />
                                    <Text style={{ fontSize: 14, marginLeft: 5 }}>正在加载更多的数据...</Text>
                                </View>
                            ) : null
                        }
                    </ScrollView>
                }
                <Loading isShow={MeCustomerList.isLoading} />
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
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#eee',
    },
})


export default connect((state) => {
    const {MeCustomerList} = state;
    return {MeCustomerList}
})(CustomersList);