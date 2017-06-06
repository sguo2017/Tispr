import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    WebView,
    Image,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    ScrollView,
    Platform,
    Dimensions,
    Alert
} from 'react-native';
import { observer } from 'mobx-react/native'
import Header from '../components/HomeNavigation';
import Constant from '../common/constants';
import ShareView from '../components/ShareView';
import UserDefaults from '../common/UserDefaults';
import Connect from './Connect'

const screenW = Dimensions.get('window').width;

@observer
export default class SysMsgDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFavorited: this.props.feed.isFavorited,
            favorite_id: this.props.feed.favorite_id
        };
    }


    _p = feed => {
        this.props.navigator.push({
            component: Connect,
            passProps: { feed }
        })
    }

    componentWillMount(){
         const { feed } = this.props;
          this.setState({ 
              isFavorited: feed.isFavorited,
              favorite_id: feed.favorite_id }
             );
    }

    _switch() {
        if (this.state.isFavorited) {
            this.cancelCollect()
        } else {
            this.collect()
        }
    }

    async collect() {
        try {
            let t = global.user.authentication_token;
            let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_SERV_OFFER_COLLECT + t;
            console.log("69")
            let response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    favorite: {
                        obj_id: this.props.feed.serv_id,
                        obj_type: 'serv_offer',
                        user_id: global.user.id,
                    }
                })
            });

            let res = await response.text();
            if (response.status >= 200 && response.status < 300) {
                  let rmsg = JSON.parse(response._bodyText);
                  this.props.feed.favorite_id = rmsg.favorite_id;
                  this.props.feed.isFavorited= true;
                this.setState({ isFavorited: true });
            } else {
                let error = res;
                throw error;
            }
        } catch (error) {
            console.log(`Fetch evaluating list error: ${error}`)
        }
    }

    async cancelCollect() {
        try {
            let t = global.user.authentication_token;
            let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_SERV_OFFER_COLLECT_CANCEL + '/' + this.props.feed.favorite_id + '?token=' + t;
            console.log("101")
            let response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });

            let res = await response.text();
            if (response.status >= 200 && response.status < 300) {
                this.props.feed.isFavorited= false;
                this.setState({isFavorited: false});
            } else {
                let error = res;
                throw error;
            }
        } catch (error) {
            console.log(`Fetch evaluating list error: ${error}`)
        }
    }

    render() {
        const { feed } = this.props;
          let platformMargin = Platform.OS === 'ios' ? -40 : -30;
  

        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>


                <Header
                    leftIconAction={() => this.props.navigator.pop()}
                    title='查看详情'
                    leftIcon={require('../resource/ic_back_dark.png')}
                    rightIcon={this.state.isFavorited?require('../resource/ic_account_favour.png'):require('../resource/ic_news_collect.png')}
                    rightIconSize={30}
                    rightIconAction={() => this._switch(this.state.isFavorited, this.state.favorite_id)}
                />

                <View style={[styles.cardImageContent]}>
                    <ScrollView
                        bounces={false}
                        showsVerticalScrollIndicator={false}
                        removeClippedSubviews={true}
                        contentContainerStyle={{ backgroundColor: 'white' }}
                    >
                        <View style={{
                            flexDirection: 'row',
                            paddingVertical: 10,
                            paddingHorizontal: 15,
                            alignItems: 'center',
                            overflow: 'hidden'
                        }}>
                            <Image style={{ width: 30, height: 30, marginRight: 5, marginLeft: 3 }} source={{ uri: feed.user.avatar }} defaultSource={require('../resource/user_default_image.png')} />
                            <View style={{ marginLeft: 10 }}>
                                <Text style={{ color: 'black', fontSize: 18 }}>{feed.user_name}</Text>
                                <Text style={{ color: 'gray', fontSize: 18 }}>{feed.action_title}</Text>
                            </View>
                        </View>
                        <Image style={{ width: 350, height: 300, marginRight: 30, marginLeft: 5 }} source={{ uri: feed.serv_offer.serv_imges }} defaultSource={require('../resource/img_buzz_detail_default.png')} />
                        <View style={{
                            borderColor: '#ccc',
                            borderTopWidth: 0.5,
                            paddingVertical: 20,
                            paddingHorizontal: 15,
                            justifyContent: 'center',
                            marginTop: 5
                        }}>
                            <Text style={{ color: 'black', fontSize: 18 }}>{feed.action_desc}</Text>
                            <Text style={{ color: 'gray', fontSize: 18 }}>{feed.action_title}</Text>
                        </View>
                        {/*<TouchableHighlight style={[styles.bottomToolBar,{height: 40 }]}>
                        <Text style={{ fontSize: 22, color: '#FFF', alignSelf: 'center', backgroundColor: '#81d49c' }}>
                            Connect
                        </Text>
                    </TouchableHighlight>*/}
                    </ScrollView>
                </View>
                <TouchableOpacity
                    activeOpacity={0.75}
                    style={[styles.bottomToolBar, { borderTopWidth: Constant.window.onePR, width: screenW }]}
                    onPress={() => this._p(feed)}
                >
                    <Text style={{ fontSize: 22, color: '#FFF' }}>
                        Connect
                </Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({

    bottomToolBar: {
        height: 44,
        width: Constant.window.width,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopColor: '#ccc',
        position: 'absolute',
        bottom: 5,
        backgroundColor: global.gColors.buttonColor,
    },
    cardImageContent: {
        height: Constant.window.height - (Platform.OS === 'ios' ? 64 : 50) - 44,
        width: Constant.window.width,
        backgroundColor: global.gColors.bgColors,
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
