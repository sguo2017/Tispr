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
            let response = await fetch('https://afternoon-beyond-22141.herokuapp.com/api/verify?session%5Baccess_token%5D=' + accessToken);
            let res = await response.text();
            if (response.status >= 200 && response.status < 300) {
                //Verified token means user is logged in so we redirect him to home.
                this.redirect('TabBarView');
            } else {
                //Handle error
                let error = res;
                throw error;
            }
        } catch (error) {
            console.log("error response: " + error);
        }
    }

    async existsToken(token) {    
        try {     
            UserDefaults.clearCachedObject(Constant.storeKeys.ACCESS_TOKEN_TISPR);       
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
        const { navigator } = this.props;
        // this.timer = setTimeout(() => {
        //     this.existsToken();
        // }, 2000);
    }

    componentWillUnmount() {
        // clearTimeout(this.timer);
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