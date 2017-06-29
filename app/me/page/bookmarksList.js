import React, {PureComponent} from 'react'
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
import {connect} from 'react-redux';
import { CachedImage } from "react-native-img-cache";
import { fetchMarkList } from '../../actions/MeMarkListActions';
import Common from '../../common/constants';
import Loading from '../../components/Loading';
import ServOfferDetail from '../../explore/ServOfferDetail';

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

class BookmarksList extends PureComponent {
  constructor(props) {
    super(props);
    this._onMomentumScrollEnd = this._onMomentumScrollEnd.bind(this);
    this._onRefresh = this._onRefresh.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchMarkList(1));
  }

  _onMomentumScrollEnd(event) {
    const {dispatch, MeMarkList} = this.props;
    if ( !MeMarkList.canLoadMore || MeMarkList.isLoadMore ) return;

    const {contentOffset, layoutMeasurement, contentSize} = event.nativeEvent;
    let contentSizeH = contentSize.height;
    let viewBottomY = contentOffset.y + layoutMeasurement.height;

    if (Math.abs(viewBottomY - contentSizeH) <= 40) {
      dispatch(fetchMarkList(MeMarkList.page + 1));
    }
  }

  _onRefresh() {
    const { dispatch } = this.props;
    dispatch(fetchMarkList(1));
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
    const { MeMarkList } = this.props;
    return(
      <View style={styles.container}>
        {!MeMarkList.isLoading &&
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
              refreshing={MeMarkList.isLoading}
              onRefresh={this._onRefresh}
              colors={['rgb(217, 51, 58)']}
            />
          }
        >
          <View style={styles.contentContainer}>
            {MeMarkList.markList.map((mark, i) => {
              return (
                <MarkItem
                  key={`${mark.id}-${i}`}
                  mark={mark}
                  onPress={() => this._onPressCell(mark)}
                  onCall={() => this.clickCall('10000', mark.user.name)}
                />
              );
            })}
          </View>
          {
            MeMarkList.isLoadMore ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator />
                <Text style={{fontSize: 14, marginLeft: 5}}>正在加载更多的数据...</Text>
              </View>
            ) : null
          }
        </ScrollView>
        }
        <Loading isShow={MeMarkList.isLoading}/>
      </View>
    );
  }
}

const MarkItem = ({
  mark,
  onPress,
  onCall,
}) => {
  let width = (Common.window.width - 24) / 2;
  let imageH = 120;
  let markUser = mark.user;
  let serv_image = mark.serv_images && mark.serv_images != 'undefined' ? {uri: mark.serv_images.split(',')[0]} : require('../../resource/qk_nav_default.png');
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={styles.cardContainer}
      onPress={onPress}
    >
      <CachedImage
        style={{ width: width, height: imageH }}
        defaultSource={require('../../resource/qk_nav_default.png')}
        source={serv_image}
      />
      <View style={{
        width: width,
        paddingHorizontal: 15,
        paddingVertical: 8,
      }}>
        <Text style={{ fontSize: 14, color: '#1b2833', marginBottom: 4 }} numberOfLines={2}>{mark.serv_title}</Text>
        <Text style={{ fontSize: 12, color: '#999999', marginBottom: 4 }}>{mark.catalog}</Text>
        <View style={{ flexDirection:'row' }}>
          <Image style={{ width: 12, height: 12 }} source={require('../../resource/g-location-s.png')}/>
          <Text style={{ fontSize: 12, color: '#b8b8b8' }}>{mark.district}</Text>
        </View>
      </View>
      <View style={styles.cardUserInfoView}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <CachedImage
            style={{height: 22, width: 22, borderRadius: 15}}
            source={{uri: markUser.avatar}}
            defaultSource={require('../../resource/img_default_avatar.png')}
          />
          <Text
            style={{fontSize: 14, color: 'gray', marginLeft: 8, width: width * 0.4}}
            numberOfLines={1}
          >
            {markUser.name}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={onCall}
        >
          <Image style={{height: 18, width: 18}} source={require('../../resource/y-chat.png')}/>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
};

export default connect((state) => {
    const {MeMarkList} = state;
    return {MeMarkList}
})(BookmarksList);