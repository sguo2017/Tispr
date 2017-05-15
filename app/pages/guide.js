import React, { Component } from 'react';
import {
    Image,
    AsyncStorage,
    TouchableOpacity
} from 'react-native';
import TabBarView from '../containers/TabBarView';
import Login from './signup';
import Constant from '../common/constants';
import UserDefaults from '../common/UserDefaults';

export default class Guide extends React.Component {

    
    componentDidMount() {
        // const { navigator } = this.props;
        // this.timer = setTimeout(() => {
        //      this.existsToken();
        // }, 2000);
    }

    componentWillMount(){

    }

    render() {
        return (
            <TouchableOpacity onPress={() => {const { navigator } = this.props; navigator.resetTo({component: Login, name: 'Login'})}} >
                <Image 
                    style={{
                        width: Constant.window.width,
                        height: Constant.window.height
                    }}
                    source={require('../resource/qk_guide.png')}
                />
            </TouchableOpacity>
        );
    }
}