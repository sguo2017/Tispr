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
    Dimensions,
    PixelRatio,
    Alert
} from 'react-native'
import { observer } from 'mobx-react/native'
import { observable, computed, action, runInAction } from 'mobx';
import ImagePicker from 'react-native-image-picker';
import Header from '../components/HomeNavigation';
import UselessTextInput from '../components/UselessTextInput';
import UserDefaults from '../common/UserDefaults';
import Constant from '../common/constants';

const screenW = Dimensions.get('window').width;

@observer
export default class DealConnect extends Component {

    constructor(props) {
        super(props);
    }
    
    async _createDeal() {
        const { feed } = this.props;
        try {
            let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_ORDER_CREATE + global.user.authentication_token;
            let response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify({
                    order: {
                        serv_offer_title: feed.serv_offer.serv_title,
                        serv_offer_id: feed.id,
                        serv_catagory: feed.serv_catagory,
                        offer_user_id: feed.user_id,
                    }
                })
            });

            let res = await response.text();
            if (response.status >= 200 && response.status < 300) {
                //console.log("line:153");
                Alert.alert(
                    '提示',
                    '成功',
                    [
                        { text: '已通知到对方' },
                    ]
                )
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

    render() {
        const { feed } = this.props;

        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <Header
                    title='Get Connect'
                    leftIcon={require('../resource/ic_back_white.png')}
                />


                <Text style={{ alignSelf: 'center', color: "#a8a6b9", fontSize: 12 }}>Hi {feed.user.name}! Your offer is awesome!</Text>


                <TouchableHighlight style={{ backgroundColor: '#81d49c', marginTop: 60, alignSelf: 'stretch' }} onPress={this._createDeal.bind(this)} >
                    <Text style={{ fontSize: 22, color: '#FFF', alignSelf: 'center', backgroundColor: '#81d49c', }}>
                        下一步
                  </Text>
                </TouchableHighlight>                

            </View>
        );
    }
}

const styles = StyleSheet.create({
    webView: {
        width: Constant.window.width,
        height: Constant.window.height - Platform.OS === 'ios' ? 64 : 50,
    },
    bottomToolBar: {
        height: 44,
        width: Constant.window.width,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopColor: '#ccc',
        position: 'absolute',
        bottom: 5,
        backgroundColor: '#81d49c'
    },
    cardImageContent: {
        height: Constant.window.height - (Platform.OS === 'ios' ? 64 : 50) - 44,
        width: Constant.window.width,
        backgroundColor: '#f5f5f5',
        top: Platform.OS === 'ios' ? 64 : 50,
        bottom: 44,
        position: 'absolute'
    },
    line: {
        height: 30,
        width: Constant.window.onePR,
        backgroundColor: '#ccc'
    }
})
