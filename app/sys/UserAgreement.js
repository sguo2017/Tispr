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

                <Text style={{alignSelf: 'center', color: "#a8a6b9"}}>一句话概括表述您的服务名称 </Text>

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