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
    FlatList,
    Modal
} from 'react-native'
import { CachedImage } from "react-native-img-cache";
import Header from '../../components/HomeNavigation';
import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import Constant from '../../common/constants';
import ServIndex from '../index';
import ServOffer from '../offer/title';
import ServRequest from '../request/title';
import Util from '../../common/utils';
import breakdown from '../../sys/others/breakdown';
import offline from '../../sys/others/offline';
import recommend from '../../friend/recommendUser'
const screenW = Dimensions.get('window').width;
const _image = {
    21: require('../../resource/industry/21.png'),
    22: require('../../resource/industry/22.png'),
    23: require('../../resource/industry/23.png'),
    24: require('../../resource/industry/24.png'),
    25: require('../../resource/industry/25.png'),
    26: require('../../resource/industry/26.png'),
    27: require('../../resource/industry/27.png'),
    28: require('../../resource/industry/28.png'),
    29: require('../../resource/industry/29.png'),
    30: require('../../resource/industry/30.png'),
    31: require('../../resource/industry/31.png'),
    32: require('../../resource/industry/32.png'),
    33: require('../../resource/industry/33.png'),
    34: require('../../resource/industry/34.png'),
    35: require('../../resource/industry/35.png'),
    36: require('../../resource/industry/36.png'),
    37: require('../../resource/industry/37.png'),
    38: require('../../resource/industry/38.png'),
    39: require('../../resource/industry/39.png'),
    40: require('../../resource/industry/40.png'),
    41: require('../../resource/industry/41.png'),
    42: require('../../resource/industry/42.png'),
    43: require('../../resource/industry/43.png'),
    44: require('../../resource/industry/44.png'),
    45: require('../../resource/industry/45.png'),
    46: require('../../resource/industry/46.png'),
    47: require('../../resource/industry/47.png'),
    48: require('../../resource/industry/48.png'),
    49: require('../../resource/industry/49.png'),
    50: require('../../resource/industry/50.png'),
    51: require('../../resource/industry/51.png'),
    52: require('../../resource/industry/52.png'),
    53: require('../../resource/industry/53.png'),
    54: require('../../resource/industry/54.png'),
    55: require('../../resource/industry/55.png'),
    56: require('../../resource/industry/56.png'),
    57: require('../../resource/industry/57.png'),
    58: require('../../resource/industry/58.png'),
    59: require('../../resource/industry/59.png'),
    60: require('../../resource/industry/60.png'),
    61: require('../../resource/industry/61.png'),
    62: require('../../resource/industry/62.png'),
    63: require('../../resource/industry/63.png'),
    64: require('../../resource/industry/64.png'),
    65: require('../../resource/industry/65.png'),
    66: require('../../resource/industry/66.png'),
    67: require('../../resource/industry/67.png'),
    68: require('../../resource/industry/68.png'),
    69: require('../../resource/industry/69.png'),
    70: require('../../resource/industry/70.png'),
    71: require('../../resource/industry/71.png'),
    72: require('../../resource/industry/72.png'),
    73: require('../../resource/industry/73.png'),
    76: require('../../resource/industry/73.png'),  
    77: require('../../resource/industry/73.png'),  
    78: require('../../resource/industry/73.png'),  
    79: require('../../resource/industry/73.png'),  
    80: require('../../resource/industry/73.png'),  
    81: require('../../resource/industry/73.png'),  
    82: require('../../resource/industry/73.png'),  
    83: require('../../resource/industry/73.png'),  
    84: require('../../resource/industry/73.png'),  
    85: require('../../resource/industry/73.png'),  
    86: require('../../resource/industry/73.png'),  
    87: require('../../resource/industry/73.png'),  
    88: require('../../resource/industry/73.png'),  
    89: require('../../resource/industry/73.png'),  
    90: require('../../resource/industry/73.png'),  
    91: require('../../resource/industry/73.png'),  
    92: require('../../resource/industry/73.png'),  
    93: require('../../resource/industry/73.png'),  
    94: require('../../resource/industry/73.png'),  
   
}
export default class navpage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            goods_catalog: "",
            goods_catalog_I: [],            
            user: this.props.user,  
            pwd: this.props.pwd,
            goods_tpye: this.props.goods_tpye,
            page: 0,
            showRecommendWay:false,
            recommendCatalogId: '',
            recommendCatalogName: ''
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
        let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_GOODS_CATALOG + global.user.authentication_token + `&level=1`;        
        Util.get(url,
            (response)=>{
                let goods_catalog_I = this.state.goods_catalog_I;
                goods_catalog_I = JSON.parse(response.feeds);
                global.goods_catalog_I = goods_catalog_I;
                this.setState({goods_catalog_I:goods_catalog_I})
                console.log(global.goods_catalog_I)
            },
            (error)=>{
                if(error.message == 'Network request failed'){
                    this.props.navigator.push({component: offline})
                }else{
                    this.props.navigator.push({component: breakdown})
                }
            }
        )    
    } 

    jump(goods_catalogs_id, goods_catalogs_name) {
        const { navigator } = this.props;
        if(this.props.recommendUser){
            this.setState({
                showRecommendWay:true,
                recommendCatalogId:goods_catalogs_id,
                recommendCatalogName:goods_catalogs_name
            })
        }else{
            console.log("this.state.goods_tpye:" + this.state.goods_tpye);
            if (this.state.goods_tpye == "serv_offer") {
                goods_tpye = this.state.goods_tpye;
                console.log("goods_catalogs_id" + goods_catalogs_id);
                navigator.resetTo({
                    component: ServOffer,
                    name: 'ServOffer',
                    passProps: { goods_catalogs_id, goods_catalogs_name, goods_tpye },
                })
            }
            else if (this.state.goods_tpye == "serv_request") {
                goods_tpye = this.state.goods_tpye;
                console.log("goods_catalogs_id" + goods_catalogs_id);
                navigator.resetTo({
                    component: ServRequest,
                    name: 'ServRequest',
                    passProps: { goods_catalogs_id, goods_catalogs_name, goods_tpye },
                })
            }
        }
    }
    _onBack = () => {        
        const { navigator } = this.props;
        if(this.props.recommendUser){
            navigator.pop();
        }else{
            navigator.resetTo({component: ServIndex, name: 'ServIndex'})
        }
    }
    _keyExtractor = (item, index) => item.id;
    recommendUser(){
        this.setState({
            showRecommendWay:false
        })
        this.props.navigator.push({
            component: recommend,
            passProps: {
                catalog_id:this.state.recommendCatalogId,
                catalog_name: this.state.recommendCatalogName
            }
        })
    }
    render() {
        let param = global.goods_catalog_I;
        let max = 0;
        this.state.page = (param) => { 
            for (let i = 0; i < param.length; i++) {
                if (param[i].goods_count > max) max = param[i].goods_count;
            }
            return max;
        }
        this.state.page = max;
        return (
            <View style={styles.listView}>
                {this.state.showRecommendWay?
                <View style={styles.cover}></View>
                :null}
                <Header
                    leftIconAction={this._onBack}
                    title='选择分类'
                    leftIcon={require('../../resource/ic_back_white.png')}
                /> 
                <ScrollableTabView
                    style={{ flex: 1 }}
                    tabBarActiveTextColor="#4a90e2"
                    tabBarInactiveTextColor="#9e9e9e"
                    tabBarUnderlineStyle={{ backgroundColor: '#4a90e2' }}
                    initialPage={this.state.page}
                    renderTabBar={() => <ScrollableTabBar />}
                >
                    {
                        this.state.goods_catalog_I.map((data_I, index) => {
                            let data_II = JSON.parse(data_I.goods_catalogs_II)
                            var dataArray =Array.from(data_II)
                            return (
                                <View tabLabel={data_I.name}  key={index} >
                                    {
                                        this.state.goods_tpye == "serv_request" ?
                                          <View style={styles.conclusionView}>
                                              <Image style={{ width: 24, height: 24, marginRight: 6 }} source={require('../../resource/b-people.png')} />
                                              <Text style={{ color: '#4A90E2', fontSize: 14, }}>
                                                  {data_I.goods_count}位奇客提供&nbsp;{data_I.name}类&nbsp;服务
                                              </Text>
                                          </View>
                                        :
                                        <View style={styles.conclusionView}>
                                            <Image style={{ width: 24, height: 24, marginRight: 6 }} source={require('../../resource/b-people.png')} />
                                            <Text style={{ color: '#4A90E2', fontSize: 14, }}>
                                                {data_I.request_count}位客户需要&nbsp;{data_I.name}类&nbsp;专业人士
                                            </Text>
                                        </View>
                                    }
                                    
                                    <FlatList
                                        data = {dataArray}
                                        keyExtractor={this._keyExtractor}
                                        style={{marginBottom:60}}
                                        removeClippedSubviews={false}
                                        renderItem = {(item)=>{
                                            return (
                                                    <TouchableOpacity key={item.item.id} onPress={() => { this.jump(item.item.id, item.item.name) }}>
                                                        <CachedImage style={{
                                                            width: screenW,
                                                            height: screenW/720*336,
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            }}
                                                            source={ _image[item.item.id]}>
                                                            {/*<Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: 16 }}>{d.name}&nbsp;</Text>*/}
                                                        </CachedImage>
                                                    </TouchableOpacity>
                                                );

                                        }}
                                    />
                                </View>
                            )
                        })
                    }
                </ScrollableTabView>
                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={this.state.showRecommendWay}
                >
                <View style={{flex: 1}}>
                    <View style={styles.modal}>
                        <TouchableOpacity 
                            style={[styles.modalItem, { justifyContent: 'center', alignItems: 'center', }]}
                        >
                            <Text 
                                style={[styles.modalText, {color: global.gColors.themeColor}]}>从通讯录添加</Text>
                        </TouchableOpacity>
                        <View style={{height: 0.5, backgroundColor: 'rgba(237,237,237,1)'}}></View>
                        <TouchableOpacity 
                            style={[styles.modalItem, { justifyContent: 'center', alignItems: 'center',}]}
                            onPress={this.recommendUser.bind(this)}
                        >
                            <Text style={[styles.modalText, {color: global.gColors.themeColor}]}>手动输入添加</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => this.setState({ showRecommendWay: false })} 
                            style={{ alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={styles.modalText}>取消</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                </Modal>    
            </View>

        )
    }
}

const styles = StyleSheet.create({
    cover: {
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        position: 'absolute', 
        top: 0, 
        left: 0, 
        height: global.gScreen.height, 
        width: global.gScreen.width, 
        zIndex: 99
    },
    container:{  
        flex:1,  
        backgroundColor: '#fff',   
        justifyContent:'center',  
        alignItems:'center'  
    },  
    modal: {
        marginTop: 300,
        width: global.gScreen.width,
        position: 'absolute',
        bottom: 0,
        height: 150, 
        borderTopWidth: 0,
        paddingHorizontal: 8, 
        backgroundColor: '#fff'
    },
        modalItem: {
        height: 56,
        justifyContent: 'center',
        marginHorizontal: 22
    },
    modalText: {
        fontSize: 16,
        color: 'black',
    },
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