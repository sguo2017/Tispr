import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  InteractionManager,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
  Platform,
  ActivityIndicator,
  RefreshControl,
  Linking,
  Alert,
  Modal,
  AsyncStorage,
  TextInput,
} from 'react-native';
import { CachedImage } from "react-native-img-cache";
import { fetchExploreList } from '../actions/ServOfferListActions';
import Common from '../common/constants';
import Loading from '../components/Loading';
import ServOfferDetail from './ServOfferDetail';
import Constant from '../common/constants';
import UserDefaults from '../common/UserDefaults';
import resTimes from '../buzz/restTimes';
import totalResTimes from '../buzz/totalResTimes';
import noConnectTimes from '../buzz/noConnectTimes';
import AutoTextInput from '../components/AutoTextInput'
import ChatDetail from '../chat/ChatDetail'
import Util from '../common/utils'
import NavPage from '../server/nav/index'

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
    backgroundColor: 'white',
    borderRadius: 4,
    overflow: 'hidden',
  },
  cardUserInfoView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
  },
   // modal的样式
    modalStyle: {
        zIndex: 999,
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
    notSelectedButton: {
        borderWidth: 1,
        borderColor: global.gColors.themeColor,
        padding:5,
        height: 36,
        marginRight: 20,
        marginBottom: 8,
        borderRadius: 4,
        width:Platform.OS === 'ios'? 260: 210
    },
    selectedButton:{
        borderWidth: 1,
        borderColor: global.gColors.themeColor,
        backgroundColor: global.gColors.themeColor,
        padding:5,
        height: 36,
        marginRight: 20,
        marginBottom:8,
        borderRadius: 4,
        width:Platform.OS === 'ios'? 260: 210
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginHorizontal: 130,
        marginVertical: 20
    }
});
const msg1 ='你发布的专业服务很棒！';
const msg2 ='请问你是如何收费的？';
const msg3 = '我想看一下你的更多作品。';
export default class ServOfferList extends Component {
  constructor(props) {
      super(props);
      this._onMomentumScrollEnd = this._onMomentumScrollEnd.bind(this);
      this._onRefresh = this._onRefresh.bind(this);
      this.state = {
        show: false,
        button1: true,
        button2: false, 
        button3: false,
        connectUserName: '',
        connectUserAvatar: '',
        connectServ: '',
        hasSeenTotalTimes: false,
        content: '',
        editable: false,
        exploreparams: this.props.exploreparams
      };
      UserDefaults.cachedObject(Constant.storeKeys.HAS_SEEN_TOTAL_RESTIMES_PAGE).then((hasSeenTotalRestimesPage) => {
            if (hasSeenTotalRestimesPage != null && hasSeenTotalRestimesPage[global.user.id] == true) {
                this.setState({
                    hasSeenTotalTimes: true
                });
            }
        })
  }

    componentDidMount() {
        const { dispatch } = this.props;
        if(!global.user.authentication_token){
            Util.noToken(this.props.navigator);
        }
        let exploreparams = this.props.exploreparams;
        console.log(exploreparams)
        if (!exploreparams.via) {
            UserDefaults.cachedObject(Constant.storeKeys.SEARCH_HISTORY_KEY).then((historyKey) => {
                if (historyKey == null) {
                    historyKey = {};
                } else if (historyKey[global.user.id]) {
                    console.log("listmount")
                    exploreparams = historyKey[global.user.id];
                    console.log(exploreparams)
                    exploreparams.title = this.props.title;
                    console.log(exploreparams)
                    this.setState({exploreparams: historyKey[global.user.id]});
                    dispatch(fetchExploreList(1, exploreparams, this.props.navigator));
                } else {
                    dispatch(fetchExploreList(1, exploreparams, this.props.navigator));
                }
            })
        }
    }

  _onMomentumScrollEnd(event) {
    console.log('listend');
    const {dispatch, ServOfferList} = this.props;
    if ( !ServOfferList.canLoadMore || ServOfferList.isLoadMore ) return;

    const {contentOffset, layoutMeasurement, contentSize} = event.nativeEvent;
    let contentSizeH = contentSize.height;
    let viewBottomY = contentOffset.y + layoutMeasurement.height;

    if (Math.abs(viewBottomY - contentSizeH) <= 40) {
        console.log(this.props.exploreparams)
      dispatch(fetchExploreList(ServOfferList.page + 1,this.props.exploreparams, this.props.navigator));
    }
  }

