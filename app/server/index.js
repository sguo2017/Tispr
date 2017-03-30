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

     clickJump() {
        console.log("push page 2!!!")
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


    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "#9189d8" }}>

                <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 150 }}>

                <TouchableOpacity onPress={this.clickJump.bind(this)}>
                    <Image style={{ width: 150, height: 150, alignSelf: 'center' }} source={require('../resource/t_offer_serv.png')} />
                </TouchableOpacity>
                    <Image style={{ width: 150, height: 150, alignSelf: 'flex-end', right: 5, justifyContent: 'center', position: 'absolute', }} source={require('../resource/t_serv_request.png')} />

                </View>

                <Image style={{ width: 50, height: 50, alignSelf: 'center', marginTop: 150 }} source={require('../resource/t_server_close.png')} />

            </View>
        )
    }
}