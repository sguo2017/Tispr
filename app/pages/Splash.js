import React, { Component } from 'react';
import {
    Image,
    AsyncStorage
} from 'react-native';
import Guide from './guide';
import Constant from '../common/constants';

export default class Splash extends React.Component {

    componentDidMount() {
        const { navigator } = this.props;
        this.timer = setTimeout(() => {
           navigator.resetTo({
                component: Guide,
                name: 'Guide'
            });
        }, 2000);
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    render() {
        return (
            <Image
                style={{
                    width: Constant.window.width,
                    height: Constant.window.height
                }}
                source={require('../resource/start.png')}
            />
        );
    }
}