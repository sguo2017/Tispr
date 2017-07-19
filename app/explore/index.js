import React, { PureComponent } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  ListView,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Platform,
  Modal,
  TouchableHighlight,
  Dimensions,
  ScrollView
} from 'react-native';
import { MapView, MapTypes, Geolocation } from 'react-native-baidu-map';
import Picker from 'react-native-picker';
import { fetchExploreList } from '../actions/ServOfferListActions';
import { connect } from 'react-redux';
import ServOfferList from './ServOfferList';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabCategoryBar from '../me/TabCategoryBar';
import Constant from '../common/constants'
import area from '../sys/others/area.json'
const titles = ['本地','远程', ];
var goods_catalogs_II=[];
var goods_catalogs_II_id=[];
class ExploreList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            tabName: this.props.tabName,
            sortBy: this.props.sortBy,
            transiSortBy: this.props.transiSortBy,
            classify: this.props.classify,
            transiClassify: this.props.transiClassify,
            location: this.props.location,
            transiLocation: this.props.transiLocation,
            exploreparams: {},
            exploretitle:'',
            sps: [false, false, false, false],//排序按钮操作
            cps: [false, false, false, false, false, false, false],//类型按钮操作
            searchText: this.props.searchText,
            via: 'remote',
            initArea: ['广东', '广州', '番禺区'],
            zoom: 18
        };
    }
    componentWillMount() {
        const { feed } = this.props;
        this.setState({
            show: false,
            tabName: this.props.tabName,
            sortBy: '综合排序',
            transiSortBy: '综合排序',
            classify: '全部人才',
            transiClassify: '全部人才',
            location: '广州',
            transiLocation: '广州',
            searchText: ''
        });
        if(this.props.city){
            this.setState({
                location: this.props.city
            });
        }
        if (global.goods_catalog_I === undefined) {
            this.getGoodsCatalog();
        }
    }

    componentDidMount() {
        let longitude = global.user.addressComponent.longitude, latitude = global.user.addressComponent.latitude;
        
        Geolocation.getCurrentPosition().then(
            (data) => {
                this.setState({
                    zoom: 18,
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

    async getGoodsCatalog() {
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
                    for(let i = 0;i< goods_catalog_I.length;i++){
                        let ids=[];
                        goods_catalogs_II[i] = JSON.parse(goods_catalog_I[i].goods_catalogs_II);
                        for(let j=0;j < goods_catalogs_II[i].length;j++){
                            if(goods_catalogs_II[i][j].id)
                                ids.push(goods_catalogs_II[i][j].id);
                        }
                        goods_catalogs_II_id[i]=ids;
                    }
                    global.goods_catalogs_II_id = goods_catalogs_II_id;
                    //console.log("goods_catalog_I:"+JSON.stringify(goods_catalog_I))
                } else {
                }
            }).catch(error => {
                console.log(`Fetch evaluating list error: ${error}`)

            })
        } catch (error) {
            console.log("error:" + error)
        }
    }
    refresh() {
        const { dispatch, categoryId } = this.props;
        page = 1;
        let exploreparams = this.state.exploreparams;
        let goods_catalog = this.state.cps;

        if(this.state.transiSortBy == "最近发布")
            exploreparams.sort_by = "created_at"
        if(this.state.transiSortBy == "最多收藏")
            exploreparams.sort_by = "favorites_count"
        if(this.state.transiSortBy == "最多联系")
            exploreparams.sort_by = "order_cnt"
        if(this.state.via == 'local'){
            exploreparams.via = 'local'
        }
        if(this.state.via == 'remote'){
            exploreparams.via = 'remote'
        }
        exploreparams.city = this.state.location;
        if (goods_catalog[0]) {
            goods_catalog.map((item, index, input) => { input[index] = true });
        }
        let goods_catalog_paramas = [];
        goods_catalog.map((item, index, input) => {
            if (item&&index>0) {
                goods_catalog_paramas=goods_catalog_paramas.concat(goods_catalogs_II_id[index-1]);
            }
        });
        exploreparams.goods_catalog_I = goods_catalog_paramas.length === 0 ? undefined : goods_catalog_paramas;
        dispatch(fetchExploreList(page, exploreparams));
    }

    _createAreaData() {
        let data = [];
        let len = area.length;
        for(let i=0;i<len;i++){
            let city = [];
            for(let j=0,cityLen=area[i]['city'].length;j<cityLen;j++){
                let _city = {};
                _city[area[i]['city'][j]['name']] = area[i]['city'][j]['area'];
                city.push(_city);
            }

            let _data = {};
            _data[area[i]['name']] = city;
            data.push(_data);
        }
        return data;
    }

    _showAreaPicker() {
        Picker.init({
            pickerData: this._createAreaData(),
            selectedValue: this.state.initArea,
            onPickerConfirm: pickedValue => {
                console.log('area', pickedValue);
                this.setState({
                    initArea: pickedValue,
                });
                Geolocation.geocode(pickedValue[1]+"市", pickedValue[2])
                .then((response)=>{
                    // let lat = response.latitude;
                    // let lng = response.longitude;


                    this.setState({
                        zoom: 18,
                        center: {
                            latitude: response.latitude,
                            longitude: response.longitude,
                            rand: Math.random()
                        }
                    });                    
                    console.log("新地址的经度："+response.longitude)
                    // Geolocation.moveToCenter(lat, lng , 16)
                })
                .catch(error => {
                    console.warn(error, 'error')
                })    
            },
            onPickerCancel: pickedValue => {
                console.log('area', pickedValue);
            },
            pickerTitleText: '选择位置',
            pickerCancelBtnText: '取消',
            pickerConfirmBtnText: '确定',
        });
        Picker.show();
    }


    render() {
        let page = this.state.via =='local'?0:1
        return (
          <View style={styles.listView}>
              <View style={styles.container}>
                  <View style={styles.searchBox}>
                      <Image source={require('../resource/w-search.png')} style={styles.searchIcon} />
                      <TextInput style={styles.inputText}
                         underlineColorAndroid='transparent'
                         keyboardType='web-search'
                         value={this.state.exploretitle}
                         placeholder='搜索'
                         returnKeyType = 'search'
                         returnKeyLabel = 'search'
                         placeholderTextColor='white'
                         selectTextOnFocus ={true}
                         onSubmitEditing = {() => this.refresh()}
                         onChangeText={(val) => {
                             let explore = this.state.exploreparams;
                             explore.title = val;
                             this.setState({ exploreparams: explore, exploretitle:val })
                         }}
                      />
                </View>
                  {
                      this.state.exploretitle == ''?
                    <TouchableOpacity style={{ marginLeft: 17, marginRight: 8 }} onPress={() => this.refresh()}>
                        <Image source={require('../resource/w-content.png')} style={styles.scanIcon} />
                    </TouchableOpacity>
                    :
                    <View style={{ marginLeft: 17, marginRight: 8 }} >
                        <Text style={{color: '#fff'}} onPress={() =>{this.setState({exploreparams: {},exploretitle: ''});this.state.exploreparams={}; this.refresh()}}>取消</Text>
                    </View>
                  }
              </View>
              <View style={{ flexDirection: 'row', paddingVertical: 6, backgroundColor: 'rgba(0,0,0,0.16)'}}>
                  <TouchableOpacity style={styles.filterButton} onPress={() => {this.setState({ tabName: 'recentPublish', show: true });}}>
                      <Text style={styles.whiteText}>{this.state.sortBy}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.filterButton} onPress={() => {this.setState({ tabName: 'allTalentedPeople', show: true });}}>
                      <Text style={styles.whiteText}>{this.state.classify}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.filterButton} onPress={() => {this.setState({ tabName: 'selectLocation', show: true });}}>
                      <Image source={require('../resource/w-location.png')} style={{ width: 14, height: 14 }}></Image>
                      <Text style={styles.whiteText}>{this.state.location}</Text>
                  </TouchableOpacity>
              </View>
              <ServOfferList exploreparams={this.state.exploreparams} cps={this.state.cps} location={this.state.location} {...this.props} />
              <Modal
                animationType='slide'
                transparent={true}
                visible={this.state.show}
                onShow={() => { }}
                onRequestClose={() => { }} >
                  {
                      this.state.tabName == 'index' ?
                        <View style={styles.modalStyle}>
                            <View style={styles.subView}>
                                <View style={styles.modalHead}>
                                    <TouchableOpacity onPress={() => this.setState({ cps: [true, false, false, false, false, false, false], transiSortBy: '综合排序', transiClassify: '全部分类' })}>
                                        <Text style={styles.themeColorText}>重置</Text>
                                    </TouchableOpacity>

                                    <Text style={{ color: 'black', fontSize: 16 }}>筛选</Text>
                                    <TouchableOpacity onPress={() => this.setState({ show: false })}>
                                        <Text style={styles.themeColorText}
                                              onPress=
                                                {() => {this.setState({
                                                    sortBy: this.state.transiSortBy,
                                                    classify: this.state.transiClassify,
                                                    location: this.state.initArea[1]+"市",
                                                    show: false,
                                                });
                                                this.state.location = this.state.initArea[1]+"市";
                                                this.refresh();
                                                }}
                                        >完成</Text>
                                    </TouchableOpacity>
                                </View>
                                <ScrollableTabView
                                  style={{ marginTop: 20, marginRight: 5, marginLeft: 5, borderRadius: 5 }}
                                  renderTabBar={() => <TabCategoryBar tabNames={titles} />}
                                  tabBarPosition='top'
                                  scrollWithoutAnimation={false}
                                  tabBarBackgroundColor= '#1B2833'
                                  ref={(tabView) => { this.tabView = tabView; }}
                                  onChangeTab ={({i, ref, from, })=>{
                                      if(i==0){
                                          this.state.via = 'local';
                                          }
                                          
                                      else if(i==1){
                                          this.state.via = 'remote';
                                          }
                                          }}
                                >
                                    <View tabLabel='本地'>
                                        <View style={{ flexDirection: 'row' }}>
                                            <TouchableOpacity onPress={() => this.setState({ tabName: 'recentPublish' })} style={styles.filterRow}>
                                                <Text style={styles.blackText}>排序</Text>
                                                <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                                                    <Text style={styles.greyText}>{this.state.transiSortBy}</Text>
                                                    <Image source={require('../resource/g_chevron right.png')} />
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{borderTopWidth: 1, borderTopColor: '#f0f0f0'}}></View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <TouchableOpacity onPress={() => this.setState({ tabName: 'allTalentedPeople' })} style={styles.filterRow}>
                                                <Text style={styles.blackText}>类型</Text>
                                                <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                                                    <Text style={styles.greyText}>{this.state.transiClassify}</Text>
                                                    <Image source={require('../resource/g_chevron right.png')} />
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{borderTopWidth: 1, borderTopColor: '#f0f0f0'}}></View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <TouchableOpacity onPress={() => this.setState({ tabName: 'selectLocation' })} style={styles.filterRow}>
                                                <Text style={styles.blackText}>位置</Text>
                                                <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                                                    <Text style={styles.greyText}>{this.state.initArea[1]}</Text>
                                                    <Image source={require('../resource/g_chevron right.png')} />
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View tabLabel='远程'>
                                        <View style={{ flexDirection: 'row' }}>
                                            <TouchableOpacity onPress={() => this.setState({ tabName: 'recentPublish' })} style={styles.filterRow}>
                                                <Text style={styles.blackText}>排序</Text>
                                                <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                                                    <Text style={styles.greyText}>{this.state.transiSortBy}</Text>
                                                    <Image source={require('../resource/g_chevron right.png')} />
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{borderTopWidth: 1, borderTopColor: '#f0f0f0'}}></View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <TouchableOpacity onPress={() => this.setState({ tabName: 'allTalentedPeople' })} style={styles.filterRow}>
                                                <Text style={styles.blackText}>类型</Text>
                                                <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                                                    <Text style={styles.greyText}>{this.state.transiClassify}</Text>
                                                    <Image source={require('../resource/g_chevron right.png')} />
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </ScrollableTabView>
                            </View>
                        </View>
                        : <View></View>
                  }

                  {
                      this.state.tabName == 'recentPublish' ?
                        <View style={styles.modalStyle}>
                            <View style={styles.subView}>
                                <View style={styles.modalHead}>
                                    <TouchableOpacity onPress={() => this.setState({ tabName: 'index' })}>
                                        <Text style={styles.themeColorText}>返回</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.blackText}>选择排序</Text>
                                    <TouchableOpacity onPress={() => this.setState({ tabName: 'index' })}>
                                        <Text style={styles.themeColorText}>确定</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ marginTop: 20, marginBottom: 20, marginLeft: 12 }}>
                                    <TouchableOpacity
                                      style={[styles.selectButton, { backgroundColor: global.gColors.themeColor }]}
                                    >
                                        <Text style={[styles.whiteText]}>全部排序</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: 12 }}>
                                    <TouchableOpacity
                                      style={[styles.selectButton, this.state.sps[1] && { backgroundColor: global.gColors.themeColor }]}
                                      onPress={() => { this.setState({ transiSortBy: '最近发布', sps: [false, true, false, false] }) }}
                                    >
                                        <Text style={[styles.themeColorText, this.state.sps[1] && styles.whiteText]}>最近发布</Text>
                                    </TouchableOpacity>
                                    {/*<TouchableOpacity
                                      style={[styles.selectButton, this.state.sps[2] && { backgroundColor: global.gColors.themeColor }]}
                                      onPress={() => { this.setState({ transiSortBy: '最多收藏', sps: [false, false, true, false] }) }}
                                    >
                                        <Text style={[styles.themeColorText, this.state.sps[2] && styles.whiteText]}>最多收藏</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[styles.selectButton, this.state.sps[3] && { backgroundColor: global.gColors.themeColor }]}
                                      onPress={() => this.setState({ transiSortBy: '最多联系', sps: [false, false, false, true] })}>
                                        <Text style={[styles.themeColorText, this.state.sps[3] && styles.whiteText]}>最多联系</Text>
                                    </TouchableOpacity>*/}
                                </View>
                            </View>
                        </View>
                        : <View></View>
                  }
                  {
                      this.state.tabName == 'allTalentedPeople' ?
                        <View style={styles.modalStyle}>
                            <View style={styles.subView}>
                                <View style={styles.modalHead}>
                                    <TouchableOpacity onPress={() => this.setState({ tabName: 'index' })}>
                                        <Text style={styles.themeColorText}>返回</Text>
                                    </TouchableOpacity>

                                    <Text style={{ color: 'black', fontSize: 16 }}>选择分类</Text>
                                    <TouchableOpacity onPress={() => this.setState({ tabName: 'index' })}>
                                        <Text style={styles.themeColorText}>确定</Text>
                                    </TouchableOpacity>

                                </View>
                                <View style={{ marginTop: 20, marginBottom: 20, marginLeft: 12 }}>
                                    <TouchableOpacity
                                      style={[styles.selectButton, this.state.cps[0] && { backgroundColor: global.gColors.themeColor }]}
                                      onPress={() => this.setState({ transiClassify: '全部人才', cps: [!this.state.cps[0], false, false, false, false, false, false] })}
                                    >
                                        <Text style={[styles.themeColorText, this.state.cps[0] && styles.whiteText]}>全部人才</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: 12 }}>
                                    <TouchableHighlight
                                      style={[styles.selectButton, this.state.cps[1] && { backgroundColor: global.gColors.themeColor }]}
                                      onPress={() => this.setState({ transiClassify: global.goods_catalog_I[0].name, cps: [false, !this.state.cps[1], this.state.cps[2] && true, this.state.cps[3] && true, this.state.cps[4] && true, this.state.cps[5] && true, this.state.cps[6] && true] })}
                                    >
                                        <Text style={[styles.themeColorText, this.state.cps[1] && styles.whiteText]}>{global.goods_catalog_I[0].name}</Text>
                                    </TouchableHighlight>
                                    <TouchableOpacity
                                      style={[styles.selectButton, this.state.cps[2] && { backgroundColor: global.gColors.themeColor }]}
                                      onPress={() => this.setState({ transiClassify: global.goods_catalog_I[1].name, cps: [false, this.state.cps[1] && true, !this.state.cps[2], this.state.cps[3] && true, this.state.cps[4] && true, this.state.cps[5] && true, this.state.cps[6] && true] })}
                                    >
                                        <Text style={[styles.themeColorText, this.state.cps[2] && styles.whiteText]}>{global.goods_catalog_I[1].name}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[styles.selectButton, this.state.cps[3] && { backgroundColor: global.gColors.themeColor }]}
                                      onPress={() => this.setState({ transiClassify: global.goods_catalog_I[2].name, cps: [false, this.state.cps[1] && true, this.state.cps[2] && true, !this.state.cps[3], this.state.cps[4] && true, this.state.cps[5] && true, this.state.cps[6] && true] })}
                                    >
                                        <Text style={[styles.themeColorText, this.state.cps[3] && styles.whiteText]}>{global.goods_catalog_I[2].name}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[styles.selectButton, this.state.cps[4] && { backgroundColor: global.gColors.themeColor }]}
                                      onPress={() => this.setState({ transiClassify: global.goods_catalog_I[3].name, cps: [false, this.state.cps[1] && true, this.state.cps[2] && true, this.state.cps[3] && true, !this.state.cps[4], this.state.cps[5] && true, this.state.cps[6] && true] })}
                                    >
                                        <Text style={[styles.themeColorText, this.state.cps[4] && styles.whiteText]}>{global.goods_catalog_I[3].name}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[styles.selectButton, this.state.cps[5] && { backgroundColor: global.gColors.themeColor }]}
                                      onPress={() => this.setState({ transiClassify: global.goods_catalog_I[4].name, cps: [false, this.state.cps[1] && true, this.state.cps[2] && true, this.state.cps[3] && true, this.state.cps[4] && true, !this.state.cps[5], this.state.cps[6] && true] })}
                                    >
                                        <Text style={[styles.themeColorText, this.state.cps[5] && styles.whiteText]}>{global.goods_catalog_I[4].name}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[styles.selectButton, this.state.cps[6] && { backgroundColor: global.gColors.themeColor }]}
                                      onPress={() => this.setState({ transiClassify: global.goods_catalog_I[5].name, cps: [false, this.state.cps[1] && true, this.state.cps[2] && true, this.state.cps[3] && true, this.state.cps[4] && true, this.state.cps[5] && true, !this.state.cps[6]] })}
                                    >
                                        <Text style={[styles.themeColorText, this.state.cps[6] && styles.whiteText]}>{global.goods_catalog_I[5].name}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        : <View></View>
                  }
                  {
                      this.state.tabName == 'selectLocation' ?
                        <View style={[styles.modalStyle]}>
                            <View style={[styles.subView]}>
                                    <View>
                                        <View style={styles.modalHead}>
                                            <TouchableOpacity onPress={() => this.setState({ tabName: 'index' })}>
                                                <Text style={styles.themeColorText}>返回</Text>
                                            </TouchableOpacity>
                                            <Text style={{ color: 'black', fontSize: 16 }}>位置</Text>
                                            <TouchableOpacity onPress={() => this.setState({ tabName: 'index' })}>
                                                <Text style={styles.themeColorText}>确定</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ marginTop: 20, marginBottom: 20, marginLeft: 12 }}>
                                            <TouchableOpacity
                                            style={{flexDirection: 'row'}}
                                            onPress={this._showAreaPicker.bind(this)}
                                            >
                                                <Image style={styles.headIcon} source={require('../resource/b_location.png')} />
                                                <Text style={[styles.themeColorText]}>{this.state.initArea[0]}, {this.state.initArea[1]}, {this.state.initArea[2]} </Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ flexDirection: 'row', marginLeft: 12 }}>
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
                                        </View>
                                    </View>                                                      
                            </View>
                        </View>
                        : <View></View>
                  }
              </Modal>
          </View>
        )
    }
}



