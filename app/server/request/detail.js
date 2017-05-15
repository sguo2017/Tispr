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
            serv_offer: this.props.serv_offer,
        }
    }

    componentDidMount() {
    }

    clickJump() {
        if(undefined === this.state.serv_detail || this.state.detail_length<20){
            Alert.alert(
                    '提示',
                    '请输入不少于20个字符',
                    [
                        { text: '继续输入', onPress: () => console.log('确定') },
                    ]
                )
            return;
        }
        let _this = this;
        const { navigator } = this.props;
        console.log("go to delivory");
        if (navigator) {
            navigator.push({　　//navigator.push 传入name和你想要跳的组件页面
                name: "ServOfferDelivory",
                component: ServOfferDelivory,
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
        if (this.props.getdata) {
            this.props.getdata(this.state.serv_offer);
        }

        if (navigator) {
            navigator.pop();
        }
    }

    render() {
        //console.log("this.state.avatarSourceArray: "+this.state.avatarSourceArray);
        return (
            <View style={{ flex: 1 }}>
                <Header
                    title='Service details'
                    leftIcon={require('../../resource/t_header_arrow_left.png')}                                     
                    leftIconAction = {this._onBack.bind(this)}
                />

                <ProgressBarAndroid color="#60d795" styleAttr='Horizontal' progress={0.6} indeterminate={false} style={{ marginTop: -10 }} />

                <Text style={{ alignSelf: 'flex-end', color: "#a8a6b9" }}>60%</Text>

                <Image style={{ width: 50, height: 50, alignSelf: 'center' }} source={require('../../resource/t_heart.png')} />

                <Text style={{ alignSelf: 'center', color: "#a8a6b9", fontSize: 12 }}>服务有什么特点</Text>

                <Text style={{ color: "#a8a6b9" }}>详细描述服务内容，包括需要的优势，专业性，价格以及时间等 </Text>

                <UselessTextInput
                    multiline={true}
                    numberOfLines={3}
                    value ={this.state.serv_offer.serv_detail}
                    onChangeText={(val) => {
                        let offer = this.state.serv_offer;
                        offer.serv_detail = val;
                        offer.detail_length = val.length;
                        this.setState({ serv_offer: offer })
                        }}
                />

                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                    <Text style={{ color: "#a8a6b9" }}>不少于60个字符</Text>
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