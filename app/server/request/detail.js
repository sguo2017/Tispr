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
    ProgressViewIOS,
    ScrollView,
    Keyboard
} from 'react-native'
import AutoTextInput from '../../components/AutoTextInput';
import Header from '../../components/HomeNavigation';
import UselessTextInput from '../../components/UselessTextInput';
import ServOfferDelivory from './delivory';

export default class ServOfferDetail extends Component {

    constructor(props) {
        super(props);

        this.state = {
            serv_offer: this.props.serv_offer,
        }
    }

    componentDidMount() {
    }

    clickJump() {
        if(undefined === this.state.serv_offer.serv_detail || this.state.serv_offer.detail_length<25){
            Alert.alert(
                    '提示',
                    '请输入不少于25个字符',
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
            const dismissKeyboard = require('dismissKeyboard'); 
            dismissKeyboard();
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
        //console.log("this.state.avatarSourceArray: "+this.state.avatarSourceArray);
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <Header
                    title='发布需求'
                    leftIcon={require('../../resource/ic_back_white.png')}
                    leftIconAction = {this._onBack.bind(this)}
                    rightButton='下一步'
                    rightButtonAction={this.clickJump.bind(this)}
                />
                <ScrollView>
                {this.renderProgressView()}
                <Image style={styles.headIcon} source={require('../../resource/b-xuqiu-xl.png')} />
                <Text style={{ alignSelf: 'center', color: "#000", fontSize: 16, margin: 10 }}>您的具体需求是什么</Text>
                <AutoTextInput
                  editable = {true}
                  style={styles.textInput}
                  maxLength={1000}
                  underlineColorAndroid="transparent"
                  multiline={true}
                  numberOfLines={3}
                  value ={this.state.serv_offer.serv_detail}
                  placeholderTextColor="#cccccc"
                  autoFocus
                  onChangeText={(val) => {
                    let offer = this.state.serv_offer;
                    offer.serv_detail = val;
                    offer.detail_length = val.length;
                    this.setState({ serv_offer: offer })
                  }}
                />
                <View style={styles.contentRemindText}>
                  <Text style={{ color: "#a8a6b9", fontSize: 12 }}>不少于25个字符</Text>
                  <Text style={styles.textLengthText}>
                    {this.state.serv_offer.detail_length?this.state.serv_offer.detail_length:'0'}/1000
                  </Text>
                </View>
                </ScrollView>
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
