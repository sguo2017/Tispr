import React, { Component } from 'react';
import {
    Image,
    AsyncStorage,
    TouchableOpacity,
    Alert,
    Platform,
    AppState
} from 'react-native';
import JPushModule from 'jpush-react-native';
import { Geolocation } from 'react-native-baidu-map';
import TabBarView from '../containers/TabBarView';
import Login from './signup';
import Constant from '../common/constants';
import UserDefaults from '../common/UserDefaults';
import Util from '../common/utils';
import accountBan from '../sys/others/accountBan'
export default class Guide extends React.Component {

    constructor() {
        super();
        this.state = {
            currentAppState: AppState.currentState,
            initialPosition: 'unknown',//
            lastPosition: 'unknown',
            addressComponent: { "country": "中国", "country_code": 0, "province": "广东省", "city": "广州市", "district": "番禺区", "adcode": "440113", "street": "石北路", "street_number": "", "direction": "", "distance": "" }
        };
        
        this.onGetRegistrationIdPress = this.onGetRegistrationIdPress.bind(this);
        
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = (nextAppState) => {
        if (this.state.currentAppState.match(/inactive|background/) && nextAppState === 'active'&&Platform.OS === 'ios') {
            JPushModule.setBadge(0, (success) => {});
        }
        this.setState({currentAppState: nextAppState});
    }

    onGetRegistrationIdPress() {
        if(!global.user){
            global.user = {};
            global.user.addressComponent = {};
        }
		JPushModule.getRegistrationID((registrationId) => {
            console.log("1111:"+registrationId);
            global.user.registrationId = registrationId;
        });
        if (Platform.OS === 'ios') {
            global.user.device_type = 'iOS';
        } else {
            JPushModule.getInfo((map) => {
                console.log("设备ID"+map.myDeviceId)
                global.user.device_type = map.myDeviceId
            });
        }
	}

    componentDidMount() {
        // 在收到点击事件之前调用此接口
        this.onGetRegistrationIdPress();
        // App状态更新
        AppState.addEventListener('change', this._handleAppStateChange);

        if (Platform.OS === 'android') {
            JPushModule.notifyJSDidLoad((resultCode) => {
                if (resultCode === 0) {
                }
            });
        }
        
        JPushModule.addReceiveNotificationListener((map) => {
            console.log("alertContent: " + map.alertContent);
            console.log("extras: " + map.extras);
        });
        JPushModule.addReceiveOpenNotificationListener((map) => {
            console.log("Opening notification!");
            // console.log("map: " + JSON.parse(map));
            // console.log("map.extra: " + map.extras);
            let type = '0';
            if (Platform.OS === 'ios') {
                JPushModule.setBadge(0, (success) => {});
                type = map.type;
            } else {
                type = JSON.parse(map.extras).type;
            }
            let accessToken =UserDefaults.cachedObject(Constant.storeKeys.ACCESS_TOKEN_TISPR);
            if (!accessToken) {
                this.props.navigator.resetTo({component: Login})
                return
            }
            if(type == "0"){
                this.props.navigator.resetTo({component: TabBarView, passProps: { initialPage: 3}})
            }
            if(type == "1"){
                this.props.navigator.resetTo({component: TabBarView, passProps: { initialPage: 1}})
            }
            if(type == "2"){
                this.props.navigator.resetTo({component: TabBarView, passProps: { initialPage: 4}})
            }
            if(type == "3"){
                this.props.navigator.resetTo({component: TabBarView, passProps: { initialPage: 4}})
            }
            if(type == "4"){
                this.props.navigator.resetTo({component:accountBan })
            }
            if(type == "5"){
                this.props.navigator.resetTo({component: Login})
            }
        });
        Geolocation.getCurrentPosition()
        .then(data => {
            console.log("获取经纬度"+JSON.stringify(data));   
            if(data.city && data.city !=null){
                if(!global.user){
                    global.user = {};
                }
                global.user.addressComponent = data;
                global.user.addressComponent.latitude = data.latitude;
                global.user.addressComponent.longitude = data.longitude;
                UserDefaults.setObject(Constant.storeKeys.ADDRESS_COMPONENT, global.user.addressComponent);
            } else {
                this.setState({ showProgress: false });
                Alert.alert(
                    null,
                    `请开启奇客的定位权限`,
                    [
                     { text: '确定' },
                    ]
                )
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
                regist_id: global.user.registrationId,
                device_type: global.user.device_type,
            }
        }
        Util.post( URL, data, (response) => {
            if(response.status == Constant.error_type.USER_IS_NIL || response.status == Constant.error_type.USER_IS_LOCK){
                this._navigate('Login');
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