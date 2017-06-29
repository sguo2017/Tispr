import React, {Component} from 'react';
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
  RefreshControl,
  Linking,
  Alert,
} from 'react-native';
import { CachedImage } from "react-native-img-cache";
import { fetchExploreList } from '../actions/ServOfferListActions';
import Common from '../common/constants';
import Loading from '../components/Loading';
import ServOfferDetail from './ServOfferDetail';

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
  cardContainer: {
    width: (Common.window.width - 24) / 2,
    margin: 4,
    backgroundColor: '#fff',
    borderRadius: 4,
    overflow: 'hidden',
  },
  cardUserInfoView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderTopWidth: 0.5,
    borderColor: '#eeeeee',
  },
});

export default class ServOfferList extends Component {
  constructor(props) {
      super(props);
      this._onMomentumScrollEnd = this._onMomentumScrollEnd.bind(this);
      this._onRefresh = this._onRefresh.bind(this);
  }

  componentDidMount() {
      const { dispatch } = this.props;
      dispatch(fetchExploreList(1));
  }

  _onMomentumScrollEnd(event) {
    const {dispatch, ServOfferList} = this.props;
    if ( !ServOfferList.canLoadMore || ServOfferList.isLoadMore ) return;

    const {contentOffset, layoutMeasurement, contentSize} = event.nativeEvent;
    let contentSizeH = contentSize.height;
    let viewBottomY = contentOffset.y + layoutMeasurement.height;

    if (Math.abs(viewBottomY - contentSizeH) <= 40) {
      dispatch(fetchExploreList(ServOfferList.page + 1));
    }
  }

  _onRefresh() {
    const { dispatch } = this.props;
    //console.log('this.state.exploreparams:'+this.state.exploreparams);
    let exploreparams = this.props.exploreparams;
    let goods_catalog = this.props.cps;
    let district = this.props.lps;
    if(district[0])
        exploreparams.district = "番禺区"
    if(district[1])
        exploreparams.district = "海珠区"
    if(goods_catalog[0]){
        goods_catalog.map((item,index,input)=>{input[index]=true});
    }
    let goods_catalog_paramas = [];
    goods_catalog.map((item,index,input)=>{
        if (item&&index>0) {
            goods_catalog_paramas=goods_catalog_paramas.concat(global.goods_catalogs_II_id[index-1]);
        }
    });
    exploreparams.goods_catalog_I = goods_catalog_paramas.length === 0 ? undefined : goods_catalog_paramas;
    dispatch(fetchExploreList(1, exploreparams));
  }

  _onPressCell(feed) {
    this.props.navigator.push({
        component: ServOfferDetail,
        passProps: {feed}
    });
  }

  clickCall = (phoneNum, username) => {
    Linking.canOpenURL(`tel:${phoneNum}`).then(supported => {
      if (!supported) {
        Alert.alert(
          '提示',
          '该设备暂不支持拨打功能',
          [
            { text: '确定', onPress: null },
          ]
        )
      } else {
        Alert.alert(
          null,
          `是否呼叫${username}`,
          [
            { text: '否', onPress: null },
            { text: '是', onPress: () => {Linking.openURL(`tel:${phoneNum}`)} },
          ]
        )
      }
    }).catch(err => {
      Alert.alert(
        null,
        '拨打出错,请重试',
        [
          { text: '确定', onPress: null },
        ]
      );
    });
  }

  render() {
    const { ServOfferList } = this.props;
    return(
      <View style={styles.container}>
        {!ServOfferList.isLoading &&
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
              refreshing={ServOfferList.isLoading}
              onRefresh={this._onRefresh}
              colors={['rgb(217, 51, 58)']}
            />
          }
        >
          <View style={styles.contentContainer}>
            {ServOfferList.exploreList.map((serv, i) => {
              return (
                <ServItem
                  key={`${serv.id}-${i}`}
                  serv={serv}
                  onPress={() => this._onPressCell(serv)}
                  onCall={() => this.clickCall('10000', serv.user.name)}
                />
              );
            })}
          </View>
          {
            ServOfferList.isLoadMore ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator />
                <Text style={{fontSize: 14, marginLeft: 5}}>正在加载更多的数据...</Text>
              </View>
            ) : null
          }
        </ScrollView>
        }
        <Loading isShow={ServOfferList.isLoading}/>
      </View>
    );
  }
}

const ServItem = ({
  serv,
  onPress,
  onCall,
}) => {
  let width = (Common.window.width - 24) / 2;
  let imageH = 120;
  let servUser = serv.user;
  let serv_image = serv.serv_images && serv.serv_images != 'undefined' ? {uri: serv.serv_images.split(',')[0]} : require('../resource/qk_nav_default.png');
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={styles.cardContainer}
      onPress={onPress}
    >
      <CachedImage
        style={{ width: width, height: imageH }}
        defaultSource={require('../resource/qk_nav_default.png')}
        source={serv_image}
      />
      <View style={{
        width: width,
        paddingHorizontal: 15,
        paddingVertical: 8,
      }}>
        <Text style={{ fontSize: 14, color: '#1b2833', marginBottom: 4 }} numberOfLines={2}>{serv.serv_title}</Text>
        <Text style={{ fontSize: 12, color: '#999999', marginBottom: 4 }}>{serv.catalog}</Text>
        <View style={{ flexDirection:'row' }}>
          <Image style={{ width: 12, height: 12 }} source={require('../resource/g-location-s.png')}/>
          <Text style={{ fontSize: 12, color: '#b8b8b8' }}>{serv.district}</Text>
        </View>
      </View>
      <View style={styles.cardUserInfoView}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <CachedImage
            style={{height: 22, width: 22, borderRadius: 15}}
            source={{uri: servUser.avatar}}
            defaultSource={require('../resource/img_default_avatar.png')}
          />
          <Text
            style={{fontSize: 14, color: 'gray', marginLeft: 8, width: width * 0.4}}
            numberOfLines={1}
          >
            {servUser.name}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={onCall}
        >
          <Image style={{height: 18, width: 18}} source={require('../resource/y-chat.png')}/>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
};
