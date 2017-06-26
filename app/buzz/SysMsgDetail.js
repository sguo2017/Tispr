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
    Alert,
    ListView
} from 'react-native';
import Header from '../components/HomeNavigation';
import Constant from '../common/constants';
import Connect from './Connect'

const screenW = Dimensions.get('window').width;

export default class SysMsgDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFavorited: this.props.feed.isFavorited,
            favorite_id: this.props.feed.favorite_id,
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
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
                  global.user.favorites_count++;
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
                global.user.favorites_count++;
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
                    leftIcon={require('../resource/ic_back_white.png')}
                    rightIcon={this.state.isFavorited?require('../resource/ic_account_favour.png'):require('../resource/ic_news_collect.png')}
                    rightIconSize={30}
                    rightIconAction={() => this._switch(this.state.isFavorited, this.state.favorite_id)}
                />

                <View style={[styles.cardImageContent]}>
                    <ScrollView>
                        <View style={{paddingHorizontal: 16, justifyContent: 'space-between', backgroundColor: 'white'}}>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, height: 48, }}>
                                <View style={{justifyContent: 'space-around', flexDirection: 'row',}}>
                                    <Image style={{width: 32, height: 32, borderRadius: 16}} source={{ uri: feed.user.avatar }} defaultsource={require('../resource/user_default_image.png')}></Image>
                                    <View style={{marginLeft: 8, marginTop: -5}}>
                                        <Text style={{fontSize: 14, lineHeight: 20}}>{feed.user_name}</Text>
                                        {
                                            feed.serv_offer.catalog?
                                            <Text style={{color: '#999999', fontSize: 12}}>{feed.serv_offer.catalog}</Text>
                                            :<Text style={{color: '#999999', fontSize: 12}}>其它分类</Text>
                                        }
                            
                                    </View>
                                </View>
                                <View>
                                    <Text style={{color: '#999999', fontSize: 12}}>{feed.created_at.substring(0,10)}</Text>
                                </View> 
                            </View>
                            <Text style={{color: '#424242', fontSize: 16, lineHeight: 24}}>{feed.serv_offer.serv_detail}</Text>
                            {
                                feed.serv_offer.serv_images?<ListView
                                dataSource={this.state.dataSource.cloneWithRows(feed.serv_offer.serv_images.split(','))}
                                renderRow={(rowData) =>
                                    <Image defaultSource={require('../resource/img_default_home_cover.png')} source={{uri:rowData}} style={{height: 300, width: 328, marginBottom: 10}}></Image>
                                }/>: <View></View>
                            }                                                                     
                        </View>
                
                            {
                                feed.user_id == global.user.id?
                                <View></View>:
                                <View style={{backgroundColor: 'white', paddingTop: 23, paddingBottom: 10}}>
                                    <TouchableOpacity style={{backgroundColor: '#FFC400', borderRadius: 4, height: 44, marginHorizontal: 16, paddingHorizontal: 138, paddingVertical: 10}}
                                        onPress={() => this._p(feed)}
                                    >
                                        <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>联系TA</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                    </ScrollView>
                </View>
                
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
