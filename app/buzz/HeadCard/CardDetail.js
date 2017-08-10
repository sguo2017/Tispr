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
import { MapView, MapTypes, Geolocation } from 'react-native-baidu-map';
import Header from '../../components/HomeNavigation';
import Swiper from 'react-native-swiper';
import Constant from '../../common/constants';
import ConnectPage from './ConnectPage'
import { CachedImage } from "react-native-img-cache";
const screenW = Dimensions.get('window').width;

export default class CardDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            offerList: [],
            bidderList: [],
            bidderListLength: 0,
        }
    }


    _p() {
        this.props.navigator.push({
            component: ConnectPage,
            passProps: {feed:this.props.feed, callback: this.props.callback, discardIndex:this.props.discardIndex}
        })
    }

    componentWillMount() {
        // this._getSameTypeOffer();
        this._getbidder();
    }
    componentDidMount() {
        let longitude = 116.406568, latitude = 39.915156 //缺省是天安门位置
        if (this.props.feed.latitude != undefined || this.props.feed.longitude != undefined) {
            longitude = Number(this.props.feed.longitude), latitude = Number(this.props.feed.latitude)
        }
        Geolocation.getCurrentPosition().then(
            (data) => {
                this.setState({
                    zoom: 18,
                    markers: [{
                        latitude: data.latitude,
                        longitude: data.longitude,
                        title: '我的位置'
                    }, {
                        longitude: longitude,
                        latitude: latitude,
                        title: "对方位置"
                    }],
                    center: {
                        latitude: latitude,
                        longitude: longitude,
                    }
                })
            }
        ).catch(error => {
            console.warn(error, 'error')
        })

    }
    async _getbidder(){
        let serv_id =this.props.feed.serv_id;
        try {
            let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_ORDER_LIST + `${global.user.authentication_token}&scence=${Constant.order_qry_type.BIDDER}&serv_id=${serv_id}`;
            // console.log("148:"+url)
            fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }).then(response => {
                // console.log("156:"+JSON.stringify(response))
                if (response.status == 200) return response.json()
                return null
            }).then(responseData => {      
                let bidderList = this.state.bidderList;          
                bidderList = JSON.parse(responseData.feeds);
                this.setState({
                    bidderList: bidderList,
                    bidderListLength: bidderList.length
                })
            }).catch(error => {
                console.log(`Fetch evaluating list error: ${error}`)             
            })
        } catch (error) {
            console.log(`Fetch evaluating list error: ${error}`)
        }      
    }

    async _getSameTypeOffer(){
        let catalog_id =this.props.feed.goods_catalog_id
        console.log("51:"+catalog_id)
        try {
            let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_SERV_OFFER_INDEX +global.user.authentication_token + `&catalog_id=`+`${catalog_id}`;
            // console.log("148:"+url)
            fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }).then(response => {
                // console.log("156:"+JSON.stringify(response))
                if (response.status == 200) return response.json()
                return null
            }).then(responseData => {      
                let offerList =this.state.offerList          
                offerList = JSON.parse(responseData.feeds);
                this.setState({
                    offerList:offerList,
                });
            }).catch(error => {
                console.log(`Fetch evaluating list error: ${error}`)             
            })
        } catch (error) {
            console.log(`Fetch evaluating list error: ${error}`)
        }      
    }


    render() {
        const { feed } = this.props;
        let _images = feed.serv_images.split(',');
        let platformMargin = Platform.OS === 'ios' ? -40 : -30;
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <Header
                    leftIconAction={() => this.props.navigator.pop()}
                    title='需求'
                    leftIcon={require('../../resource/ic_back_white.png')}
                />

                <View style={[styles.cardImageContent]}>
                    <ScrollView>
                    <View style={{paddingHorizontal: 16, justifyContent: 'space-between', backgroundColor: 'white'}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, height: 48, }}>
                            <View style={{justifyContent: 'space-around', flexDirection: 'row',}}>
                                <Image style={{width: 32, height: 32, borderRadius: 16}} source={{ uri: feed.avatar }} defaultsource={require('../../resource/user_default_image.png')}></Image>
                                <View style={{marginLeft: 8, marginTop: -5}}>
                                    <Text style={{fontSize: 14, lineHeight: 20}}>{feed.user_name}</Text>
                                    {
                                        feed.catalog?
                                        <Text style={{color: '#999999', fontSize: 12}}>{feed.catalog}</Text>
                                        :<Text style={{color: '#999999', fontSize: 12}}>其它分类</Text>
                                    }
                        
                                </View>
                            </View>
                            <View>
                                <Text style={{color: '#999999', fontSize: 12}}>{feed.created_at.substring(0,10)}</Text>
                            </View> 
                        </View>
                         {
                            _images.length == 1?
                            <Image style={{height: 300, width: 328, marginBottom: 10}}  source={{uri: _images[0]}}></Image>
                            :
                            <Swiper height={320} paginationStyle={{alignSelf:'center'}}>
                                {
                                     _images.map((data, index)=> {
                                         return(
                                            <Image style={{height: 300, width: 328, marginBottom: 10}}  key={index} source={{uri: data}}></Image>
                                     )
                                    })   
                                }                                                               
                            </Swiper>
                        }
                        <Text style={{color: '#424242', fontSize: 16, lineHeight: 24}}>{feed.serv_detail}</Text> 
                        <MapView
                            trafficEnabled={this.state.trafficEnabled}
                            baiduHeatMapEnabled={this.state.baiduHeatMapEnabled}
                            zoom={this.state.zoom}
                            mapType={this.state.mapType}
                            center={this.state.center}
                            marker={this.state.marker}
                            markers={this.state.markers}
                            style={styles.map}
                            onMarkerClick={(e) => {
                                console.warn(JSON.stringify(e));
                            }}
                            onMapClick={(e) => {
                            }}
                        >
                        </MapView>
                        <View style={{flexDirection: 'row', marginTop: 20, height: 48, justifyContent: 'space-between'}}>
                            <Text style={{fontSize: 16, color: 'black'}}>投标&nbsp;&nbsp;&nbsp;{this.state.bidderListLength}</Text>
                            <TouchableOpacity style={{backgroundColor: '#4A90E2', borderRadius: 2, height: Platform === 'ios'?35:28, width: 72}}>
                                <Text style={{color: 'white', marginHorizontal: 8, marginVertical: 4}}>增加投标</Text>
                            </TouchableOpacity>
                        </View>                                                                    
                    </View>
                    <View style={{backgroundColor: '#FFFFFF',  flexDirection: 'row',flexWrap: 'wrap', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12}}>
                    
                    {
                        this.state.bidderList.map((data, index)=>{
                            return(
                                    <Image  key={index} source={{uri: data.offer_user_avatar}} style={{borderRadius: 20, width: 40, height: 40, margin: 10}}></Image>
                            ) 
                        })
                    }
                    </View>
                    <View style={{backgroundColor: 'white', paddingTop: 23, paddingBottom: 10}}>
                        <TouchableOpacity style={{backgroundColor: '#FFC400', borderRadius: 4, height: 44, marginHorizontal: 16, paddingHorizontal: 138, paddingVertical: 10}}
                            onPress={() => this._p(feed)}
                        >
                            <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>联系TA</Text>
                        </TouchableOpacity>
                    </View>
                    {/*<View style={{justifyContent: 'space-around', alignItems: 'center', marginTop: 12}}>
                       <Text style={{color: '#9E9E9E', fontSize: 14}}>相关服务</Text>
                    </View>
                    <View style ={{flexDirection: 'row',flexWrap:'wrap'}}>
                    {
                        
                        this.state.offerList.map((data,index)=>{
                            return(
                                <OfferItem 
                                    key={`${data.id}-${index}` }
                                    offer={data}                                  
                                />
                            )                      
                        })
                        
                    }
                    </View>*/}
                </ScrollView>
                </View>
            </View>
        )
    }
}
const OfferItem = ({
  offer
}) => {
  let width = (screenW - 24) / 2;
  let imageH = 120;
  let offerUser = offer.user;
  let serv_image = offer.serv_images && offer.serv_images != 'undefined' ? {uri: offer.serv_images.split(',')[0]} : require('../../resource/qk_nav_default.png');
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={styles.cardContainer}
    >
      <CachedImage
        style={{ width: width, height: imageH }}
        defaultSource={require('../../resource/qk_nav_default.png')}
        source={serv_image}
      />
      <View style={{
        width: width,
        paddingHorizontal: 15,
        paddingVertical: 8,
      }}>
        <Text style={{ fontSize: 14, color: '#1b2833', marginBottom: 4 }} numberOfLines={2}>{offer.serv_title}</Text>
        <Text style={{ fontSize: 12, color: '#999999', marginBottom: 4 }}>{offer.catalog}</Text>
        <View style={{ flexDirection:'row' }}>
          <Image style={{ width: 12, height: 12 }} source={require('../../resource/g-location-s.png')}/>
          <Text style={{ fontSize: 12, color: '#b8b8b8' }}>{offer.district}</Text>
        </View>
      </View>
      <View style={styles.cardUserInfoView}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <CachedImage
            style={{height: 22, width: 22, borderRadius: 15}}
            source={{uri: offerUser.avatar}}
            defaultSource={require('../../resource/img_default_avatar.png')}
          />
          <Text
            style={{fontSize: 14, color: 'gray', marginLeft: 8, width: width * 0.4}}
            numberOfLines={1}
          >
            {offerUser.name}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.75}
        >
          <Image style={{height: 18, width: 18}} source={require('../../resource/y-chat.png')}/>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
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
    },
    cardContainer: {
        width: (screenW - 24) / 2,
        margin: 4,
        backgroundColor: '#fff',
        borderRadius: 4,
        overflow: 'hidden',
    },
    cardUserInfoView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderTopWidth: 0.5,
        borderColor: '#eeeeee',
    },
    map: {
        width: Dimensions.get('window').width - 40,
        height: Dimensions.get('window').height - 500,
        marginBottom: 10,
    },
})
