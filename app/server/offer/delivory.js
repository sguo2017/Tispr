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
            serv_title: this.props.serv_title,
            serv_detail: this.props.serv_detail,
            serv_imges: this.props.serv_imges,
            avatarSourceArray: this.props.avatarSourceArray,
            district: this.props.district,
            city: this.props.city,
            province: this.props.province,
            country: this.props.country,
            latitude: this.props.latitude,
            longitude: this.props.longitude,
            initialPosition: 'unknown',
            lastPosition: 'unknown',
            addressComponent:{"country":"中国","country_code":0,"province":"广东省","city":"广州市","district":"番禺区","adcode":"440113","street":"石北路","street_number":"","direction":"","distance":""}
        }
    }

    watchID: ?number = null;

    componentDidMount() {
        this.setState({
            serv_title: this.props.serv_title,
            serv_detail: this.props.serv_detail,
            trueSwitchIsOn: true,
            falseSwitchIsOn: false,
            serv_imges: this.props.serv_imges,
            avatarSourceArray: this.props.avatarSourceArray,
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
        this.setState({latitude:(JSON.parse(this.state.lastPosition)).coords.latitude})
        this.setState({longitude:(JSON.parse(this.state.lastPosition)).coords.longitude})
        this.setState({ showProgress: true })
        try {
            let url = Constant.url.GEO_LOCATION_ADDR + `&location=${this.state.latitude},${this.state.longitude}`;
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
                var addressComponent = JSON.stringify((JSON.parse(res)).result.addressComponent)
                this.setState({ addressComponent });
                this.setState({district:(JSON.parse(this.state.addressComponent)).district})
                this.setState({city:(JSON.parse(this.state.addressComponent)).city})
                this.setState({province:(JSON.parse(this.state.addressComponent)).province})
                this.setState({country:(JSON.parse(this.state.addressComponent)).country})
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
                    serv_title: this.state.serv_title,
                    serv_detail: this.state.serv_detail,
                    serv_imges: this.state.serv_imges,
                    avatarSourceArray: this.state.avatarSourceArray,
                    district: this.state.district,
                    city: this.state.city,
                    province: this.state.province,
                    country: this.state.country,
                    latitude: this.state.latitude,
                    longitude: this.state.longitude,
                    getdata: (title,detail,imges,SourceArray,district,city,province,country,latitude,longitude)=>{
                    _this.setState({
                        serv_title: title,
                        serv_detail: detail,
                        serv_imges: imges,
                        avatarSourceArray: SourceArray,
                        district: district,
                        city: city,
                        province: province,
                        country: country,
                        latitude: latitude,
                        longitude: longitude,                        
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
        console.log("leave from delivory");
        console.log("this.props.serv_imges:"+this.props.serv_imges);
        console.log("this.state.serv_imges:"+this.state.serv_imges);
        if (this.props.getdata) {
            this.props.getdata(title, detail,imges, SourceArray);
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
                    leftIconAction = {this._onBack}
                />

                <ProgressBarAndroid color="#60d795" styleAttr='Horizontal' progress={0.9} indeterminate={false} style={{ marginTop: -10 }} />

                <Text style={{ alignSelf: 'flex-end', color: "#a8a6b9" }}>90%</Text>

                <Image style={{ width: 60, height: 60, alignSelf: 'center' }} source={require('../../resource/t_loaction.png')} />

                <Text style={{ alignSelf: 'center', color: "#a8a6b9", fontSize: 18, marginTop:5, marginBottom: 10 }}>How will you provide this service?</Text>

                <View style={{ alignItems: 'center', flexDirection: 'row',justifyContent: 'space-between', 
                borderBottomColor: '#a8a6b9', borderBottomWidth:1, marginLeft:5, paddingBottom: 8}}>
                    <Text style={styles.textStyle}>Remotely/online</Text>
                    <Switch
                    onValueChange={(value) => this.setState({falseSwitchIsOn: value})}
                    style={{marginTop: 15}}
                    value={this.state.falseSwitchIsOn} />
                </View>

                <View style={{borderBottomColor: '#a8a6b9',borderBottomWidth:1, marginLeft:5, paddingBottom: 8}}>
                    <View style={{ alignItems: 'center', flexDirection: 'row',justifyContent: 'space-between' }}>
                        <Text style={styles.textStyle}>
                            Locally
                        </Text>
                        <Switch
                        onValueChange={(value) => this.setState({trueSwitchIsOn: value})}                    
                        style={{marginTop: 15}}
                        value={this.state.trueSwitchIsOn} />
                    </View>
                    <Text style={{color:'black'}}>
                        <Text>your profile is set to &nbsp;</Text>
                        <Text>{this.state.district}，{this.state.city}，{this.state.province}，{this.state.country}</Text>
                    </Text>
                </View>

                <TouchableHighlight style={{ backgroundColor: '#81d49c', marginTop: 60, alignSelf: 'stretch' }} onPress={this.clickJump.bind(this)}>
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
    },
    textStyle:{
        fontSize: 20,
        marginTop: 10,
        color: 'black',
    }
})