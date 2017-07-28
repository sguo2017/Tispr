import React, { Component, PureComponent } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  ProgressBarAndroid,
  TouchableOpacity,
  TouchableHighlight,
  Platform,
  StyleSheet,
  Navigator,
  AsyncStorage,
  PixelRatio,
  Alert,
  Switch,
  ProgressViewIOS,
  ScrollView,
  Dimensions
} from 'react-native'
import Header from '../../components/HomeNavigation';
import ServOfferConfirm from './confirm';
import { MapView, MapTypes, Geolocation } from 'react-native-baidu-map';
import area from '../../sys/others/area.json'
import Picker from 'react-native-picker';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: {
    borderRadius: 75,
    width: 150,
    height: 150
  },
  textStyle: {
    fontSize: 16,
    marginTop: 10,
    color: '#1b2833',
  },
  subtext: {
    fontSize: 14,
    color: '#999999',
  },
  headIcon: {
    marginTop: 22,
    width: 40,
    height: 40,
    alignSelf: 'center'
  },
  progressViewIOS: {
    marginTop: 0,
    backgroundColor: 'transparent',
  },
  progressViewAndroid: {
    marginTop: -10,
  },
  textLengthText: {
    alignSelf: 'flex-end',
    right: 15,
    justifyContent: 'center',
    position: 'absolute',
    color: "#a8a6b9",
    fontSize: 12
  },
  contentRemindText: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginTop: 8.5,
  },
  textInput: {
    marginTop: 25,
    backgroundColor: 'white',
    fontSize: 16,
    paddingHorizontal: 5,
    marginHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  firstRowView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#a8a6b9',
    borderBottomWidth: 1,
    height: 56,
    marginHorizontal: 16,
  },
  secondRowView: {
    height: 76,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: '#a8a6b9',
    borderBottomWidth: 1,
    marginHorizontal: 16,
  },
  map: {
    width: Dimensions.get('window').width - 40,
    height: Dimensions.get('window').height - 500,
    marginBottom: 10,
    marginLeft: 20,
  },
});

export default class ServOfferDelivory extends Component {

  constructor(props) {
    super(props);

    this.state = {
      serv_offer: this.props.serv_offer,
      remoteSwitchIsOn: this.props.serv_offer.via == 'remote' || this.props.serv_offer.via == 'all' ? true : false,
      localSwitchIsOn: this.props.serv_offer.via == 'local' || this.props.serv_offer.via == 'all' ? true : false,
      initArea: ['广东', '广州', '番禺区'],
      zoom: 18,
    }
  }

  componentDidMount() {
    let _that = this
    Geolocation.getCurrentPosition()
      .then(data => {
        console.log("获取经纬度" + JSON.stringify(data));
        if (data != null) {
          let offer = this.state.serv_offer;
          offer.country = data.country;
          offer.province = data.province;
          offer.city = data.city;
          offer.district = data.district;
          offer.latitude = data.latitude;
          offer.longitude = data.longitude;
          this.setState({
            serv_offer: offer,
            zoom: 18, 
            center: {
              latitude: data.latitude,
              longitude: data.longitude,
            }
          })
        }
      })
      .catch(e => {
        console.warn(e, 'error');
      })
  }

  clickJump() {
    let _this = this;
    if (this.state.localSwitchIsOn && this.state.remoteSwitchIsOn) {
      this.state.serv_offer.via = 'all';
    } else if (this.state.localSwitchIsOn) {
      this.state.serv_offer.via = 'local';
    } else if (this.state.remoteSwitchIsOn) {
      this.state.serv_offer.via = 'remote';
    } else {
      Alert.alert(
        '提示',
        '请选择服务方式',
        [
          { text: '确定' },
        ]
      )
      return;
    }
    const { navigator } = this.props;
    if (navigator) {
      console.log(this.state.serv_offer.via)
      navigator.push({　　//navigator.push 传入name和你想要跳的组件页面
        name: "ServOfferConfirm",
        component: ServOfferConfirm,
        passProps: {
          serv_offer: this.state.serv_offer,
          getdata: (offer) => {
            _this.state.serv_offer = offer;
          }
        }
      });
    }
  }

