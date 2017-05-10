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
    Alert
} from 'react-native'
import { observer } from 'mobx-react/native'
import { observable, computed, action, runInAction } from 'mobx';
import NavPage from './nav/index';

@observer
export default class Server extends Component {

    constructor(props) {
        super(props);

        this.state = {
            user: this.props.user,
            pwd: this.props.pwd
        };  
    }

    clickNavigationJump(serv) {        
        const { navigator } = this.props;  
        if("serv_offer" == serv){
            let goods_tpye="serv_offer";
            console.log("goods_tpye:"+goods_tpye)
            if (navigator) {
                navigator.push({
                    name: 'NavPage',  
                    component: NavPage,  
                    passProps: {goods_tpye},
                });
            }
        }
        if("serv_request" == serv){            
            let goods_tpye="serv_request";
            console.log("goods_tpye:"+goods_tpye)
            if (navigator) {
                navigator.push({
                    name: "NavPage",
                    component: NavPage,
                    passProps: {goods_tpye},
                });                
            }
        }

    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: global.gColors.themeColor }}>
                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-around', marginTop: 150 }}>
                    <TouchableOpacity onPress={() => {this.clickNavigationJump("serv_offer")}}>
                        <Image style={{ width: 150, height: 150, alignSelf: 'center', left: 10 }} source={require('../resource/t_offer_serv.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {this.clickNavigationJump("serv_request")}}>
                        <Image style={{ width: 150, height: 150, alignSelf: 'flex-end', right: 10, justifyContent: 'center' }} source={require('../resource/t_serv_request.png')} />
                    </TouchableOpacity>
                </View>
                <Image style={{ width: 50, height: 50, alignSelf: 'center', marginTop: 150 }} source={require('../resource/t_server_close.png')} />
            </View>
        )
    }
}