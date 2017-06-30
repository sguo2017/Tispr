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
  Modal,
} from 'react-native';
import { CachedImage } from "react-native-img-cache";
import { fetchExploreList } from '../actions/ServOfferListActions';
import Common from '../common/constants';
import Loading from '../components/Loading';
import ServOfferDetail from './ServOfferDetail';
import Constant from '../common/constants';
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
   // modal的样式
    modalStyle: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        flex: 1,
    },
    // modal上子View的样式
    subView: {
        alignSelf: 'stretch',
        justifyContent: 'flex-start',
        borderWidth: 0.5,
        backgroundColor: '#fff',
        height: 300,
    },
    // 标题
    modalHead: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10
    },
        themeColorText: {
        color: global.gColors.themeColor,
        fontSize: 16
    },
    blackText: {
        color: '#000',
        padding: 5,
        borderRadius: 3,
        fontSize: 18
    },
    whiteText: {
        color: '#fff',
        fontSize: 16,
    },
    selectButton: {
        borderWidth: 1,
        borderColor: global.gColors.themeColor,
        padding: 5,
        height: 36,
        width: Platform.OS === 'ios' ? 104 : 80,
        marginRight: 20,
        marginBottom: 20
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginHorizontal: 130,
        marginVertical: 20
    }
});

export default class ServOfferList extends Component {
  constructor(props) {
      super(props);
      this._onMomentumScrollEnd = this._onMomentumScrollEnd.bind(this);
      this._onRefresh = this._onRefresh.bind(this);
      this.state = {
        show: false,
        sms: [true, false, false],
        defaultMsg: '你发表的专业服务很棒！',
        connectUserName: '',
        connectUserAvatar: '',
        connectServ: ''
      }
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

  _selectMessage = (feed) =>{
    let connectUser = feed.user
    this.setState({
      connectUserAvatar: connectUser.avatar,
      connectUserName: connectUser.name,
      show: true,
      connectServ: feed,
    })
  }

  async _sendMessage(){
    this.setState({
      show:false
    });
    let feed = this.state.connectServ;
    try {
      let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_ORDER_CREATE + global.user.authentication_token;
      let response = await fetch(url, {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },

          body: JSON.stringify({
              order: {
                  serv_offer_title: feed.serv_title,
                  serv_offer_id: feed.id,
                  offer_user_id: feed.user_id,
                  lately_chat_content: this.state.defaultMsg,
              }
          })
      });

      let res = await response.text();
      if (response.status >= 200 && response.status < 300) {
          //console.log("line:153");
          let resObject =JSON.parse(res);
          let avaliableTimes =resObject.avaliable;
          let type = 'offer';
          if(resObject.status==0){
              this._createChat(resObject.id,this.state.lately_chat_content);
              Alert.alert(
                  '提示',
                  '联系成功！你今天还可以联系'+avaliableTimes+ '位奇客',
                  [
                      { text: '确定'},
                  ]
              )
          }else if(resObject.status==-2){
              Alert.alert(
                  '提示',
                  '您今天的沟通机会已用完，请明天再联系',
                  [
                      { text: '确定'},
                  ]
              )
          }
      } else {
          let error = res;
          throw error;
      }
    } catch (error) {
        console.log("error " + error);
    }
  }

  async _createChat(_deal_id){
        let chat_content = this.state.lately_chat_content;
        try {
            let URL = `http://` + Constant.url.IMG_SERV_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_CHAT + `${global.user.authentication_token}`;
            let response = await fetch(URL, {
                method: 'POST',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                },

                body: JSON.stringify({
                chat: {
                    deal_id: _deal_id,
                    chat_content: this.state.defaultMsg,
                    user_id: global.user.id,
                    catalog: 2
                    }
                })
            });

            let res = await response.text();
            if (response.status >= 200 && response.status < 300) {
                console.log("line:99");
            } else {
                let error = res;
                throw error;
            }
        } catch (error) {
            console.log("error " + error);
        }
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
                  onCall={() => this._selectMessage(serv)}
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
        <Modal
          animationType='slide'
          transparent={true}
          visible={this.state.show}
        >
          <View style={styles.modalStyle}>
            <View style={[styles.subView, {height: 400}]}>
                <View style={styles.modalHead}>
                    <TouchableOpacity onPress={() => this.setState({ show: false })}>
                        <Text style={styles.themeColorText}>取消</Text>
                    </TouchableOpacity>
                    <Text style={{ color: 'black', fontSize: 16 }}>快捷回复</Text>
                    <TouchableOpacity onPress={this._sendMessage.bind(this)}>
                        <Text style={styles.themeColorText}>发送</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ marginLeft: 20 }}>
                    <Image defaultSource={require('../resource/user_default_image.png')} source={{uri: this.state.connectUserAvatar}} style={styles.avatar}></Image>
                    <Text style={{fontSize: 16, color: '#1B2833'}}>{this.state.connectUserName}您好！{this.state.defaultMsg}</Text>
                    <View style={{height:30}}></View>
                    <TouchableOpacity
                      style={[styles.selectButton, this.state.sms[0] && { backgroundColor: global.gColors.themeColor},{width: Platform.OS === 'ios' ? 250 : 200, }]}
                      onPress={()=>this.setState({sms:[true, false, false], defaultMsg: '你发布的专业服务很棒！'})}
                    >
                        <Text style={[styles.themeColorText, this.state.sms[0] && styles.whiteText]}>你发布的专业服务很棒！</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.selectButton, this.state.sms[1] && { backgroundColor: global.gColors.themeColor},{width: Platform.OS === 'ios' ? 240 : 180, }]}
                        onPress={()=>this.setState({sms:[false, true, false], defaultMsg: '请问你是如何收费的？'})}
                    >
                        <Text style={[styles.themeColorText, this.state.sms[1] && styles.whiteText]}>请问你是如何收费的？</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.selectButton, this.state.sms[2] && { backgroundColor: global.gColors.themeColor},{width: Platform.OS === 'ios' ? 260 : 210, }]}
                        onPress={()=>this.setState({sms:[false, false, true], defaultMsg: '我想看一下你的更多作品。'})}
                    >
                        <Text style={[styles.themeColorText, this.state.sms[2] && styles.whiteText]}>我想看一下你的更多作品。</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        </Modal>
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
