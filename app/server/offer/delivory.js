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

export default class ServOfferDelivory extends Component {

    constructor(props) {
        super(props);

        this.state = {
            choices: [false, false, false],
            serv_offer: this.props.serv_offer,
            remoteSwitchIsOn: this.props.serv_offer.via == 'remote'||this.props.serv_offer.via == 'all'?true:false ,
            localSwitchIsOn: this.props.serv_offer.via == 'local'||this.props.serv_offer.via == 'all'?true:false ,
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
            Alert.alert(
                '提示',
                '请选择服务方式',
                [
                    { text: '确定'},
                ]
            )
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
                <Text style={{ alignSelf: 'center', color: "#000", fontSize: 16, margin: 10 }}>怎样提供服务</Text>
                <View style={styles.firstRowView}>
                    <Text style={styles.textStyle}>远程/在线</Text>
                    <Switch
                        onValueChange={(value) => this.setState({remoteSwitchIsOn: value})}
                        value={this.state.remoteSwitchIsOn}
                        onTintColor="#ffc400"
                        thumbTintColor={Platform.OS == 'ios'?null:'white'}
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
                      thumbTintColor={Platform.OS == 'ios'?null:'white'}
                    />
                </View>
                {this.state.localSwitchIsOn?
                <View style={{paddingHorizontal: 8, marginTop: 20}}>
                <TouchableOpacity
                    style={[styles.touch, {width: 118}, this.state.choices[0] && { backgroundColor: global.gColors.themeColor, }]}
                    onPress={() => this.setState({choices: [true, false, false] })}
                >
                    <Text style={[styles.text, this.state.choices[0] && { color: 'white' }]}>不提供上门服务</Text>
                </TouchableOpacity>
                <View style={{marginTop: 16, flexWrap: 'wrap', flexDirection: 'row'}}>
                    <TouchableOpacity
                        style={[styles.touch, this.state.choices[1] && { backgroundColor: global.gColors.themeColor }]}
                        onPress={() => this.setState({choices: [false, true, false] })}
                    >
                        <Text style={[styles.text, this.state.choices[1] && { color: 'white' }]}>5公里内</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.touch, this.state.choices[2] && { backgroundColor: global.gColors.themeColor }]}
                        onPress={() => this.setState({ choices: [false, false, true] })}
                    >
                        <Text style={[styles.text, this.state.choices[2] && { color: 'white' }]}>10公里内</Text>
                    </TouchableOpacity >
                </View>
                </View>
                :<View></View>
                }
                </ScrollView>
                
            </View>
        );
    }
}
