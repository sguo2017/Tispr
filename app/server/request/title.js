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
import NavPage from '../nav/index';

@observer
export default class ServOfferTitle extends Component {

    constructor(props) {
        super(props);

        this.state = {
            serv_offer: {},
        }
    }
    componentWillMount() {
        let offer = this.props.serv_offer
        //note: from detail.js  from nav/index.js
        if(offer == undefined){
            offer = {}
        }
        if(this.props.goods_catalogs_id != undefined){
             offer.goods_catalogs_id = this.props.goods_catalogs_id;
        }
        if(this.props.goods_tpye != undefined){
            offer.goods_tpye = this.props.goods_tpye;
        }
        if(this.props.goods_catalogs_name != undefined){
             offer.goods_catalogs_name = this.props.goods_catalogs_name;
        }
        this.setState({serv_offer: offer})
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
                component: ServOfferDetail,
                params: {
                    serv_offer: this.state.serv_offer,
                    getdata: (offer)=>{
                    _this.setState({
                        serv_offer: offer,
                        })
                    }
                }
            });
        }
    }

    _onBack = () => {        
        const { navigator } = this.props;
        navigator.resetTo({component: NavPage, name: 'NavPage'})
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Header
                    title='New request'
                    leftIcon = {require('../../resource/t_header_arrow_left.png')}
                    leftIconAction = {this._onBack.bind(this)}
                />

                <ProgressBarAndroid color="#60d795" styleAttr='Horizontal' progress={0.3} indeterminate={false} style={{ marginTop: -10 }} />

                <Text style={{ alignSelf: 'flex-end', color: "#a8a6b9" }}>30%</Text>

                <Image style={{ width: 50, height: 50, alignSelf: 'center' }} source={require('../../resource/t_text.png')} />

                <Text style={{ alignSelf: 'center', color: "#000", fontSize: 16, margin: 10}}>需要什么服务</Text>

                <Text style={{ alignSelf: 'center', color: "#a8a6b9" }}>一句话概括表述你的服务需要</Text>

                <UselessTextInput
                    multiline={true}
                    numberOfLines={3}
                    value ={this.state.serv_offer.serv_title}
                    onChangeText={(val) => {
                        let offer=this.state.serv_offer;
                        offer.serv_title = val;
                        offer.title_length = val.length;
                        this.setState({ serv_offer: offer})
                        }}
                />

                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                    <Text style={{ color: "#a8a6b9" }}>不少于15个字符</Text>
                    <Text style={{ alignSelf: 'flex-end', right: 5, justifyContent: 'center', position: 'absolute', color: "#a8a6b9" }}>{this.state.serv_offer.detail_length}</Text>
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