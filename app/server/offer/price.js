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
    ScrollView
} from 'react-native'
import Header from '../../components/HomeNavigation';
import ServOfferDelivory from './delivory';
import Picker from 'react-native-picker';
import { Geolocation } from 'react-native-baidu-map';
import AutoTextInput from '../../components/AutoTextInput';
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
    textStyle:{
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
        backgroundColor: 'white',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#888',
        height:20,
        width:50
    },
    firstRowView: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor: '#a8a6b9',
        borderBottomWidth:1,
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
    text: {
        color: '#4A90E2',
        fontSize: 14,
        lineHeight: 22
    },
    touch: {
        borderRadius: 2,
        borderWidth: 1,
        borderColor: '#4A90E2',
        height: 28,
        paddingHorizontal: 8,
        marginLeft: 8,
        marginBottom: 8
    },
});
const rangeText = ["月","天","次","小时","分钟","张","幅", "篇","千字","首","场","平米","套","件","支"];
export default class ServOfferPrice extends Component {

    constructor(props) {
        super(props);

        this.state = {
            serv_offer: this.props.serv_offer,
            fixedSwitchIsOn: this.props.serv_offer.change_price == true ?false:true ,
            varySwitchIsOn: this.props.serv_offer.change_price == true ?true:false ,
        }
    }
    componentWillMount(){

    }
    clickJump() {
        let _this = this;
        const { navigator } = this.props;
        if(this.state.fixedSwitchIsOn){
            this.state.serv_offer.change_price = false;
        }else if(this.state.varySwitchIsOn){
            this.state.serv_offer.change_price = true;
        }
        if(!this.state.serv_offer.unit){
            this.state.serv_offer.unit = "小时"
        }
        if (navigator) {
            if(this.props.editOffer){
                this.props.getdata(this.state.serv_offer);
                navigator.pop();
            }else{
                navigator.push({　　//navigator.push 传入name和你想要跳的组件页面
                name: "ServOfferDelivory",
                component: ServOfferDelivory,
                passProps: {
                    serv_offer: this.state.serv_offer,
                    getdata: (offer) => {
                        _this.state.serv_offer=offer;
                    }
                }
            });
            }    
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

    componentWillMount(){

    }
    componentDidMount() {

    }
    renderProgressView = () => {
        if (Platform.OS == 'ios') {
            return (
              <ProgressViewIOS
                progressTintColor="#ffc400"
                style={styles.progressViewIOS}
                progress={0.7}
                progressViewStyle="bar"
              />
            );
        } else {
            return (
              <ProgressBarAndroid
                color="#ffc400"
                styleAttr='Horizontal'
                progress={0.7}
                indeterminate={false}
                style={styles.progressViewAndroid}
              />
            );
        }
    }


    _showAreaPicker() {
        Picker.init({
            pickerData: rangeText,
            selectedValue: ['小时'],
            onPickerCancel: pickedValue => {
                console.log('area', pickedValue);
            },
            onPickerSelect: pickedValue =>{
                let offer = this.state.serv_offer;
                offer.unit = pickedValue;
                console.log('选择了', pickedValue+"位置"+offer.unit);
                this.setState({serv_offer: offer});
            },
            pickerTitleText: '单位',
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
                    title='发布服务'
                    leftIcon={require('../../resource/ic_back_white.png')}
                    leftIconAction = {this._onBack.bind(this)}
                    rightButton='下一步'
                    rightButtonAction={this.clickJump.bind(this)}
                />
                <ScrollView>
                {this.renderProgressView()}
                <Image style={styles.headIcon} source={require('../../resource/b_location.png')} />
                <Text style={{ alignSelf: 'center', color: "#000", fontSize: 16, margin: 10 }}>如何收费</Text>
                <View style={styles.firstRowView}>
                    <View style={{ flex: 1,flexDirection:'row' }}>
                        <AutoTextInput
                            editable = {true}
                            style={styles.textInput}
                            underlineColorAndroid="transparent"
                            multiline={true}
                            numberOfLines={1}
                            value ={this.state.serv_offer.price}
                            autoFocus
                            onChangeText={(val) => {
                            let offer = this.state.serv_offer;
                            offer.price = val;
                            this.setState({ serv_offer: offer })
                            }}
                        />
                        <Text style={styles.textStyle}>元/</Text>
                        <Text style={[styles.textStyle,{borderWidth:1,borderColor:'#888',padding:5}]} onPress={()=>this._showAreaPicker()}>{this.state.serv_offer.unit?this.state.serv_offer.unit:"小时"}</Text>
                    </View>
                    <Switch
                      onValueChange={(value) => {this.setState({fixedSwitchIsOn: value,varySwitchIsOn: !value});}}
                      value={this.state.fixedSwitchIsOn}
                      onTintColor="#ffc400"
                      thumbTintColor={Platform.OS == 'ios'?null:'white'}
                    />
                </View>
                <View style={styles.secondRowView}>
                    <Text style={styles.textStyle}>浮动报价</Text>
                    <Switch
                        onValueChange={(value) => this.setState({varySwitchIsOn: value, fixedSwitchIsOn: !value})}
                        value={this.state.varySwitchIsOn}
                        onTintColor="#ffc400"
                        thumbTintColor={Platform.OS == 'ios'?null:'white'}
                    />
                </View>
                </ScrollView>
                
            </View>
        );
    }
}
