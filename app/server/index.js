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
import navpage from './offer/navpage';
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

     clickServRequestJump() {
        console.log("push page 2!!!")
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({　　//navigator.push 传入name和你想要跳的组件页面
                name: "ServRequest",
                component: ServRequest,
                params: {
                   
                }
            });
        }
    }

    clickNavigationJump(){
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({　　//navigator.push 传入name和你想要跳的组件页面
                name: "navpage",
                component: navpage,
                params: {
                   
                }
            });
        }
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "#9189d8" }}>

                <View style={{ alignItems: 'center', flexDirection: 'row',justifyContent:'space-around', marginTop: 150 }}>

                <TouchableOpacity onPress={this.clickServOfferJump.bind(this)}>
                    <Image style={{ width: 150, height: 150, alignSelf: 'center' ,left: 10}} source={require('../resource/t_offer_serv.png')} />
                </TouchableOpacity>   
                <TouchableOpacity onPress={this.clickServRequestJump.bind(this)}>           
                    <Image style={{ width: 150, height: 150, alignSelf: 'flex-end', right: 10, justifyContent: 'center'}} source={require('../resource/t_serv_request.png')} /> 
                </TouchableOpacity>   
                </View>
                <TouchableOpacity onPress={this.clickNavigationJump.bind(this)}>           
                    <Text>navigation</Text>
                </TouchableOpacity>
                <Image style={{ width: 50, height: 50, alignSelf: 'center', marginTop: 150}} source={require('../resource/t_server_close.png')} />

            </View>
        )
    }
}