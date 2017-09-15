import React, { Component, PureComponent } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  ListView,
  ProgressBarAndroid,
  TouchableOpacity,
  Platform,
  RefreshControl,
  Alert,
  Navigator,
  Linking,
  ToastAndroid
} from 'react-native'
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from 'react-native-scrollable-tab-view';
import { CachedImage } from "react-native-img-cache";
import OffersList from './page/offersList';
import RequestsList from './page/requestsList';
import FriendsList from './page/FriendsList';
import PersonInfo from './personalinfoEdit';
import More from '../sys/More';
import Constant from '../common/constants';
import Util from '../common/utils';
import breakdown from '../sys/others/breakdown';
import offline from '../sys/others/offline';
import RecommandList from './page/recommandList'
export default class MeInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileName: this.props.fileName,
      fileSource: this.props.source,
      avatar: global.user.avatar,
      name: global.user.name,
      errors: this.props.errors,
      info: global.user.profile,
      country: global.user.addressComponent.country,
      province: global.user.addressComponent.province,
      city: global.user.addressComponent.city,
      district: global.user.addressComponent.district,
      offer_count: global.user.offer_count,
      request_count: global.user.request_count,
      favorites_count: global.user.favorites_count,
      phoneNum: global.user.num,
      friend_status: '',
      f_id: '',
    }
  }

  componentWillMount() {
    if (this.props.isBrowseMode && this.props.id) {
      this._getUserInfo();
    }
  }

  async _getUserInfo() {
    let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_PERSON_INFO + `/${this.props.id}?token=${global.user.authentication_token}`

    Util.get(
      url,
      (response) => {
        let thisUser = JSON.parse(response.user);
        this.setState({
          avatar: thisUser.avatar,
          info: thisUser.profile,
          country: thisUser.country,
          province: thisUser.province,
          city: thisUser.city,
          district: thisUser.district,
          name: thisUser.name,
          offer_count: thisUser.offer_count,
          request_count: thisUser.request_count,
          favorites_count: thisUser.favorites_count,
          phoneNum: thisUser.num ? thisUser.num : 10000,
          friend_status: thisUser.friend_status,
          f_id: thisUser.f_id,
        });
      },
      (error) => {
        if (error.message == 'Network request failed') {
          this.props.navigator.push({ component: offline })
        } else {
          this.props.navigator.push({ component: breakdown })
        }
      }
    )
  }
  clickJump(toPage) {
    let _this = this;
    const { navigator } = this.props;
    let getdata = (a, b, c, d) => {
      _this.setState({
        avatar: a,
        info: b,
        website: c,
        name: d,
      });
    };
    let info = _this.state.info;
    let website = this.state.website;
    if (navigator && toPage == 'EditInfo') {
      navigator.push({　　//navigator.push 传入name和你想要跳的组件页面
        name: "PersonInfo",
        component: PersonInfo,
        passProps: { getdata },
      });
    }
    if (navigator && toPage == 'More') {
      navigator.push({　　//navigator.push 传入name和你想要跳的组件页面
        name: "More",
        component: More,
        passProps: { getdata },
      });
    }
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
            { text: '是', onPress: () => { Linking.openURL(`tel:${phoneNum}`) } },
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

  addFriend(){
    let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_ADD_FRIENDS + `?token=${global.user.authentication_token}`
    let data = {
      user_id: global.user.id,
      friend_id: this.props.id,
      friend_name: this.state.name,
      friend_num: this.state.phoneNum,
      status: 'apply',
    }
    Util.post(url, data, (response)=>{
      if(response.status == 0){
        ToastAndroid.show('请求发送成功，请等待对方验证',ToastAndroid.LONG);
      }
    },this.props.navigator)
  }
  async deleteFriend() {
    try {
      let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_DELETE_FRIEND + '/' + this.state.f_id + '?token=' + global.user.authentication_token;
      let response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      let res = await response.text();
      if (response.status >= 200 && response.status < 300) {
        let resObject = JSON.parse(res);
        if (resObject.status == 0) {
          console.log(resObject.msg);
        } else {
          console.log(resObject.msg);
        }
      }
    } catch (error) {
      console.log(107)
    }
  }
  render() {
    let titles;
    let controllers;
    if (!this.props.isBrowseMode || this.props.id && this.props.id == global.user.id) {
      titles = ['服务(' + global.user.offer_count + ')', '需求(' + global.user.request_count + ')', '好友(' + global.user.favorites_count + ')'];
      controllers = [
        { categoryId: 1, controller: OffersList },
        { categoryId: 2, controller: RequestsList },
        { categoryId: 3, controller: FriendsList },
      ];
    } else {
      titles = ['TA发布的服务'];
      controllers = [
        { categoryId: 1, controller: OffersList },
      ];
    }
    return (
      <View style={styles.container}>
        <View style={styles.headerView}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
            <View>
              {
                this.props.isBrowseMode ?
                  <CachedImage style={{ width: 72, height: 72, borderRadius: 36 }} source={{ uri: this.state.avatar }} />
                  :
                  <TouchableOpacity onPress={this.clickJump.bind(this, 'EditInfo')}>
                    <CachedImage style={{ width: 72, height: 72, borderRadius: 36 }} source={{ uri: this.state.avatar }} />
                  </TouchableOpacity>
              }
              {
                this.props.isBrowseMode ?
                  <TouchableOpacity style={{ borderRadius: 10, position: 'absolute', right: 0, bottom: 0 }} onPress={() => { this.clickCall(this.state.phoneNum, this.state.name) }}>
                    <Image style={{ width: 20, height: 20 }} source={require('../resource/y-call-tx3x.png')} />
                  </TouchableOpacity>
                  : null
              }
            </View>
            <View style={{ flex: 1, alignItems: 'flex-start', marginLeft: 15 }}>
              <View>
                <Text style={{ fontSize: 16, color: 'white', marginBottom: 6 }}>{this.state.name}</Text>
              </View>
              <View>
                <Text style={styles.text}>{this.state.country} {this.state.province} {this.state.city} {this.state.district}</Text>
              </View>
              {
                this.props.isBrowseMode ? null :
                  <TouchableOpacity style={[styles.editButton, { marginTop: 6 }]} onPress={this.clickJump.bind(this, 'EditInfo')} >
                    <Text style={{ fontSize: 12, color: 'white' }}>
                      编辑个人信息
                        </Text>
                  </TouchableOpacity>
              }
            </View>
            {
              this.props.isBrowseMode ?
                <TouchableOpacity onPress={() => {
                  if (this.props.close != null) {
                    this.props.close();
                  }
                }}>
                  <Image style={{ width: 18, height: 18 }} source={require('../resource/w-cancel-line-nor.png')}></Image>
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={this.clickJump.bind(this, 'More')}>
                  <Image style={{ marginTop: -2 }} source={require('../resource/w-setting.png')}></Image>
                </TouchableOpacity>
            }
          </View>
          <View style={{ marginTop: 16,flexDirection: 'row' }}>
            <Text style={styles.text}>{this.state.info}</Text>
            {
              this.props.isBrowseMode?
              (this.state.friend_status == 'created'?
              <TouchableOpacity onPress={this.deleteFriend.bind(this)} style={{marginLeft:20}}>
                <Text style={{color:global.gColors.buttonColor, marginLeft:20}}>删除好友</Text>
              </TouchableOpacity>:
              <TouchableOpacity onPress={this.addFriend.bind(this)} style={{marginLeft:20}}>
                <Text style={{color:'#fff'}}>加好友</Text>
              </TouchableOpacity>)
              :null
            }
          </View>
        </View>
        <ScrollableTabView
          locked={true}
          renderTabBar={() => <ScrollableTabBar tabNames={titles} />}
          tabBarPosition='top'
          initialPage={0}
          scrollWithoutAnimation={false}
          tabBarActiveTextColor="#4a90e2"
          tabBarInactiveTextColor="#1b2833"
          tabBarUnderlineStyle={{ backgroundColor: '#4a90e2', height: 2 }}
          tabBarTextStyle={{ fontSize: 14 }}
        >
          {controllers.map((data, index) => {
            let Component = data.controller;
            return (
              <Component
                key={titles[index]}
                tabLabel={titles[index]}
                categoryId={data.categoryId}
                userId={this.props.isBrowseMode ? this.props.id : global.user.id}
                isBrowseMode={this.props.isBrowseMode}
                navigator={this.props.navigator}
              />
            )
          })}
        </ScrollableTabView>
      </View>
    );
  }


}

const styles = StyleSheet.create({
  cover: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        position: 'absolute', 
        top: 176, 
        left: 0, 
        height: global.gScreen.height, 
        width: global.gScreen.width, 
        zIndex: 99
    },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerView: {
    backgroundColor: '#4a90e2',
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 14,
    color: 'white',
  },
  editButton: {
    backgroundColor: '#75aae8',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});