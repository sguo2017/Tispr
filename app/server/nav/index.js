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
    PixelRatio,
    Alert,
    Dimensions,
    ScrollView
} from 'react-native'
import Header from '../../components/HomeNavigation';
import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import Constant from '../../common/constants';

import ServOffer from './index';
const screenW = Dimensions.get('window').width;
export default class navpage extends Component {

    constructor(props){
        super(props);

        this.state = {
            goods_catalog: "request",
            goods_catalog_I: [],
        }
    }

    componentDidMount() {
        this.getGoodsCatalog();
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
                    console.log("goods_catalog_I:"+JSON.stringify(goods_catalog_I))
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

    render() {
        return (
            <View style={styles.listView}>
                <Header
                    leftIconAction={() => this.props.navigator.pop()}
                    title='Chose a Category'
                    leftIcon={require('../../resource/ic_back_dark.png')}
                    rightIconAction={() => { const { navigator } = this.props; navigator.push({ name: "ServOffer", component: ServOffer }) }}
                    rightIcon={require('../../resource/ic_contrast_add.png')}
                />
                <ScrollableTabView
                    style={{ marginTop: 20, }}
                    initialPage={2}
                    renderTabBar={() => <ScrollableTabBar />}
                >
                    {
                        this.state.goods_catalog_I.map((data, index) => {
                            return (
                                <View tabLabel={data.name}>
                                    <Text style={{color:'black',padding: 16,fontSize:16,backgroundColor:'#b0b0b0'}}>
                                    <Text>{data.goods_count}</Text>
                                    位客户需要&nbsp;<Text>{data.name}</Text>类&nbsp;专业人士
                                    </Text>
                                    <ScrollView>
                                    {   
                                        JSON.parse(data.goods_catalogs_II).map((d, i) => {
                                            return (
                                                <View style={{marginBottom:5}}>
                                                    <Image style={{width:screenW, height:150,borderRadius:10,
                                                    flexDirection:'column-reverse'}} 
                                                    source={require('../../resource/qk_nav_default.png')}>                                                   
                                                            <Text style={{color:'white',fontSize:20,margin:10}}>{d.name}&nbsp;</Text>
                                                    </Image>    
                                                </View>
                                            )
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
})