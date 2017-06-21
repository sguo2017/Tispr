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
    ProgressViewIOS,
    Alert
} from 'react-native'
import { observer } from 'mobx-react/native';
import Header from '../../components/HomeNavigation';
import UselessTextInput from '../../components/UselessTextInput';
import ServOfferDetail from './detail';
import NavPage from '../nav/index';

@observer
export default class ServOfferTitle extends Component {

    constructor(props) {
        super(props);

        this.state = {
            serv_offer: {},
        }
    }

    componentWillMount() {
        let offer = this.props.serv_offer
        //note: from detail.js  from nav/index.js
        if(offer == undefined){
            offer = {}
        }
        if(this.props.goods_catalogs_id != undefined){
             offer.goods_catalogs_id = this.props.goods_catalogs_id;
        }
        if(this.props.goods_tpye != undefined){
            offer.goods_tpye = this.props.goods_tpye;
        }
        if(this.props.goods_catalogs_name != undefined){
             offer.goods_catalogs_name = this.props.goods_catalogs_name;
        }
        this.setState({serv_offer: offer})
    }

    clickJump() {
        if(undefined === this.state.serv_offer.serv_title || this.state.serv_offer.title_length<16){
            Alert.alert(
                    '提示',
                    '请输入不少于16个字符',
                    [
                        { text: '继续输入', onPress: () => console.log('确定') },
                    ]
                )
            return;
        }
        console.log("push page 2!!!")
        let _this = this;
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({　　//navigator.push 传入name和你想要跳的组件页面
                name: "ServOfferDelivory",
                component: ServOfferDetail,
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
        navigator.resetTo({component: NavPage, name: 'NavPage',passProps:{goods_tpye}})
    }

    renderProgressView = () => {
        if (Platform.OS == 'ios') {
          return (
            <ProgressViewIOS
              progressTintColor="#60d795"
              style={styles.progressViewIOS}
              progress={0.3}
              progressViewStyle="bar"
            />
          );
        } else {
          return (
            <ProgressBarAndroid
              color="#60d795"
              styleAttr='Horizontal'
              progress={0.3}
              indeterminate={false}
              style={styles.progressViewAndroid}
            />
          );
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Header
                    title='发布服务'
                    leftIcon = {require('../../resource/t_header_arrow_left.png')}
                    leftIconAction = {this._onBack.bind(this)}
                />
                {this.renderProgressView()}

                <Text style={{ alignSelf: 'flex-end', color: "#a8a6b9" }}>30%</Text>

                <Image style={{ width: 50, height: 50, alignSelf: 'center' }} source={require('../../resource/b-aixin-xl.png')} />

                <Text style={{ alignSelf: 'center', color: "#000", fontSize: 16, margin: 10 }}>提供什么服务</Text>

                <Text style={{ alignSelf: 'center', color: "#a8a6b9" }}>一句话概括表述您的服务名称</Text>

                <UselessTextInput
                    style={{
                      paddingVertical: 15,
                      backgroundColor: 'white',
                      fontSize: 15,
                      paddingHorizontal: 15,
                    }}
                    placeholder="请输入内容"
                    placeholderTextColor="#a8a6b9"
                    underlineColorAndroid="transparent"
                    multiline={true}
                    numberOfLines={3}
                    value ={this.state.serv_offer.serv_title}
                    onChangeText={(val) => {
                        let offer=this.state.serv_offer;
                        offer.serv_title = val;
                        offer.title_length = val.length;
                        this.setState({ serv_offer: offer})
                        }}
                />

                <View style={{ alignItems: 'center', flexDirection: 'row', paddingHorizontal: 15, }}>
                    <Text style={{ color: "#a8a6b9" }}>不少于16个字符</Text>
                    <Text style={{ alignSelf: 'flex-end', right: 5, justifyContent: 'center', position: 'absolute', color: "#a8a6b9" }}>{this.state.serv_offer.title_length}</Text>
                </View>

                <TouchableHighlight style={styles.nextStepButton} onPress={this.clickJump.bind(this)} >
                    <Text style={styles.nextStepButtonText}>下一步</Text>
                </TouchableHighlight>
            </View>
        );
    }
}

let styles = StyleSheet.create({
    nextStepButton: {
      paddingVertical: 15,
      backgroundColor: global.gColors.buttonColor,
      marginTop: 20,
      alignSelf: 'stretch'
    },
    nextStepButtonText: {
      fontSize: 22,
        color: '#FFF',
      alignSelf: 'center',
      backgroundColor: global.gColors.buttonColor,
    },
    progressViewIOS: {
      marginTop: 0,
      backgroundColor: 'transparent',
    },
    progressViewAndroid: {
      marginTop: -10,
    }
})