const styles = StyleSheet.create({
    listView: {
        flex: 1,
        backgroundColor: '#4A90E2',
    },
    container: {
        flexDirection: 'row',   // 水平排布
        paddingHorizontal: 8,
        paddingTop: Platform.OS === 'ios' ? 20 : 0,  // 处理iOS状态栏
        height: Platform.OS === 'ios' ? 64 : 44,   // 处理iOS状态栏
        backgroundColor: global.gColors.themeColor,
        alignItems: 'center'  // 使元素垂直居中排布, 当flexDirection为column时, 为水平居中
    },
    logo: {//图片logo
        height: 24,
        width: 64,
        resizeMode: 'stretch'  // 设置拉伸模式
    },
    searchBox: {//搜索框
        flexDirection: 'row',   // 水平排布
        flex: 1,
        borderRadius: 5,  // 设置圆角边
        backgroundColor: 'rgba(255,255,255,0.24)',
        alignItems: 'center',
        width: 300,
        height: 32,
    },
    searchIcon: {//搜索图标
        height: 24,
        width: 24,
        marginLeft: 5,
        resizeMode: 'stretch'
    },
    inputText: {
        flex: 1,
        backgroundColor: 'transparent',
        fontSize: 14,
        position: 'relative',
        padding: 0,
    },
    voiceIcon: {
        marginLeft: 5,
        marginRight: 8,
        width: 20,
        height: 20,
        resizeMode: 'stretch'
    },
    scanIcon: {//搜索图标
        height: 22,
        width: 22,
        resizeMode: 'stretch'
    },

    blackText: {
        color: '#000',
        padding: 5,
        borderRadius: 3,
        fontSize: 16
    },
    filterButton: {
        backgroundColor: global.gColors.themeColor,
        borderRadius: 2,
        height: 28,
        marginLeft: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    filterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: global.gScreen.width,
        marginRight: 10,
        paddingBottom: 10,
        paddingTop: 10,
        
    },
    themeColorText: {
        color: global.gColors.themeColor,
        fontSize: 16
    },
    greyText: {
        color: '#CCCCCC',
        fontSize: 14,
        lineHeight: 20,
        
    },
    whiteText: {
        color: '#fff',
        fontSize: 14,
    },
    selectButton: {
        borderWidth: 1,
        borderColor: global.gColors.themeColor,
        height: 28,
        alignItems: 'center',
        borderRadius: 2,
        width: Platform.OS === 'ios' ? 104 : 80,
        marginRight: 8,
        marginBottom: 20,
        justifyContent: 'center'
    },
    // modal的样式
    modalStyle: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        flex: 1,
        
    },
    // modal上子View的样式
    subView: {
        alignSelf: 'stretch',
        justifyContent: 'flex-start',
        borderWidth: 0.5,
        borderColor: '#4990E2',
        backgroundColor: '#fff',
        height: 300,
        paddingTop: 12
    },
    // 标题
    modalHead: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 12
    },
    map: {
        width: Dimensions.get('window').width - 40,
        height: Dimensions.get('window').height - 500,
        marginBottom: 10,
        marginLeft: 20,
    },
})


export default connect((state) => {
    const { ServOfferList } = state;
    return { ServOfferList }
})(ExploreList);