  _onRefresh() {
    console.log('listfresh');
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
    let default_msg;
    default_msg =`${feed.user.name}` + '您好！';
    if(this.state.button1)
        default_msg += msg1;
    if(this.state.button2)
        default_msg += msg2;
    if(this.state.button3)
        default_msg += msg3;
    if (this.state.content)
        default_msg += this.state.content;
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
                  serv_catagory: feed.serv_catagory,
                  lately_chat_content: default_msg,
              }
          })
      });

      let res = await response.text();
      if (response.status >= 200 && response.status < 300) {
          //console.log("line:153");
          let resObject =JSON.parse(res);
          let avaliableTimes =resObject.avaliable;
          let newOrder = resObject.feed;
          let type = 'offer';
          if(resObject.status==0){
              this._createChat(newOrder, avaliableTimes, default_msg);               
          }else if(resObject.status==-2){
               this.props.navigator.push({component: noConnectTimes})
          }
      } else {
          let error = res;
          throw error;
      }
    } catch (error) {
        console.log("error " + error);
    }
  }

  async _createChat(newOrder, avaliableTimes, chat_content){
        let feed = this.state.connectServ;  
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
                    deal_id: newOrder.id,
                    chat_content: chat_content,
                    user_id: global.user.id,
                    catalog: 2,
                    receive_user_id: feed.user_id,
                    }
                })
            });

            let res = await response.text();
            if (response.status >= 200 && response.status < 300) {
                let type = 'offer';
                 /*当前用户没有看过每天联系总数量的提示时 */
                if (!this.state.hasSeenTotalTimes) {
                    UserDefaults.cachedObject(Constant.storeKeys.HAS_SEEN_TOTAL_RESTIMES_PAGE).then((hasSeenTotalRestimesPage) => {
                        if (hasSeenTotalRestimesPage == null) {
                            hasSeenTotalRestimesPage = {};
                        }
                        hasSeenTotalRestimesPage[global.user.id] = true
                        UserDefaults.setObject(Constant.storeKeys.HAS_SEEN_TOTAL_RESTIMES_PAGE, hasSeenTotalRestimesPage);
                    })
                    this.props.navigator.push({component:totalResTimes, passProps:{feed: newOrder,type}});
                }else if(avaliableTimes == 5){
                    this.props.navigator.push({component:resTimes, passProps:{feed: newOrder,type}});
                }else{
                    this.props.navigator.resetTo({component:ChatDetail, passProps: {feed: newOrder, newChat: true}});
                }      
            } else {
                let error = res;
                throw error;
            }
        } catch (error) {
            console.log("error " + error);
        }
  }

  focusOnTextInput = () => {
    this.setState({ editable: true });
    InteractionManager.runAfterInteractions(() => {
       this.modelTextInput.focus();
    });
  }

  clickNavigationJump(serv) {        
        const { navigator } = this.props; 
        let goods_tpye = serv;
        let fromExplore = true;
        if (navigator&&goods_tpye) {
            navigator.resetTo({
                name: 'NavPage',  
                component: NavPage,  
                passProps: {goods_tpye, fromExplore},
            });
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
                <View style={{ flex: 1 }}>
                    {ServOfferList.exploreList.map((serv, i) => {
                        if (i%2 === 1) return;
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
                <View style={{ flex: 1 }}>
                    {ServOfferList.exploreList.map((serv, i) => {
                        if (i%2 === 0) return;
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
            </View> 
          {
            ServOfferList.isLoadMore ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator />
                <Text style={{fontSize: 14, marginLeft: 5}}>正在加载更多的数据...</Text>
              </View>
            ) : 
            <View style={{marginTop: 66, alignItems: 'center', justifyContent: 'center', marginBottom: 60}}>
                <Image source={require('../resource/list-noresult.png')} style={{height: 128, width: 128}}/>
                <Text style={{color: '#1B2833', fontSize: 14, marginBottom: 32, marginTop: 24}}>没有找到想要的服务？</Text>
                <TouchableOpacity style={{backgroundColor: '#4A90E2' , height: 28, width: 135, alignItems: 'center', justifyContent: 'center', borderRadius: 2, marginBottom: 8}}>
                    <Text style={{color: 'white'}}>搜索本地服务</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {this.clickNavigationJump("serv_request")}}
                    style={{backgroundColor: '#FFC400' , height: 28, width: 135, alignItems: 'center', justifyContent: 'center', borderRadius: 2}}
                >
                    <Text  style={{color: 'white'}}>发布新的需求</Text> 
                </TouchableOpacity>
            </View>
          }
        </ScrollView>
        }
        <Loading isShow={ServOfferList.isLoading}/>
        <Modal
          animationType='slide'
          transparent={true}
          visible={this.state.show}
          onRequestClose={() => { }}
        >
          <View style={{ position: 'absolute', zIndex: 1, backgroundColor: 'black', width: gScreen.width, height: gScreen.height, opacity: 0.5 }} />
          <View style={styles.modalStyle}>
            <View style={[styles.subView, {height: 430}]}>
                <View style={styles.modalHead}>
                    <TouchableOpacity onPress={() => this.setState({ show: false })}>
                        <Text style={styles.themeColorText}>取消</Text>
                    </TouchableOpacity>
                    <Text style={{ color: 'black', fontSize: 16 }}>快捷消息</Text>
                    <TouchableOpacity onPress={this._sendMessage.bind(this)}>
                        <Text style={styles.themeColorText}>发送</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView>
                <View style={{ marginHorizontal: 20 }}>
                    <Image defaultSource={require('../resource/user_default_image.png')} source={{uri: this.state.connectUserAvatar}} style={styles.avatar}></Image>
                    {/*<View style={{height:80}}>
                        <Text style={{fontSize: 16, color: '#1B2833'}}>{this.state.connectUserName}您好！{this.state.button1&&msg1}{this.state.button2&&msg2}{this.state.button3&&msg3}</Text>
                    </View>*/}
                    <TextInput
                        ref={(textInput) => { this.modelTextInput = textInput; }}
                        multiline={true}
                        onChangeText={(text) => 
                            {
                                let length= (this.state.connectUserName+'您好！'+(this.state.button1?msg1: '')+(this.state.button2?msg2: '')+(this.state.button3?msg3: '')).length;
                                this.setState({content: text.substring(length)});

                            }
                        }
                        onBlur={() => {
                            this.setState({editable: false})}
                        }
                        style={{ fontSize: 16, color: '#1B2833', marginBottom: 8 }}
                        value={this.state.connectUserName+'您好！'+(this.state.button1?msg1: '')+(this.state.button2?msg2: '')+(this.state.button3?msg3: '')+this.state.content}
                        underlineColorAndroid={'transparent'}
                        editable={this.state.editable}
                    />

                    <TouchableHighlight 
                        style={[!this.state.button1&&styles.notSelectedButton, this.state.button1&&styles.selectedButton]} 
                        onPress={()=>this.setState({button1: !this.state.button1})}
                    >
                        <Text style={[!this.state.button1&&styles.themeColorText, this.state.button1&&styles.whiteText]}>{msg1}</Text>
                    </TouchableHighlight>
                    <TouchableHighlight 
                        style={[!this.state.button2&&styles.notSelectedButton, this.state.button2&&styles.selectedButton]} 
                        onPress={()=>this.setState({button2: !this.state.button2})}
                    >
                        <Text style={[!this.state.button2&&styles.themeColorText, this.state.button2&&styles.whiteText]}>{msg2}</Text>
                    </TouchableHighlight>
                    <TouchableHighlight 
                        style={[!this.state.button3&&styles.notSelectedButton, this.state.button3&&styles.selectedButton]} 
                        onPress={()=>this.setState({button3: !this.state.button3})}
                    >
                        <Text style={[!this.state.button3&&styles.themeColorText, this.state.button3&&styles.whiteText]}>{msg3}</Text>
                    </TouchableHighlight>
                    <TouchableHighlight 
                        style={[styles.notSelectedButton, {width:Platform.OS ==='ios'?120:100}]} 
                        onPress={()=> {
                            {/* this.setState({editable: true}); */}
                            this.focusOnTextInput();
                        }}
                    >
                        <Text style={[styles.themeColorText]}>自定义信息</Text>
                    </TouchableHighlight>
                </View>
                </ScrollView>
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
  let servUser = serv.user?serv.user:global.user
  let serv_image = serv.serv_images && serv.serv_images != 'undefined' ? {uri: serv.serv_images.split(',')[0]} : require('../resource/qk_nav_default.png');
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={styles.cardContainer}
      onPress={onPress}
    >
      <CachedImage
        style={{ width: width, height: imageH, borderTopLeftRadius: 4, borderTopRightRadius: 4  }}
        defaultSource={require('../resource/qk_nav_default.png')}
        source={serv_image}
      />
      <View style={{
        width: width,
        paddingHorizontal: 7,
        paddingVertical: 8,
        //backgroundColor: 'white',
      }}>
        <Text style={{ fontSize: 14, color: '#1b2833', marginBottom: 4 }} numberOfLines={3}>{serv.serv_title}</Text>
        <Text style={{ fontSize: 12, color: '#999999', marginBottom: 4 }}>{serv.catalog}</Text>
        <View style={{ flexDirection:'row'}}>
          <Image style={{ width: 18, height: 18, marginLeft: -4}} source={require('../resource/g-location-s.png')}/>
          <Text style={{ fontSize: 12, color: '#b8b8b8'}}>{serv.district}</Text>
        </View>
      </View>
      <View style={styles.cardUserInfoView}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <CachedImage
            style={{height: 24, width: 24, borderRadius: 15}}
            source={{uri: servUser.avatar}}
            defaultSource={require('../resource/img_default_avatar.png')}
          />
          <Text
            style={{ fontSize: 14, color: 'grey', marginLeft: 8, width: width * 0.4 }}
            numberOfLines={1}
          >
            {servUser.name}
          </Text>
        </View>
        {global.user.id !== servUser.id?
            <TouchableOpacity
                activeOpacity={0.75}
                onPress={onCall}
                >
                <Image style={{height: 22, width: 22}} source={require('../resource/y-chat.png')}/>
            </TouchableOpacity>:<View></View>
        }
      </View>
    </TouchableOpacity>
  )
};