  _onBack = () => {
    const { navigator } = this.props;
    if (this.props.getdata) {
      this.props.getdata(this.props.serv_offer);
    }
    if (navigator) {
      navigator.pop();
    }
  }
  renderProgressView = () => {
    if (Platform.OS == 'ios') {
      return (
        <ProgressViewIOS
          progressTintColor="#ffc400"
          style={styles.progressViewIOS}
          progress={0.6}
          progressViewStyle="bar"
        />
      );
    } else {
      return (
        <ProgressBarAndroid
          color="#ffc400"
          styleAttr='Horizontal'
          progress={0.6}
          indeterminate={false}
          style={styles.progressViewAndroid}
        />
      );
    }
  }

  _createAreaData() {
    let data = [];
    let len = area.length;
    for (let i = 0; i < len; i++) {
      let city = [];
      for (let j = 0, cityLen = area[i]['city'].length; j < cityLen; j++) {
        let _city = {};
        _city[area[i]['city'][j]['name']] = area[i]['city'][j]['area'];
        city.push(_city);
      }

      let _data = {};
      _data[area[i]['name']] = city;
      data.push(_data);
    }
    return data;
  }

  _showAreaPicker() {
    Picker.init({
      pickerData: this._createAreaData(),
      selectedValue: this.state.initArea,
      onPickerConfirm: pickedValue => {
        console.log('area', pickedValue);
        let offer = this.state.serv_offer;
        offer.city = pickedValue[1]+ "市"
        offer.province = pickedValue[0]+ "省"
        offer.district = pickedValue[2];
        this.setState({
          initArea: pickedValue,
          serv_offer: offer,
        });
        Geolocation.geocode(pickedValue[1] + "市", pickedValue[2])
          .then((response) => {
            this.setState({
              zoom: 18,
              center: {
                latitude: response.latitude,
                longitude: response.longitude,
                rand: Math.random()
              },
              serv_offer: offer
            });
            console.log("新地址的经度：" + response.longitude)
          })
          .catch(error => {
            console.warn(error, 'error')
          });
        Picker.hide()
      },
      onPickerCancel: pickedValue => {
        console.log('area', pickedValue);
      },
      pickerTitleText: '选择位置',
      pickerCancelBtnText: '取消',
      pickerConfirmBtnText: '确定',
    });
    Picker.show();
  }

  render() {
    //    console.log("this.state.avatarSourceArray: "+this.state.avatarSourceArray);
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <Header
          title='发布需求'
          leftIcon={require('../../resource/ic_back_white.png')}
          leftIconAction={this._onBack.bind(this)}
          rightButton='下一步'
          rightButtonAction={this.clickJump.bind(this)}
        />
        <ScrollView>
          {this.renderProgressView()}
          <Image style={styles.headIcon} source={require('../../resource/b_location.png')} />
          <Text style={{ alignSelf: 'center', color: "#000", fontSize: 16, margin: 10 }}>服务地点</Text>
          <View style={styles.firstRowView}>
            <Text style={styles.textStyle}>我希望远程完成</Text>
            <Switch
              onValueChange={(value) => this.setState({ remoteSwitchIsOn: value })}
              value={this.state.remoteSwitchIsOn}
              onTintColor="#ffc400"
              thumbTintColor={Platform.OS == 'ios' ? null : 'white'}
            />
          </View>
          <View style={styles.secondRowView}>
            <View style={{ flex: 1 }}>
              <Text style={styles.textStyle}>我希望本地完成</Text>
            </View>
            <Switch
              onValueChange={(value) => this.setState({ localSwitchIsOn: value })}
              value={this.state.localSwitchIsOn}
              onTintColor="#ffc400"
              thumbTintColor={Platform.OS == 'ios' ? null : 'white'}
            />
          </View>
          <View style={{paddingHorizontal: 16, paddingVertical: 20}}>
            <Text style={[styles.subtext, {fontSize: 16}]}>
              您当前的位置是
              <Text onPress={this._showAreaPicker.bind(this)} style={{ color: global.gColors.themeColor }}>{this.state.serv_offer.country}，{this.state.serv_offer.province}，{this.state.serv_offer.city}，{this.state.serv_offer.district}</Text>
            </Text>
          </View>
          <View style={{ flexDirection: 'row',}}>
            <MapView
              trafficEnabled={this.state.trafficEnabled}
              baiduHeatMapEnabled={this.state.baiduHeatMapEnabled}
              zoom={this.state.zoom}
              mapType={this.state.mapType}
              center={this.state.center}
              marker={this.state.marker}
              markers={this.state.markers}
              style={styles.map}
              onMarkerClick={(e) => {
                console.warn(JSON.stringify(e));
              }}
              onMapClick={(e) => {
              }}
            >
            </MapView>
          </View>
        </ScrollView>
      </View>
    );
  }
}
