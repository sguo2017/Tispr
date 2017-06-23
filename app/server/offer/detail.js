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
    PixelRatio,
    ProgressViewIOS,
    Alert
} from 'react-native';
import Header from '../../components/HomeNavigation';
import AutoTextInput from '../../components/AutoTextInput';
import ServOfferDelivory from './delivory';

export default class ServOfferDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            serv_offer: this.props.serv_offer,
        }
    }
    clickJump() {
        if(undefined === this.state.serv_offer.serv_detail || this.state.serv_offer.detail_length<60){
            Alert.alert(
                    '提示',
                    '请输入不少于60个字符',
                    [
                        { text: '继续输入', onPress: () => console.log('确定') },
                    ]
                )
            return;
        }
        let _this = this;
        const { navigator } = this.props;
        console.log("go to delivory");
        if (navigator) {
            navigator.push({　　//navigator.push 传入name和你想要跳的组件页面
                name: "ServOfferDelivory",
                component: ServOfferDelivory,
                passProps: {
                    serv_offer: this.state.serv_offer,
                    getdata: (offer)=>{
                     _this.state.serv_offer=offer;
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
            progress={0.4}
            progressViewStyle="bar"
          />
        );
      } else {
        return (
          <ProgressBarAndroid
            color="#ffc400"
            styleAttr='Horizontal'
            progress={0.4}
            indeterminate={false}
            style={styles.progressViewAndroid}
          />
        );
      }
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <Header
                    title='发布服务'
                    leftIcon={require('../../resource/t_header_arrow_left.png')}                                     
                    leftIconAction = {this._onBack.bind(this)}
                    rightButton='下一步'
                    rightButtonAction={this.clickJump.bind(this)}
                />
                {this.renderProgressView()}
                <Image style={styles.headIcon} source={require('../../resource/b-zanshi-xl.png')} />
                <Text style={{ alignSelf: 'center', color: "#000", fontSize: 16, margin: 10 }}>服务有什么特点</Text>
                <Text style={{ alignSelf: 'center', color: "#a8a6b9", fontSize: 14, marginHorizontal:16 }}>详细描述服务内容，包括您的优势，专业性，价格以及时间等</Text>
                <AutoTextInput
                  editable = {true}
                  style={styles.textInput}
                  maxLength={1000}
                  underlineColorAndroid="transparent"
                  multiline={true}
                  numberOfLines={3}
                  value ={this.state.serv_offer.serv_detail}
                  onChangeText={(val) => {
                    let offer = this.state.serv_offer;
                    offer.serv_detail = val;
                    offer.detail_length = val.length;
                    this.setState({ serv_offer: offer })
                  }}
                />

                <View style={styles.contentRemindText}>
                  <Text style={{ color: "#a8a6b9", fontSize: 12 }}>不少于60个字符</Text>
                  <Text style={styles.textLengthText}>
                    {this.state.serv_offer.detail_length?this.state.serv_offer.detail_length:'0'}/1000
                  </Text>
                </View>
            </View>
        );
    }
}

let styles = StyleSheet.create({
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
});
