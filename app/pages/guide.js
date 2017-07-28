import React, { Component } from 'react';
import {
    Image,
    AsyncStorage,
    TouchableOpacity,
    Alert
} from 'react-native';
import { Geolocation } from 'react-native-baidu-map';
import TabBarView from '../containers/TabBarView';
import Login from './signup';
import Constant from '../common/constants';
import UserDefaults from '../common/UserDefaults';
import Util from '../common/utils';
export default class Guide extends React.Component {

    constructor() {
        super();
        this.state = {
            initialPosition: 'unknown',//
            lastPosition: 'unknown',
            addressComponent: { "country": "中国", "country_code": 0, "province": "广东省", "city": "广州市", "district": "番禺区", "adcode": "440113", "street": "石北路", "street_number": "", "direction": "", "distance": "" }
        };
    }

    componentDidMount() {
        // 免登陆
        // const { navigator } = this.props;
        // this.timer = setTimeout(() => {
        //      this.existsToken();
        // }, 2000);

        // navigator获取geo不稳定 
        // navigator.geolocation.getCurrentPosition(
        //   (position) => {
        //       var initialPosition = JSON.stringify(position);
        //       this.setState({ initialPosition });
        //   },
        //   (error) => alert(JSON.stringify(error)),
        //   { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
        // );

        // this.watchID = navigator.geolocation.watchPosition((position) => {
        //     var lastPosition = JSON.stringify(position);
        //     this.setState({ lastPosition });
        //     this.getGeoLocation();
        // });

        let _that = this

        Geolocation.getCurrentPosition()
        .then(data => {
            console.log("获取经纬度"+JSON.stringify(data));   
            if(data != null){
                global.user = {};
                global.user.addressComponent = data;
                global.user.addressComponent.latitude = data.latitude;
                global.user.addressComponent.longitude = data.longitude;
                UserDefaults.setObject(Constant.storeKeys.ADDRESS_COMPONENT, global.user.addressComponent);
            }else{
                this.setState({ showProgress: false });
                // Alert.alert(
                //     null,
                //     `请开启奇客的定位权限`,
                //     [
                //      { text: '确定' },
                //     ]
                // )
            }
         })
        .then(() => {
            this.existsToken();
        })
        .catch(e =>{
            console.warn(e, 'error');           
        })

    }

    //If token is verified we will redirect the user to the home page
    async verifyToken(token) {
        let accessToken = token
        let { navigator } = this.props;
        let URL = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_TOKEN_LOGIN + accessToken;
        let data = {
            user: {
                district: global.user.addressComponent.district,
                city: global.user.addressComponent.city,
                province: global.user.addressComponent.province,
                country: global.user.addressComponent.country,
                latitude: global.user.addressComponent.latitude,
                longitude: global.user.addressComponent.longitude,
            }
        }
        Util.post( URL, data, (response) => {
            if(response.status == Constant.error_type.USER_IS_NIL){
                return
            }
            let userdetail = JSON.parse(response.user);
            UserDefaults.setObject(Constant.storeKeys.ACCESS_TOKEN_TISPR, response.token);
            let address = global.user.addressComponent;
            global.user = userdetail;
            global.user.addressComponent = address;
            global.user.authentication_token = response.token;
            this._navigate('TabBarView');
        }, navigator );
        
    }

    async existsToken() {
        try {
            let accessToken = await UserDefaults.cachedObject(Constant.storeKeys.ACCESS_TOKEN_TISPR);
            if (null != accessToken && global.user.addressComponent != null) {
                this.verifyToken(accessToken);
            }
            else{
                this._navigate('Login');
            }
            return;
        } catch (error) {
            //console.log('existsToken error:' + error)
        }

    }
    _navigate(routeName) {
        const { navigator } = this.props;
        if (routeName == 'Login') {

            navigator.resetTo({
                component: Login,
                name: 'Login'
            });
        } else if (routeName == 'TabBarView') {
            navigator.resetTo({
                component: TabBarView,
                name: 'TabBarView'
            });
        }
    }

    render() {
        return (
            <TouchableOpacity onPress={() => { const { navigator } = this.props; navigator.resetTo({ component: Login, name: 'Login' }) }} >
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