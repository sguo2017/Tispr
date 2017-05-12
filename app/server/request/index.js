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
import Header from '../../components/HomeNavigation';
import UselessTextInput from '../../components/UselessTextInput';
import ServOfferTitle from './title';

var FileUpload = require('NativeModules').FileUpload;

@observer
export default class ServOffer extends PureComponent {

    render() {
        let defaultName = 'firstPage';
        let defaultComponent = ServOfferTitle;
        return (
            <Navigator
                initialRoute={{ name: defaultName, component: defaultComponent }}　　//初始化导航器Navigator,指定默认的页面
                configureScene={
                    (route) => {
                        return Navigator.SceneConfigs.FloatFromRight;　　//配置场景动画，页面之间跳转时候的动画
                    }
                }
                renderScene={
                    (route, navigator) => {
                        let Component = route.component;
                        return <Component{...route.params} goods_tpye={this.props.goods_tpye} goods_catalogs_id={this.props.goods_catalogs_id} navigator={navigator} />　　//渲染场景
                    }
                }
            />
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