import React, {Component, PureComponent} from 'react'
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
} from 'react-native'
import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import { CachedImage } from "react-native-img-cache";
import OffersList from './page/offersList';
import RequestsList from './page/requestsList';
import BookmarksList from './page/bookmarksList';
import PersonInfo from './personalinfoEdit';
import Setting from '../sys/Setting';
import Constant from '../common/constants';
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
      }
    }

    componentWillMount(){
      if(this.props.isBrowseMode && this.props.id){
        this._getUserInfo();
      }
    }
    async _getUserInfo(){
      try {
        let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_PERSON_INFO + `/${this.props.id}?token=${global.user.authentication_token}`

        fetch(url, {
          method: 'GET',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
        }).then(response => {
          if (response.status == 200) return response.json()
          return null
        }).then(responseData => {
          if (responseData) {
              let thisUser = JSON.parse(responseData.user);
              console.log("用户信息"+JSON.stringify(thisUser));
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
              });
          } else {
          }
        }).catch(error => {
          console.log(`Fetch evaluating list error: ${error}`)         
        })
      } catch (error) {
        console.log(`Fetch evaluating list error: ${error}`)
      }      
    }
    clickJump(toPage) {
        let _this = this;
        const { navigator } = this.props;
        let getdata = (a, b, c, d)=>{
          _this.setState({
            avatar:a,
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
                passProps: {getdata},
            });
        }
        if(navigator && toPage == 'Setting'){
          navigator.push({　　//navigator.push 传入name和你想要跳的组件页面
                name: "Setting",
                component: Setting,
                passProps: {getdata},
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
      let titles;
      let controllers;
      if (!this.props.isBrowseMode || this.props.id && this.props.id == global.user.id) {
        titles = ['服务('+global.user.offer_count+')', '需求('+global.user.request_count+')', '收藏('+global.user.favorites_count+')'];
        controllers = [
          {categoryId: 1, controller: OffersList},
          {categoryId: 2, controller: RequestsList},
          {categoryId: 3, controller: BookmarksList},
        ];
      } else {
        titles = ['TA发布的服务('+this.state.offer_count+')'];
        controllers = [
          {categoryId: 1, controller: OffersList}
        ];
      }
      return(
        <View style={styles.container}>
          <View style={styles.headerView}>
              <View style={{ flexDirection:'row', justifyContent:'flex-start' }}>
                <View>
                  <CachedImage style={{width: 72, height:72, borderRadius: 36 }} source={{ uri: this.state.avatar }} />
                  {
                    this.props.isBrowseMode ?
                      <TouchableOpacity style={{ borderRadius: 10, position: 'absolute', right: 0, bottom: 0 }} onPress={() => {this.clickCall('10000', global.user.name)}}>
                        <Image style={{ width:20, height:20 }}  source={require('../resource/y-call-tx3x.png')}/>
                      </TouchableOpacity>
                      : null
                  }
                </View>
                <View style={{ flex: 1, justifyContent:'space-between', alignItems:'flex-start',marginLeft: 15}}>
                  <View>
                    <Text style={{ fontSize:16, color:'white' }}>{this.state.name}</Text>
                  </View>
                  <View>
                    <Text style={ styles.text }>{this.state.country} {this.state.province} {this.state.city} {this.state.district}</Text>
                  </View>
                  {
                    this.props.isBrowseMode ? null :
                      <TouchableOpacity style={styles.editButton} onPress={this.clickJump.bind(this, 'EditInfo')} >
                        <Text style={{ fontSize: 12, color: 'white' }}>
                          编辑个人信息
                        </Text>
                      </TouchableOpacity>
                  }
                </View>
                {
                  this.props.isBrowseMode ?
                    <TouchableOpacity onPress={()=>{
                      if (this.props.close != null) {
                        this.props.close();
                      }
                    }}>
                      <Image style={{ width: 18, height: 18 }} source={require('../resource/w-cancel-line-nor.png')}></Image>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={this.clickJump.bind(this, 'Setting')}>
                      <Image style={{ width: 18, height: 18 }} source={require('../resource/w-setting.png')}></Image>
                    </TouchableOpacity>
                }
              </View>
              <View style={{marginHorizontal: 16}}>
                  <Text style={styles.text}>{this.state.info}</Text>
              </View>
              <View style={{marginVertical: 16, flexDirection: 'row', alignItems: 'center' }}>
                  <Image style={{ marginRight: 11 }} source={require('../resource/w-earth.png')}></Image>
                  <Text style={styles.text}>{global.user.website?global.user.website:''}</Text>
              </View>
          </View>
          <ScrollableTabView
              renderTabBar={() => <ScrollableTabBar tabNames={titles} style={{ height: 44 }}/>}
              tabBarPosition='top'
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
