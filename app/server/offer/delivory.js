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
    Alert,
    Switch
} from 'react-native'
import { observer } from 'mobx-react/native'
import { observable, computed, action, runInAction } from 'mobx';
import ImagePicker from 'react-native-image-picker';
import Constant from '../../common/constants';
import Header from '../../components/HomeNavigation';
import UselessTextInput from '../../components/UselessTextInput';
import ServOfferConfirm from './confirm';

@observer
export default class ServOfferDelivory extends Component {

    constructor(props) {
        super(props);

        this.state = {
            serv_offer: this.props.serv_offer,
            initialPosition: 'unknown',
            lastPosition: 'unknown',
            addressComponent:{"country":"中国","country_code":0,"province":"广东省","city":"广州市","district":"番禺区","adcode":"440113","street":"石北路","street_number":"","direction":"","distance":""}
        }
    }

    watchID: ?number = null;

    componentDidMount() {
        this.setState({
            trueSwitchIsOn: true,
            falseSwitchIsOn: false,
        });
        navigator.geolocation.getCurrentPosition(
            (position) => {
                var initialPosition = JSON.stringify(position);
                this.setState({ initialPosition });
            },
            (error) => alert(JSON.stringify(error)),
            { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
        );
        this.watchID = navigator.geolocation.watchPosition((position) => {
            var lastPosition = JSON.stringify(position);
            this.setState({ lastPosition });
            this.getGeoLocation();
        });        
    }

    async getGeoLocation() {
        let offer = this.state.serv_offer;
        offer.latitude = (JSON.parse(this.state.lastPosition)).coords.latitude;
        offer.longitude = (JSON.parse(this.state.lastPosition)).coords.longitude;
        this.setState({ serv_offer: offer });
        this.setState({ showProgress: true })
        try {
            let url = Constant.url.GEO_LOCATION_ADDR + `&location=${this.state.serv_offer.latitude},${this.state.serv_offer.longitude}`;
            console.log("URL:"+url)
            let response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });

            let res = await response.text();
            if (response.status >= 200 && response.status < 300) {
                var addressComponent = (JSON.parse(res)).result.addressComponent;
                let offer = serv_offer;
                offer.addressComponent = addressComponent;
                offer.district = addressComponent.district;
                offer.city = addressComponent.city;
                offer.province = addressComponent.province;
                offer.country = addressComponent.country;
                this.setState({ serv_offer: offer });
            } else {
                let error = res;
                throw error;
            }
        } catch (error) {
            this.setState({ error: error });
            console.log("error " + error);
            this.setState({ showProgress: false });

        }
    }

      clickJump() {
        let _this = this;
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({　　//navigator.push 传入name和你想要跳的组件页面
                name: "ServOfferConfirm",
                component: ServOfferConfirm,
                params: {
                    serv_offer: this.state.serv_offer,
                    getdata: (offer)=>{
                    _this.setState({
                        serv_offer: offer                      
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
    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
    }

    render() {
    //    console.log("this.state.avatarSourceArray: "+this.state.avatarSourceArray);
        return (
            <View style={{ flex: 1 }}>
                <Header
                    title='Delivory detail'
                    leftIcon={require('../../resource/t_header_arrow_left.png')}
                    leftIconAction = {this._onBack.bind(this)}
                />

                <ProgressBarAndroid color="#60d795" styleAttr='Horizontal' progress={0.9} indeterminate={false} style={{ marginTop: -10 }} />

                <Text style={{ alignSelf: 'flex-end', color: "#a8a6b9" }}>90%</Text>

                <Image style={{ width: 60, height: 60, alignSelf: 'center' }} source={require('../../resource/t_loaction.png')} />

                <Text style={{ alignSelf: 'center', color: "#a8a6b9", fontSize: 18, marginTop:5, marginBottom: 10 }}>怎样提供服务</Text>

                <View style={{ alignItems: 'center', flexDirection: 'row',justifyContent: 'space-between', 
                borderBottomColor: '#a8a6b9', borderBottomWidth:1, marginLeft:5, paddingBottom: 8}}>
                    <Text style={styles.textStyle}>远程/在线</Text>
                    <Switch
                    onValueChange={(value) => this.setState({falseSwitchIsOn: value})}
                    style={{marginTop: 15}}
                    value={this.state.falseSwitchIsOn} />
                </View>

                <View style={{borderBottomColor: '#a8a6b9',borderBottomWidth:1, marginLeft:5, paddingBottom: 8}}>
                    <View style={{ alignItems: 'center', flexDirection: 'row',justifyContent: 'space-between' }}>
                        <Text style={styles.textStyle}>
                            本地
                        </Text>
                        <Switch
                        onValueChange={(value) => this.setState({trueSwitchIsOn: value})}                    
                        style={{marginTop: 15}}
                        value={this.state.trueSwitchIsOn} />
                    </View>
                    <Text style={{color:'black'}}>
                        <Text>您的服务范围设置在 &nbsp;</Text>
                        <Text>{this.state.serv_offer.district}，{this.state.serv_offer.city}，{this.state.serv_offer.province}，{this.state.serv_offer.country}</Text>
                    </Text>
                </View>

                <TouchableHighlight style={{ backgroundColor: global.gColors.buttonColor, marginTop: 60, alignSelf: 'stretch' }} onPress={this.clickJump.bind(this)}>
                    <Text style={{ fontSize: 22, color: '#FFF', alignSelf: 'center', backgroundColor:global.gColors.buttonColor}}>
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
    },
    textStyle:{
        fontSize: 20,
        marginTop: 10,
        color: 'black',
    }
})