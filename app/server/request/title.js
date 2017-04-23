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
import ServOfferDetail from './detail';
import ServOfferDelivory from './delivory';

@observer
export default class ServOfferTitle extends Component {

    constructor(props) {
        super(props);

        this.state = {
            serv_title: this.props.serv_title,
            serv_detail: this.props.serv_detail,
            serv_imges: this.props.serv_imges,
            detail_length: this.props.detail_length,
            avatarSourceArray: this.props.avatarSourceArray,
        }
    }

    clickJump() {
        if(undefined === this.state.serv_title || this.state.detail_length<10){
            Alert.alert(
                    '提示',
                    '请输入不少于10个字符',
                    [
                        { text: '继续输入', onPress: () => console.log('确定') },
                    ]
                )
            return;
        }
        console.log("push page 2!!!")
        let _this = this;
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({　　//navigator.push 传入name和你想要跳的组件页面
                name: "ServOfferDelivory",
                component: ServOfferDelivory,
                params: {
                    serv_title: this.state.serv_title,
                    serv_detail: this.state.serv_detail,
                    serv_imges: this.state.serv_imges,
                    avatarSourceArray: this.state.avatarSourceArray,
                    getdata: (title,detail,imges,SourceArray)=>{
                    _this.setState({
                        serv_title: title,
                        serv_detail: detail,
                        serv_imges: imges,
                        avatarSourceArray: SourceArray
                        })
                    }
                }
            });
        }
    }



    _onBack = () => {
        const { navigator } = this.props;
        let title = this.state.serv_title;
        let detail = this.state.serv_detail;
        let imges = this.state.serv_imges;
        let SourceArray = this.state.avatarSourceArray;
        if (this.props.getdata) {
            this.props.getdata(title, detail,imges, SourceArray);
        }
        if (navigator) {
            navigator.pop();
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Header
                    title='New request'
                    leftIcon = {require('../../resource/t_header_arrow_left.png')}
                    leftIconAction = {this._onBack}
                />

                <ProgressBarAndroid color="#60d795" styleAttr='Horizontal' progress={0.9} indeterminate={false} style={{ marginTop: -10 }} />

                <Text style={{ alignSelf: 'flex-end', color: "#a8a6b9" }}>90%</Text>

                <Image style={{ width: 50, height: 50, alignSelf: 'center' }} source={require('../../resource/t_text.png')} />

                <Text style={{ alignSelf: 'center', color: "#a8a6b9", fontSize: 12 }}>What exactly do you need?</Text>

                <Text style={{ color: "#a8a6b9" }}>I need </Text>

                <UselessTextInput
                    multiline={true}
                    numberOfLines={3}
                    value ={this.state.serv_title}
                    onChangeText={(val) => this.setState({ serv_title: val, detail_length: val.length })}
                />

                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                    <Text style={{ color: "#a8a6b9" }}>min.15 characters</Text>
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