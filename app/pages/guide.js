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

    constructor() {
        super();
        this.state = {
            initialPosition: 'unknown',
            lastPosition: 'unknown',
            addressComponent: { "country": "中国", "country_code": 0, "province": "广东省", "city": "广州市", "district": "番禺区", "adcode": "440113", "street": "石北路", "street_number": "", "direction": "", "distance": "" }
        };
    }
    watchID: ?number = null;
    componentDidMount() {
        // const { navigator } = this.props;
        // this.timer = setTimeout(() => {
        //      this.existsToken();
        // }, 2000);
    }

    componentWillMount() {
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
        let _that = this;
        this.setState({ latitude: (JSON.parse(this.state.lastPosition)).coords.latitude })
        this.setState({ longitude: (JSON.parse(this.state.lastPosition)).coords.longitude })
        this.setState({ showProgress: true })
        let url = Constant.url.GEO_LOCATION_ADDR + `&location=${this.state.latitude},${this.state.longitude}`;
        await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            return response.json().then(function (json) {
                //console.log("60:"+JSON.stringify(json.result.addressComponent));
                var addressComponent = json.result.addressComponent;
                //console.log("62:"+JSON.stringify(addressComponent));
                _that.setState({ addressComponent: addressComponent });
                //console.log("64:"+JSON.stringify(_that.state.addressComponent))
                global.user = {};
                global.user.addressComponent = _that.state.addressComponent;
                global.user.addressComponent.latitude = _that.state.latitude;
                global.user.addressComponent.longitude = _that.state.longitude;
            })


        }).then(() => {
            this.existsToken();
        }).catch((error) => {
            this.setState({ error: error });
            //console.log("109 error: " + error);
            this.setState({ showProgress: false });
        });
    }


    //If token is verified we will redirect the user to the home page
    async verifyToken(token) {
        let accessToken = token

        try {
            let URL = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_TOKEN_LOGIN + accessToken;
            let response = await fetch(URL, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: {
                        district: global.user.addressComponent.district,
                        city: global.user.addressComponent.city,
                        province: global.user.addressComponent.province,
                        country: global.user.addressComponent.country,
                        latitude: global.user.addressComponent.latitude,
                        longitude: global.user.addressComponent.longitude,
                    }
                })
            });
            let res = await response.text();
            if (response.status >= 200 && response.status < 300) {
                //Verified token means user is logged in so we redirect him to home.
                //console.log("148:"+JSON.stringify(res))
                let result = JSON.parse(res);
                let userdetail = JSON.parse(result.user);
                UserDefaults.setObject(Constant.storeKeys.ACCESS_TOKEN_TISPR, result.token);
                let address = global.user.addressComponent;
                global.user = userdetail;
                global.user.addressComponent = address;
                this._navigate('TabBarView');
            } else {
                let error = res;
                throw error;
            }
        } catch (error) {
            //console.log("error response: " + error);
            UserDefaults.clearCachedObject(Constant.storeKeys.ACCESS_TOKEN_TISPR);
        }
    }

    async existsToken(token) {
        try {
            let accessToken = await UserDefaults.cachedObject(Constant.storeKeys.ACCESS_TOKEN_TISPR);
            if (null != accessToken) {
                this.verifyToken(accessToken)
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