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
import ServOfferDelivory from './delivory';

@observer
export default class ServOfferDetail extends Component {

    constructor(props) {
        super(props);

        this.state = {
            serv_title: this.props.serv_title,
            serv_detail: this.props.serv_detail,
            detail_length: this.props.detail_length,
        }
    }

    componentDidMount() {
        this.setState({
            serv_title: this.props.serv_title,
            serv_detail: this.props.serv_detail,
        });
    }

    clickJump() {
        if(this.state.detail_length<20){
            Alert.alert(
                    '提示',
                    '请输入不少于20个字符',
                    [
                        { text: '继续输入', onPress: () => console.log('确定') },
                    ]
                )
            return;
        }
        console.log("back 1");
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({　　//navigator.push 传入name和你想要跳的组件页面
                name: "ServOfferDelivory",
                component: ServOfferDelivory,
                params: {
                    serv_title: this.state.serv_title,
                    serv_detail: this.state.serv_detail,
                }
            });
        }
    }

    _onBack = () => {
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop({
                params: {
                    serv_title: this.state.serv_title,
                    serv_detail: this.state.serv_detail,
                }
            });
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Header
                    title='Service details'
                    leftIcon={require('../../resource/t_header_arrow_left.png')}                                     
                    leftIconAction = {this._onBack}
                />

                <ProgressBarAndroid color="#60d795" styleAttr='Horizontal' progress={0.9} indeterminate={false} style={{ marginTop: -10 }} />

                <Text style={{ alignSelf: 'flex-end', color: "#a8a6b9" }}>90%</Text>

                <Image style={{ width: 50, height: 50, alignSelf: 'center' }} source={require('../../resource/t_heart.png')} />

                <Text style={{ alignSelf: 'center', color: "#a8a6b9", fontSize: 12 }}>What makes it special?</Text>

                <Text style={{ color: "#a8a6b9" }}>Tell us more about this skill or service and \n
                    what makes it special.Price,type,time or other. </Text>

                <UselessTextInput
                    multiline={true}
                    numberOfLines={3}
                    onChangeText={(val) => {this.setState({ serv_detail: val,detail_length: val.length })}}
                />

                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                    <Text style={{ color: "#a8a6b9" }}>min.60 characters</Text>
                    <Text style={{ alignSelf: 'flex-end', right: 5, justifyContent: 'center', position: 'absolute', color: "#a8a6b9" }}>{this.state.detail_length}</Text>
                </View>

                <TouchableHighlight style={{ backgroundColor: '#81d49c', marginTop: 20, alignSelf: 'stretch' }} onPress={this.clickJump.bind(this)}>
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
    }
})