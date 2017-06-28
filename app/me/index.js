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
import OffersList from './page/offersList';
import RequestsList from './page/requestsList';
import BookmarksList from './page/bookmarksList';
import PersonInfo from './personalinfoEdit';
import Setting from '../sys/Setting';
const controllers = [
    {categoryId: 1, controller: OffersList},
    {categoryId: 2, controller: RequestsList},
    {categoryId: 3, controller: BookmarksList}
]
export default class MeInfo extends Component {
    
    constructor(props) {
      super(props);

      this.state = {
        fileName: this.props.fileName,
        fileSource: this.props.source,
        avatar: global.user.avatar,
        errors: this.props.errors,
        info: global.user.profile,
        country: global.user.addressComponent.country,
        province: global.user.addressComponent.province,
        city: global.user.addressComponent.city,
        district: global.user.addressComponent.district
      }
    }
    clickJump() {
        let _this = this;
        const { navigator } = this.props;
        let  getdata=(a, b)=>{_this.setState({
                        avatar:a,
                        info: b
                    })}
        let abc='abc';
        let info = _this.state.info;
        if (navigator) {
            navigator.push({　　//navigator.push 传入name和你想要跳的组件页面
                name: "PersonInfo",
                component: PersonInfo,
                passProps: {getdata, info},
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
        var titles = ['服务('+global.user.offer_count+')', '需求('+global.user.request_count+')', '收藏('+global.user.favorites_count+')'];
        return(
          <View style={styles.container}>
            <View style={styles.headerView}>
                <View style={{ flexDirection:'row', justifyContent:'flex-start' }}>
                  <View>
                    <Image style={{width: 72, height:72, borderRadius: 36 }} source={{uri:this.state.avatar}} />
                    <TouchableOpacity style={{ borderRadius: 10, position: 'absolute', right: 0, bottom: 0 }} onPress={() => {this.clickCall('10000', global.user.name)}}>
                      <Image style={{ width:20, height:20 }}  source={require('../resource/y-call-tx3x.png')}/>
                    </TouchableOpacity>
                  </View>
                  <View style={{ flex: 1, justifyContent:'space-between', alignItems:'flex-start',marginLeft: 15}}>
                    <View>
                      <Text style={{ fontSize:16, color:'white' }}>{global.user.name}</Text>
                      <Text style={ styles.text }>{this.state.country} {this.state.province} {this.state.city} {this.state.district}</Text>
                    </View>
                    <TouchableOpacity style={styles.editButton} onPress={this.clickJump.bind(this)} >
                      <Text style={{ fontSize: 12, color: 'white' }}>
                        编辑个人信息
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity onPress={()=>this.props.navigator.push({ component: Setting })}>
                    <Image style={{ width: 18, height: 18, marginLeft: 26}} source={require('../resource/w-setting.png')}></Image>
                  </TouchableOpacity>
                </View>
                <View style={{marginHorizontal: 16}}>
                    <Text style={styles.text}>{global.user.profile}</Text>
                </View>
                <View style={{marginLeft: 16, marginVertical: 16, flexDirection: 'row'}}>
                    <Image style={{ marginRight: 11 }} source={require('../resource/w-earth.png')}></Image>
                    <Text style={styles.text}>www.straphoto.com</Text>
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
                            userId={global.user.id}
                            navigator={this.props.navigator}
                        />
                    )
                })}
            </ScrollableTabView>
          </View>
        )
    
     }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
