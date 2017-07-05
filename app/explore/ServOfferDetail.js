import React, {PureComponent} from 'react'
import {
    StyleSheet,
    View,
    Text,
    Image,
    ListView,
    TouchableOpacity,
    RefreshControl,
    Dimensions,
    ScrollView,
    Modal
} from 'react-native'
import { observer } from 'mobx-react/native'
import { reaction } from 'mobx'
import { connect } from 'react-redux';
import { CachedImage } from "react-native-img-cache";
import Loading from '../components/Loading'
import LoadMoreFooter from '../components/LoadMoreFooter'
import Toast from 'react-native-easy-toast'
import Header from '../components/HomeNavigation';
import Connect from '../buzz/Connect'
import Constant from '../common/constants';
const screenW = Dimensions.get('window').width;


@observer
export default class ServOfferDetail extends PureComponent {
     constructor(props) {
         super(props);
         this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            show: false,
            offerList:[],
        }
     }
      _p = feed => {
         this.props.navigator.push({
             component: Connect,
             passProps: { feed }
         })
      }
    componentWillMount() {
        this._getSameTypeOffer();
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
        return (
            <View style={styles.listView}>
                <Header
                    title='服务'
                    leftIcon={require('../resource/w-back.png')}
                    leftIconAction={() => this.props.navigator.pop()}
                    rightIcon={require('../resource/w-more.png')}
                    rightIconAction={() => this.setState({show: true})}
                    style={{height: 50}}
                />
                <ScrollView>
                    <View style={{paddingHorizontal: 16, justifyContent: 'space-between', backgroundColor: 'white'}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, height: 48, }}>
                            <View style={{justifyContent: 'space-around', flexDirection: 'row',}}>
                                <Image style={{width: 32, height: 32, borderRadius: 16}} source={{uri: feed.user.avatar}} defaultsource={require('../resource/user_default_image.png')}></Image>
                                <View style={{marginLeft: 8, marginTop: -5}}>
                                    <Text style={{fontSize: 14, lineHeight: 20 ,color: '#000'}}>{feed.user.name}</Text>
                                    {
                                        feed.catalog?
                                        <Text style={{color: '#999999', fontSize: 12}}>{feed.catalog}</Text>
                                        :<Text style={{color: '#999999', fontSize: 12}}>视频</Text>
                                    }
                        
                                </View>
                            </View>
                            <View>
                                <Text style={{color: '#999999', fontSize: 12}}>{feed.created_at.substring(0,10)}</Text>
                            </View> 
                        </View>
                        <Text style={{color: '#000', fontSize: 18, lineHeight: 24}}>{feed.serv_title}</Text>
                        <Text style={{color: '#999999', fontSize: 14, lineHeight: 24}}>{feed.serv_detail}</Text>
                        {
                            feed.serv_images?<ListView
                            dataSource={this.state.dataSource.cloneWithRows(feed.serv_images.split(','))}
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

                    <View style={{justifyContent: 'space-around', alignItems: 'center', marginTop: 12}}>
                       <Text style={{color: '#9E9E9E', fontSize: 14}}>相关服务</Text>
                    </View>
                    <View style ={{flexDirection: 'row', flexWrap:'wrap'}}>
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
                    </View>
                </ScrollView>
                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={this.state.show}
                    onShow={() => { }}
                    onRequestClose={() => { }}>
                    <View style={styles.modal}>
                        <View style={styles.share}>
                            <TouchableOpacity style={styles.item}>
                                <Image source={require('../resource/ico-wechat.png')} style={styles.img}></Image>
                                <Text style={styles.text}>微信</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.item}>
                                <Image source={require('../resource/ico-friend.png')} style={styles.img}></Image>
                                <Text style={styles.text}>朋友圈</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.item}>
                                <Image source={require('../resource/ico-qq.png')} style={styles.img}></Image>
                                <Text style={styles.text}>QQ</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Image source={require('../resource/ico-weibo.png')} style={styles.img}></Image>
                                <Text style={styles.text}>新浪微博</Text>
                            </TouchableOpacity>       
                        </View>
                        <TouchableOpacity onPress={() => this.setState({show: false})} style={{height: 57, width: 300, marginTop: 30}}>
                            <Text style={styles.cancel}>取消</Text> 
                        </TouchableOpacity>                    
                    </View>

                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    listView: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    modal: {
        marginTop: 350,
        height: 250,
        backgroundColor: 'white',
        padding: 30,
    },
    share: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20
    },
    item: {
        marginRight: 40,
        flexDirection: 'column',
        alignItems: 'center'
    },
    img: {
        height: 48,
        width: 48,
    },
    text: {
        fontSize: 12,
        color: '#1B2833',
    },
    cancel: {
        color: '#1B2833',
        fontSize: 16,
        marginTop: 30,
        marginHorizontal: 132
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
})

const OfferItem = ({
  offer
}) => {
  let width = (screenW - 24) / 2;
  let imageH = 120;
  let offerUser = offer.user;
  let serv_image = offer.serv_images && offer.serv_images != 'undefined' ? {uri: offer.serv_images.split(',')[0]} : require('../resource/qk_nav_default.png');
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={styles.cardContainer}
    >
      <CachedImage
        style={{ width: width, height: imageH }}
        defaultSource={require('../resource/qk_nav_default.png')}
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
          <Image style={{ width: 12, height: 12 }} source={require('../resource/g-location-s.png')}/>
          <Text style={{ fontSize: 12, color: '#b8b8b8' }}>{offer.district}</Text>
        </View>
      </View>
      <View style={styles.cardUserInfoView}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <CachedImage
            style={{height: 22, width: 22, borderRadius: 15}}
            source={{uri: offerUser.avatar}}
            defaultSource={require('../resource/img_default_avatar.png')}
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
          <Image style={{height: 18, width: 18}} source={require('../resource/y-chat.png')}/>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

