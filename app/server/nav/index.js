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
    PixelRatio,
    Alert,
    Dimensions,
    ScrollView
} from 'react-native'
import { CachedImage } from "react-native-img-cache";
import Header from '../../components/HomeNavigation';
import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import Constant from '../../common/constants';
import ServIndex from '../index';
import ServOffer from '../offer/title';
import ServRequest from '../request/title';
const screenW = Dimensions.get('window').width;

export default class navpage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            goods_catalog: "",
            goods_catalog_I: [],            
            user: this.props.user,  
            pwd: this.props.pwd,
            goods_tpye: this.props.goods_tpye,
        }
    }

    componentWillMount() {
        if (global.goods_catalog_I === undefined) {
            this.getGoodsCatalog();
        }else{
            this.setState({goods_catalog_I:global.goods_catalog_I})
        }
    }

    async getGoodsCatalog(){
        try {
            let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_GOODS_CATALOG + global.user.authentication_token + `&level=1`;
  
            fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }).then(response => {
                if (response.status == 200) return response.json()
                return null
            }).then(responseData => {
                if (responseData) {
                    let goods_catalog_I = this.state.goods_catalog_I;
                    goods_catalog_I = JSON.parse(responseData.feeds);
                    global.goods_catalog_I = goods_catalog_I;
                    this.setState({goods_catalog_I:goods_catalog_I})
                } else {
                }
            }).catch(error => {
                console.log(`Fetch evaluating list error: ${error}`)
               
            })
        } catch (error) {
            this.setState({ error: error });
            this.setState({ showProgress: false });
        }      
    } 

    jump(goods_catalogs_id, goods_catalogs_name) {
        console.log("this.state.goods_tpye:" + this.state.goods_tpye);
        if (this.state.goods_tpye == "serv_offer") {
            const { navigator } = this.props;
            goods_tpye = this.state.goods_tpye;
            console.log("goods_catalogs_id" + goods_catalogs_id);
            navigator.resetTo({
                component: ServOffer,
                name: 'ServOffer',
                passProps: { goods_catalogs_id, goods_catalogs_name, goods_tpye },
            })
        }
        else if (this.state.goods_tpye == "serv_request") {
            const { navigator } = this.props;
            goods_tpye = this.state.goods_tpye;
            console.log("goods_catalogs_id" + goods_catalogs_id);
            navigator.resetTo({
                component: ServRequest,
                name: 'ServRequest',
                passProps: { goods_catalogs_id, goods_catalogs_name, goods_tpye },
            })
        }
    }
    _onBack = () => {        
        const { navigator } = this.props;
        navigator.resetTo({component: ServIndex, name: 'ServIndex'})
    }

    render() {
        return (
            <View style={styles.listView}>
                <Header
                    leftIconAction={() => this.props.navigator.resetTo({component: ServIndex, name: 'ServIndex'})}
                    title='选择分类'
                    leftIcon={require('../../resource/ic_back_white.png')}
                />
                <ScrollableTabView
                    style={{ flex: 1 }}
                    tabBarActiveTextColor="#4a90e2"
                    tabBarInactiveTextColor="#9e9e9e"
                    tabBarUnderlineStyle={{ backgroundColor: '#4a90e2' }}
                    initialPage={2}
                    renderTabBar={() => <ScrollableTabBar />}
                >
                    {
                        this.state.goods_catalog_I.map((data, index) => {
                            return (
                                <View tabLabel={data.name}  key={index}>
                                    {
                                        this.state.goods_tpye == "serv_request" ?
                                          <View style={styles.conclusionView}>
                                              <Image style={{ width: 24, height: 24, marginRight: 6 }} source={require('../../resource/b-people.png')} />
                                              <Text style={{ color: '#1b2833', fontSize: 14, }}>
                                                  {data.goods_count}位奇客提供&nbsp;{data.name}类&nbsp;服务
                                              </Text>
                                          </View>
                                        :
                                        <View style={styles.conclusionView}>
                                            <Image style={{ width: 24, height: 24, marginRight: 6 }} source={require('../../resource/b-people.png')} />
                                            <Text style={{ color: '#1b2833', fontSize: 14, }}>
                                                {data.request_count}位客户需要&nbsp;{data.name}类&nbsp;专业人士
                                            </Text>
                                        </View>
                                    }
                                    
                                    <ScrollView>
                                        {
                                            JSON.parse(data.goods_catalogs_II).map((d, i) => {
                                                return (
                                                    <TouchableOpacity key={i} onPress={() => { this.jump(d.id, d.name) }}>
                                                        <CachedImage style={{
                                                            width: screenW,
                                                            height: 150,
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                        }}
                                                                     source={{ uri: d.image }}>
                                                            <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: 16 }}>{d.name}&nbsp;</Text>
                                                        </CachedImage>
                                                    </TouchableOpacity>
                                                );
                                            })
                                        }
                                    </ScrollView>
                                </View>
                            )
                        })
                    }
                </ScrollableTabView>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    listView: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        height: 200
    }, tabView: {
        flex: 1,
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.01)',
    },
    card: {
        borderWidth: 1,
        backgroundColor: '#fff',
        borderColor: 'rgba(0,0,0,0.1)',
        margin: 5,
        height: 150,
        padding: 15,
        shadowColor: '#ccc',
        shadowOffset: { width: 2, height: 2, },
        shadowOpacity: 0.5,
        shadowRadius: 3,
    },
    conclusionView: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
});
