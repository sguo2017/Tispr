import React, { Component, PureComponent } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    StyleSheet,
    Navigator,
    PixelRatio,
    Alert
} from 'react-native'
import { observer } from 'mobx-react/native';
import { observable, computed, action, runInAction } from 'mobx';
import Header from '../components/HomeNavigation';
import SignUp from '../pages/signup';

@observer
export default class UserAgreement extends Component {

    constructor(props) {
        super(props);

    }
  
    _onBack = () => {        
        const { navigator } = this.props;
        navigator.resetTo({component: SignUp, name: 'SignUp'})
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Header
                    title='用户协议'
                    leftIcon = {require('../resource/t_header_arrow_left.png')}
                    leftIconAction = {this._onBack.bind(this)}
                />
                <Text style={{alignSelf: 'center', color: "#000",fontSize:16}}>用户协议 </Text>
                <Text style={{color: "#a8a6b9"}}>欢迎使用React Native！这篇文档会帮助你搭建基本的React Native开发环境。如果你已经搭好了环境，那么可以尝试一下编写Hello World。

根据你所使用的操作系统、针对的目标平台不同，具体步骤有所不同。如果想同时开发iOS和Android也没问题，你只需要先选一个平台开始，另一个平台的环境搭建只是稍有不同。

如果阅读完本文档后还碰到很多环境搭建的问题，我们建议你还可以再看看由本站提供的环境搭建视频教程(macOS iOS、macOS Android、windows Android)、windows环境搭建文字教程、以及常见问题。</Text>

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
    }
})