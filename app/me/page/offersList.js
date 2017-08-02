import React, { PureComponent } from 'react'
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
} from 'react-native';
import {connect} from 'react-redux';
import { CachedImage } from "react-native-img-cache";
import { fetchOfferList } from '../../actions/MeOfferListActions';
import ServOfferDetail from '../../explore/ServOfferDetail';
import Common from '../../common/constants';
import Loading from '../../components/Loading';
import Util from '../../common/utils'
class OffersList extends PureComponent {
  constructor(props) {
    super(props);
    this._onMomentumScrollEnd = this._onMomentumScrollEnd.bind(this);
    this._onRefresh = this._onRefresh.bind(this);
  }

  componentDidMount() {
    if(!global.user.authentication_token){
      Util.noToken(this.props.navigator);
    }
    const { dispatch, userId } = this.props;
    dispatch(fetchOfferList(1, userId, this.props.navigator));
  }

  _onMomentumScrollEnd(event) {
    const {dispatch, MeOfferList, userId} = this.props;
    if ( !MeOfferList.canLoadMore || MeOfferList.isLoadMore ) return;

    const {contentOffset, layoutMeasurement, contentSize} = event.nativeEvent;
    let contentSizeH = contentSize.height;
    let viewBottomY = contentOffset.y + layoutMeasurement.height;

    if (Math.abs(viewBottomY - contentSizeH) <= 40) {
      dispatch(fetchOfferList(MeOfferList.page + 1, userId, this.props.navigator));
    }
  }

  _onRefresh() {
    if(!global.user.authentication_token){
      Util.noToken(this.props.navigator);
    }
    const { dispatch, userId } = this.props;
    dispatch(fetchOfferList(1, userId, this.props.navigator));
  }

  _onPressCell(feed) {
    this.props.navigator.push({
      component: ServOfferDetail,
      passProps: { feed},
    })
  }

  render() {
    const {MeOfferList} = this.props;
    return(
      <View style={styles.container}>
        {!MeOfferList.isLoading &&
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
              refreshing={MeOfferList.isLoading}
              onRefresh={this._onRefresh}
              colors={['rgb(217, 51, 58)']}
            />
          }
        >
          <View style={styles.contentContainer}>
            <View style={{ flex: 1 }}>
              {MeOfferList.meOfferList.map((offer, i) => {
                if (i%2 === 1) return;
                return (
                  <OfferItem
                    key={`${offer.id}-${i}`}
                    offer={offer}
                    onPress={() => this._onPressCell(offer)}
                    isBrowseMode ={this.props.isBrowseMode}
                  />
                );
              })}
            </View>
            <View style={{ flex: 1 }}>
              {MeOfferList.meOfferList.map((offer, i) => {
                if (i%2 === 0) return;
                return (
                  <OfferItem
                    key={`${offer.id}-${i}`}
                    offer={offer}
                    onPress={() => this._onPressCell(offer)}
                    isBrowseMode ={this.props.isBrowseMode}
                  />
                );
              })}
            </View>
          </View>
          {
            MeOfferList.isLoadMore ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator />
                <Text style={{fontSize: 14, marginLeft: 5}}>正在加载更多的数据...</Text>
              </View>
            ) : null
          }
        </ScrollView>
        }
        <Loading isShow={MeOfferList.isLoading}/>
      </View>
    );
  }
}

const OfferItem = ({
  offer,
  onPress,
  onCall,
  isBrowseMode
}) => {
  let width = (Common.window.width - 24) / 2;
  let imageH = 120;
  let offerUser = offer.user;
  let serv_image = offer.serv_images && offer.serv_images != 'undefined' ? {uri: offer.serv_images.split(',')[0]} : require('../../resource/qk_nav_default.png');
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={styles.cardContainer}
      onPress={onPress}
    >
      <CachedImage
        style={{ width: width, height: imageH, borderTopLeftRadius: 4, borderTopRightRadius: 4 }}
        defaultSource={require('../../resource/qk_nav_default.png')}
        source={serv_image}
      />
      <View style={{
        width: width,
        paddingHorizontal: 15,
        paddingVertical: 8,
      }}>
        <Text style={{ fontSize: 14, color: '#1b2833', marginBottom: 4 }} numberOfLines={2}>{offer.serv_title}</Text>
        <Text style={{ fontSize: 12, color: '#999999', marginBottom: 4 }}>{offer.catalog}</Text>
        <View style={{ flexDirection:'row' }}>
          <Image style={{ width: 12, height: 12 }} source={require('../../resource/g-location-s.png')}/>
          <Text style={{ fontSize: 12, color: '#b8b8b8' }}>{offer.district}</Text>
        </View>
      </View>
      <View style={styles.cardUserInfoView}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <CachedImage
            style={{height: 22, width: 22, borderRadius: 15}}
            source={{uri: offerUser.avatar}}
            defaultSource={require('../../resource/img_default_avatar.png')}
          />
          <Text
            style={{fontSize: 14, color: 'gray', marginLeft: 8, width: width * 0.4}}
            numberOfLines={1}
          >
            {offerUser.name}
          </Text>
        </View>
        {
          isBrowseMode?
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={onCall}
            >
              <Image style={{height: 18, width: 18}} source={require('../../resource/y-chat.png')}/>
            </TouchableOpacity>
            {/*<Image style={{height: 24, width: 24}} source={require('../../resource/ic_account_favour.png')}/>
            <Text style={{fontSize: 12, color: 'gray', marginLeft: 2}}>{offer.favorites_count ? offer.favorites_count : 0}</Text>*/}
          </View>
          :
          <View></View>
        }
        
      </View>
    </TouchableOpacity>
  );
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

export default connect((state) => {
    const {MeOfferList} = state;
    return {MeOfferList}
})(OffersList);
