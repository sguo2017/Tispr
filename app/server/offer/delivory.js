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
} from 'react-native'
import { observer } from 'mobx-react/native';
import Header from '../../components/HomeNavigation';
import ServOfferConfirm from './confirm';

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
        borderBottomWidth:1,
        height: 56,
        marginHorizontal: 16,
    },
    secondRowView: {
        height: 76,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor: '#a8a6b9',
        borderBottomWidth: 1,
        marginHorizontal: 16,
    }
});

@observer
export default class ServOfferDelivory extends Component {

    constructor(props) {
        super(props);

        this.state = {
            serv_offer: this.props.serv_offer,
            remoteSwitchIsOn: false,
            localSwitchIsOn: true
            }
    }
    clickJump() {
        let _this = this;
        const { navigator } = this.props;
        if(this.state.localSwitchIsOn && this.state.remoteSwitchIsOn){
            this.state.serv_offer.via = 'all';
        }else if(this.state.localSwitchIsOn){
            this.state.serv_offer.via = 'local';
        }else if(this.state.remoteSwitchIsOn){
            this.state.serv_offer.via = 'remote';
        }else{
            Alert("请选择服务方式");
            return;
        }
        if (navigator) {
            navigator.push({　　//navigator.push 传入name和你想要跳的组件页面
                name: "ServOfferConfirm",
                component: ServOfferConfirm,
                passProps: {
                    serv_offer: this.state.serv_offer,
                    getdata: (offer) => {
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
    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
    }
    renderProgressView = () => {
        if (Platform.OS == 'ios') {
            return (
              <ProgressViewIOS
                progressTintColor="#ffc400"
                style={styles.progressViewIOS}
                progress={0.9}
                progressViewStyle="bar"
              />
            );
        } else {
            return (
              <ProgressBarAndroid
                color="#ffc400"
                styleAttr='Horizontal'
                progress={0.9}
                indeterminate={false}
                style={styles.progressViewAndroid}
              />
            );
        }
    }
    render() {
    //    console.log("this.state.avatarSourceArray: "+this.state.avatarSourceArray);
        return (
            <View style={{ flex: 1 }}>
                <Header
                    title='发布服务'
                    leftIcon={require('../../resource/t_header_arrow_left.png')}
                    leftIconAction = {this._onBack.bind(this)}
                    rightButton='下一步'
                    rightButtonAction={this.clickJump.bind(this)}
                />
                {this.renderProgressView()}
                <Image style={styles.headIcon} source={require('../../resource/b_location.png')} />
                <Text style={{ alignSelf: 'center', color: "#000", fontSize: 16, margin: 10 }}>怎样提供服务</Text>
                <View style={styles.firstRowView}>
                    <Text style={styles.textStyle}>远程/在线</Text>
                    <Switch
                        onValueChange={(value) => this.setState({remoteSwitchIsOn: value})}
                        value={this.state.remoteSwitchIsOn}
                        onTintColor="#ffc400"
                    />
                </View>
                <View style={styles.secondRowView}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.textStyle}>本地</Text>
                        <Text style={styles.subtext}>
                            您的服务范围设置在 &nbsp;
                            <Text>{global.user.addressComponent.district}，{global.user.addressComponent.city}，{global.user.addressComponent.province}，{global.user.addressComponent.country}</Text>
                        </Text>
                    </View>
                    <Switch
                      onValueChange={(value) => this.setState({localSwitchIsOn: value})}
                      value={this.state.localSwitchIsOn}
                      onTintColor="#ffc400"
                    />
                </View>
            </View>
        );
    }
}
