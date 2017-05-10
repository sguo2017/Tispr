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

    //If token is verified we will redirect the user to the home page
    async verifyToken(token) {
        let accessToken = token

        try {
            let URL = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_TOKEN_LOGIN + accessToken;
            console.log("35 URL="+URL);
            let response = await fetch(URL,{
                method: 'POST',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                 }
            });
            let res = await response.text();
            if (response.status >= 200 && response.status < 300) {
                //Verified token means user is logged in so we redirect him to home.
                let result = JSON.parse(res);
                UserDefaults.setObject(Constant.storeKeys.ACCESS_TOKEN_TISPR, result.token);
                global.user = JSON.parse(result.user);
                this._navigate('TabBarView');
            } else {
                //Handle error
                let error = res;
                throw error;
            }
        } catch (error) {
            console.log("error response: " + error);
            UserDefaults.clearCachedObject(Constant.storeKeys.ACCESS_TOKEN_TISPR);
        }
    }

    async existsToken(token) {    
        try {
            let accessToken = await UserDefaults.cachedObject(Constant.storeKeys.ACCESS_TOKEN_TISPR);
            if (null == accessToken) {
                this._navigate("Login");
            } else {
                this.verifyToken(accessToken)
            }
        } catch (error) {
            console.log('existsToken error:' + error)
        }
    }

    componentDidMount() {
        // const { navigator } = this.props;
        // this.timer = setTimeout(() => {
        //      this.existsToken();
        // }, 2000);
    }

    componentWillMount(){
        this.existsToken();
    }

    render() {
        return (
            <TouchableOpacity onPress={() => {const { navigator } = this.props; navigator.resetTo({component: Login, name: 'Login'})}} >
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