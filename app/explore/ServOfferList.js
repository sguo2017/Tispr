/**
 * Created by ljunb on 2016/11/19.
 * 逛吃-首页
 */
import React, {Component} from 'react';
import {observer} from 'mobx-react/native'
import {
    StyleSheet,
    View,
    Text,
    Image,
    InteractionManager,
    TouchableOpacity,
    ScrollView,
    Platform,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import {
    fetchFeedList
} from './ServOfferListActions';
import Common from '../common/constants';
import Loading from '../components/Loading';
import ServOfferDetail from './ServOfferDetail';

let canLoadMore = false;
let page = 1;

export default class ServOfferList extends Component {

    constructor(props) {
        super(props);
        this._onMomentumScrollEnd = this._onMomentumScrollEnd.bind(this);
        this._onRefresh = this._onRefresh.bind(this);
    }

    componentDidMount() {
        const {dispatch, categoryId} = this.props;
        dispatch(fetchFeedList(categoryId, page));
    }

    _onMomentumScrollEnd(event) {
        const {dispatch, categoryId} = this.props;
        const {contentOffset, layoutMeasurement, contentSize} = event.nativeEvent;

        let contentSizeH = contentSize.height;
        let viewBottomY = contentOffset.y + layoutMeasurement.height;

        canLoadMore = viewBottomY >= contentSizeH;

        if (Math.abs(viewBottomY - contentSizeH) <= 40 && canLoadMore) {
            page++;
            dispatch(fetchFeedList(categoryId, page));
            canLoadMore = false;
        }
    }

    _onRefresh() {
        const {dispatch, categoryId} = this.props;
        page = 1;
        canLoadMore = false;
        //console.log('this.state.exploreparams:'+this.state.exploreparams);
        let exploreparams = this.props.exploreparams;
        let goods_catalog = this.props.cps;
        if(goods_catalog[0]){
            goods_catalog.map((item,index,input)=>{input[index]=true});
        }
        goods_catalog.splice(0,1);
        let goods_catalog_paramas = [];
        goods_catalog.map((item,index,input)=>{
            if(item){
                goods_catalog_paramas.push(index+1);
            }
        });
        exploreparams.goods_catalog_I = goods_catalog_paramas.length === 0 ? undefined : goods_catalog_paramas;
        dispatch(fetchFeedList(categoryId, page, exploreparams));
    }

    _onPressCell(feed) {
        this.props.navigator.push({
            component: ServOfferDetail,
            passProps: {feed}
        })
    }

    render() {
        const {feedHome} = this.props;

        let scrollViewH = Common.window.height - (Platform.OS === 'ios' ? 64 : 50) - 44 - 49;

        return (
            <View style={{backgroundColor: '#f5f5f5', flex: 1}}>
                {console.log("79:"+JSON.stringify(feedHome.feedList))}
                {!feedHome.isLoading &&
                <ScrollView
                    ref={scrollView => this.scrollView = scrollView}
                    style={{width: Common.window.width, height: scrollViewH}}
                    automaticallyAdjustContentInsets={false}
                    removeClippedSubviews={true}
                    scrollEventThrottle={16}
                    onMomentumScrollEnd={this._onMomentumScrollEnd}
                    bounces={true}
                    refreshControl={
                        <RefreshControl
                            refreshing={feedHome.isLoading}
                            onRefresh={this._onRefresh}
                            colors={['rgb(217, 51, 58)']}
                        />
                    }
                >
                    <View style={[styles.contentContainer, {height: feedHome.maxHeight + 40}]}>
                        {feedHome.feedList.map((feed, i) => {
                            console.log("98:"+JSON.stringify(feed))
                            return (
                                <HomeItem
                                    key={`${feed.id}-${i}`}
                                    feed={feed}
                                    data={feedHome.cachedArray[i]}
                                    onPress={() => this._onPressCell(feed)}
                                />
                            )
                        })}
                        <View style={[styles.loadingContainer, {top: feedHome.maxHeight+50}]}>
                            <ActivityIndicator />
                            <Text style={{fontSize: 14, marginLeft: 5}}>正在加载更多的数据...</Text>
                        </View>
                    </View>
                </ScrollView>
                }
                {console.log("116")}
                <Loading isShow={feedHome.isLoading}/>
            </View>
        )
    }
}

const HomeItem = ({
    feed,
    data,
    onPress
}) => {
   
    let screenW = Common.window.width;
    let width = (screenW - 15 * 2 - 10) / 2;
    let imageH = 100;//feed.content_type != 5 ? width + 50 : width;
    let offerUser = feed.user;
    // 返回的数据中，头像出现null的情况，所以source仍然做个判断
    let publisherAvatar = require('../resource/img_default_avatar.png');//feed.publisher_avatar ? {uri: feed.publisher_avatar} : require('../resource/img_default_avatar.png');
    let serv_image = feed.serv_images?{uri:feed.serv_images}:require('../resource/qk_nav_default.png')
    console.log("135")
    return (
        <TouchableOpacity
            activeOpacity={0.75}
            style={{
                height: data.height*1.2,
                width: (Common.window.width - 40) / 2,
                backgroundColor: '#fff',
                left: data.left,
                top: data.top,
                position: 'absolute',
                flex: 1,
                marginBottom:20
            }}
            onPress={onPress}
        >
            <Image
                style={{width: width, height: imageH}}
                source={serv_image}
            />
             <View style={{
                height: data.titleHeight*3,
                width: width,
                paddingHorizontal: 4,
                paddingTop: 4,
                marginBottom: 4,
                //backgroundColor:'blue'
            }}>
                <View style={{
                    height: data.titleHeight*3- 8,
                    width: width - 8,
                    justifyContent: 'space-around',
                }}>
                    <Text style={{fontSize: 16, color: 'black'}} numberOfLines={2}>{feed.serv_title}</Text>
                    <Text>创意艺术</Text>
                    <View style={{flexDirection:'row'}}>
                        <Image source={require('../resource/g-location-s.png')}/>
                        <Text style={{fontSize: 12, color: '#B8B8B8'}}>距离100km</Text>
                    </View>
                </View>
            </View>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                height: 60,
                paddingHorizontal: 4,
                borderBottomWidth: Common.window.onePR,
                borderColor: '#ccc',
            }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                        style={{height: 20, width: 20, borderRadius: 15}}
                        source={{uri:offerUser.avatar}}
                        defaultSource={require('../resource/img_default_avatar.png')}
                    />
                    <Text
                        style={{fontSize: 14, color: 'gray', marginLeft: 8, width: width * 0.4}}
                        numberOfLines={1}
                    >
                        {offerUser.name}
                    </Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image style={{height: 20, width: 20}} source={require('../resource/y-chat.png')}/>
                    <Text style={{fontSize: 12, color: 'gray', marginLeft: 2}}>{feed.user_id}</Text>
                </View>
            </View>
            
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    contentContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        overflow: 'hidden'
    },
    loadingContainer: {
        height: 40,
        position: 'absolute',
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    }
})