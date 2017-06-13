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
    Switch
} from 'react-native'
import { observer } from 'mobx-react/native'
import { observable, computed, action, runInAction } from 'mobx';
import ImagePicker from 'react-native-image-picker';
import Header from '../../components/HomeNavigation';
import UselessTextInput from '../../components/UselessTextInput';
import ServOfferConfirm from './confirm';

@observer
export default class ServOfferDelivory extends Component {

    constructor(props) {
        super(props);

        this.state = {
            serv_offer: this.props.serv_offer,
        }
    }

    componentDidMount() {
    }

    clickJump() {
        let _this = this;
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({　　//navigator.push 传入name和你想要跳的组件页面
                name: "ServOfferConfirm",
                component: ServOfferConfirm,
                passProps: {
                    serv_offer: this.state.serv_offer,
                    getdata: (offer)=>{
                    _this.setState({
                        serv_offer: offer                      
                        })
                    }
                }
            });
        }
    }

    _onBack = () => {
        const { navigator } = this.props;
        if (this.props.getdata) {
            this.props.getdata(this.state.serv_offer);
        }
        if (navigator) {
            navigator.pop();
        }
    }

    render() {
    //    console.log("this.state.avatarSourceArray: "+this.state.avatarSourceArray);
        return (
            <View style={{ flex: 1 }}>
                <Header
                    title='发布需求'
                    leftIcon={require('../../resource/t_header_arrow_left.png')}
                    leftIconAction = {this._onBack.bind(this)}
                />

                <ProgressBarAndroid color="#60d795" styleAttr='Horizontal' progress={0.9} indeterminate={false} style={{ marginTop: -10 }} />

                <Text style={{ alignSelf: 'flex-end', color: "#a8a6b9" }}>90%</Text>

                <Image style={{ width: 60, height: 60, alignSelf: 'center' }} source={require('../../resource/b_location.png')} />

                <Text style={{ alignSelf: 'center', color: "#a8a6b9", fontSize: 18, marginTop:5, marginBottom: 10 }}>服务地点</Text>

                <View style={{ alignItems: 'center', flexDirection: 'row',justifyContent: 'space-between', 
                borderBottomColor: '#a8a6b9', borderBottomWidth:1, marginLeft:5, paddingBottom: 8}}>
                    <Text style={styles.textStyle}>我希望远程完成</Text>
                    <Switch
                    onValueChange={(value) => this.setState({falseSwitchIsOn: value})}
                    style={{marginTop: 15}}
                    value={this.state.falseSwitchIsOn} />
                </View>

                <View style={{borderBottomColor: '#a8a6b9',borderBottomWidth:1, marginLeft:5, paddingBottom: 8}}>
                    <View style={{ alignItems: 'center', flexDirection: 'row',justifyContent: 'space-between' }}>
                        <Text style={styles.textStyle}>
                            我希望本地完成
                        </Text>
                        <Switch
                        onValueChange={(value) => this.setState({trueSwitchIsOn: value})}                    
                        style={{marginTop: 15}}
                        value={this.state.trueSwitchIsOn} />
                    </View>
                    <Text style={{color:'black'}}>
                        <Text>您的服务范围设置在 &nbsp;</Text>
                        <Text>番禺区，广州市，广东省，中国</Text>
                    </Text>
                </View>

                <TouchableHighlight style={{ backgroundColor: '#81d49c', marginTop: 60, alignSelf: 'stretch' }} onPress={this.clickJump.bind(this)}>
                    <Text style={{ fontSize: 22, color: '#FFF', alignSelf: 'center', backgroundColor: '#81d49c', }}>
                        下一步
                  </Text>
                </TouchableHighlight>
            </View>
        );
    }
}

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
        fontSize: 20,
        marginTop: 10,
        color: 'black',
    }
})