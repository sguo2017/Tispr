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
    Alert
} from 'react-native'
import { observer } from 'mobx-react/native'
import { observable, computed, action, runInAction } from 'mobx';
import ImagePicker from 'react-native-image-picker';
import ServOffer from './offer/index';
import ServRequest from './request/index';
import Nav from './nav/index';
@observer
export default class Server extends PureComponent {


    redirect() {
        this.props.navigator.push({
            title: 'servhomepage',
            component: ServOffer,
            params: {}
        })
    }

    _onpressClk() {
        Alert.alert(
            '提示',
            '成功',
            [
                { text: '服务发布成功', onPress: () => console.log('确定') },
            ]
        )
    }

    clickServOfferJump() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({　　//navigator.push 传入name和你想要跳的组件页面
                name: "ServOffer",
                component: ServOffer,
                params: {

                }
            });
        }
    }

    //进入servRequest
    clickServRequestJump() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: "ServRequest",
                component: ServRequest,
                params: {

                }
            });
        }
    }

    //进入ServOff
    clickNavigationJump() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: "Nav_ServOffer",
                component: Nav,
                params: {

                }
            });
        }
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "#9189d8" }}>
                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-around', marginTop: 150 }}>
                    <TouchableOpacity onPress={this.clickNavigationJump.bind(this)}>
                        <Image style={{ width: 150, height: 150, alignSelf: 'center', left: 10 }} source={require('../resource/t_offer_serv.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.clickServRequestJump.bind(this)}>
                        <Image style={{ width: 150, height: 150, alignSelf: 'flex-end', right: 10, justifyContent: 'center' }} source={require('../resource/t_serv_request.png')} />
                    </TouchableOpacity>
                </View>
                <Image style={{ width: 50, height: 50, alignSelf: 'center', marginTop: 150 }} source={require('../resource/t_server_close.png')} />
            </View>
        )
    }
}