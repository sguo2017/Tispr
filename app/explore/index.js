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
  ScrollView,
  TouchableWithoutFeedback
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
import Util from '../common/utils'
import MarkList from './MarkList'
import UserDefaults from '../common/UserDefaults'

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
            exploreparams: {},
            exploretitle:'',
            sps: [false, false],//排序按钮操作
            cps: [false, false, false, false, false, false, false],//类型按钮操作
            searchText: this.props.searchText,
            via: '',
            initArea: ['广东', '广州', '番禺区'],
            zoom: 18,
            showCancel: false,
            showSearchPage: false,
            history: []
        };
    }
    componentWillMount() {
        
        const { feed } = this.props;
        this.setState({
            show: false,
            tabName: this.props.tabName,
            sortBy: '全部排序',
            transiSortBy: '全部排序',
            classify: '全部人才',
            transiClassify: '全部人才',
            location: '广州市',
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

        UserDefaults.cachedObject(Constant.storeKeys.SEARCH_HISTORY_TITLE).then((history) => {
            console.log('history')
            console.log(history)
            if (history == null) {
                history = {};
            } else if (history[global.user.id]) {
                this.setState({
                    history: history[global.user.id],
                    
                });
            }
        })
        UserDefaults.cachedObject(Constant.storeKeys.SEARCH_HISTORY_KEY).then((historyKey) => {
            console.log('indexmount');
            console.log(historyKey[global.user.id])
            if (historyKey == null) {
                historyKey = {};
            } else if (historyKey[global.user.id]) {
                this.setState({
                    sortBy: historyKey[global.user.id].sortBy,
                    transiSortBy: historyKey[global.user.id].sortBy,
                    classify: historyKey[global.user.id].classify,
                    transiClassify: historyKey[global.user.id].classify,
                    location: historyKey[global.user.id].via == 'local'?historyKey[global.user.id].city:'远程',
                    cps: historyKey[global.user.id].cps,
                    sps: historyKey[global.user.id].sps,
                });
                if (historyKey[global.user.id].title) this.setState({exploretitle: historyKey[global.user.id].title})
            }
        })
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
        if(!global.user.authentication_token){
               Util.noToken(this.props.navigator);
        }
        let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_GOODS_CATALOG + global.user.authentication_token + `&level=1`;
        Util.get(url,
            (response)=>{
                 let goods_catalog_I = this.state.goods_catalog_I;
                goods_catalog_I = JSON.parse(response.feeds);
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
            },
            (error) => {
                if(error.message == 'Network request failed'){
                    this.props.navigator.push({component: offline})
                }else{
                    this.props.navigator.push({component: breakdown})
                }
            }
        )
    }
    
    refresh() {
        console.log('indexrefresh');
        if(!global.user.authentication_token){
            Util.noToken(this.props.navigator);
        }
        this.setState({showSearchPage: false})
        let exploreparams = this.state.exploreparams;
        //搜索框输入信息缓存
        UserDefaults.cachedObject(Constant.storeKeys.SEARCH_HISTORY_TITLE).then((history) => {
            if (history == null) {
                history = {};
            }
            if (!history[global.user.id]) history[global.user.id] = [];
            if (exploreparams.title) {
                history[global.user.id].map((item, index) => {
                    if (item == exploreparams.title) history[global.user.id].splice(index, 1);
                })
                history[global.user.id].push(exploreparams.title);
            }
            UserDefaults.setObject(Constant.storeKeys.SEARCH_HISTORY_TITLE, history);
            this.setState({history: history[global.user.id]});
        })

        const { dispatch, categoryId } = this.props;

        if(this.state.via == 'local'){
            exploreparams.via = 'local'
            exploreparams.city = this.state.location;
        }
        if(this.state.via == 'remote'){
            exploreparams.via = 'remote'
            exploreparams.city = undefined;
        }
        exploreparams.classify = this.state.transiClassify;
        exploreparams.sortBy = this.state.transiSortBy;
        exploreparams.cps = this.state.cps;
        exploreparams.sps = this.state.sps;

        let goods_catalog = this.state.cps;        
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
        //传入缓存
        UserDefaults.cachedObject(Constant.storeKeys.SEARCH_HISTORY_KEY).then((historyKey) => {
            if (historyKey == null) {
                historyKey = {};
            }
            historyKey[global.user.id] = exploreparams;
            console.log('传入筛选缓存')
            console.log(historyKey[global.user.id])
            UserDefaults.setObject(Constant.storeKeys.SEARCH_HISTORY_KEY, historyKey);
            this.setState({exploreparams: historyKey[global.user.id]});
            page = 1;
            dispatch(fetchExploreList(page, exploreparams, this.props.navigator));
        })
        
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

    _clearHistory() {
        UserDefaults.setObject(Constant.storeKeys.SEARCH_HISTORY_TITLE, {});
        this.setState({history: ''})
    }

    render() {
        let page = this.state.via =='local'?0:1
        return (
            <View style={styles.listView}>
                <View style={styles.container}>
                    <View style={styles.searchBox}>
                        <Image source={require('../resource/w-search.png')} style={styles.searchIcon} />
                        <TextInput 
                            ref = "searchInput"
                            style={styles.inputText}
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
                            onFocus = {()=>this.setState({showCancel:true, showSearchPage: true})}
                            obBlur = {()=> this.setState({showCancel: false, showSearchPage: false})}
                        />
                    </View>
                    {
                    this.state.showCancel?
                    <TouchableOpacity style={{ marginLeft: 17, marginRight: 8 }} 
                        onPress={() => {
                            let explore = this.state.exploreparams;
                            this.refs["searchInput"].blur()
                             explore.title = '';
                             this.setState({
                                showCancel:false,
                                exploreparams: explore, 
                                exploretitle:'',
                                showSearchPage: false
                            });
                            this.state.exploreparams=explore;
                            this.refresh()
                        }}
                    >
                        <Text style={{color: '#fff'}}>取消</Text>
                    </TouchableOpacity>:
                    <TouchableOpacity style={{ marginLeft: 17, marginRight: 8 }} onPress={() => this.props.navigator.push({component: MarkList})}>
                        <Image source={require('../resource/w-content.png')} style={styles.scanIcon} />
                    </TouchableOpacity>
                    }                
                </View>
                {
                !this.state.showSearchPage?
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
                </View>:
                <View style={{backgroundColor: 'white', flex: 1, padding: 16}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={{color: '#999999', fontSize: 14}}>您搜过的</Text>
                        <TouchableOpacity onPress={this._clearHistory.bind(this)}>
                            <Text style={{fontSize: 14, color: '#4A90E2'}}>清空</Text>
                        </TouchableOpacity>
                    </View>
                    {this.state.history?
                    <View style={{flexDirection: 'row', justifyContent: 'flex-start', marginTop: 10, flexWrap: 'wrap'}}>
                         {this.state.history.map((item, index) => {
                           // if (index < this.state.history.split(',').length-1)
                                return(
                                    <TouchableOpacity
                                        onPress={() => {this.setState({exploretitle: item, exploreparams: {title: item}})}}
                                        key={index}
                                        style={{borderColor: '#4A90E2', borderWidth: 1, borderRadius: 14, paddingHorizontal:8, paddingVertical: 4, marginRight: 12, marginTop: 12}}
                                    
                                    >
                                        <Text style={{fontSize: 14, color: '#4A90E2'}}>{item}</Text>
                                    </TouchableOpacity>
                                )
                        })} 
                    </View>: <View></View>
                    }
                </View>
                }

                {this.state.showSearchPage? null:
                <ServOfferList title={this.state.exploretitle} exploreparams={this.state.exploreparams} cps={this.state.cps} location={this.state.location} {...this.props} />}
                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={this.state.show}
                    onShow={() => { }}
                    onRequestClose={() => { }}
                >
                <TouchableWithoutFeedback style={{flex: 1}} onPress={() => this.setState({show: false})}>
                <View style={styles.cover}>
                    {
                      this.state.tabName == 'index' ?
                        <View style={styles.modalStyle}>
                            <View style={styles.subView}>
                                <View style={styles.modalHead}>
                                    <TouchableOpacity onPress={() => this.setState({ cps: [true, false, false, false, false, false, false], transiSortBy: '综合排序', transiClassify: '全部人才' })}>
                                        <Text style={styles.themeColorText}>重置</Text>
                                    </TouchableOpacity>
                                    <Text style={{ color: 'black', fontSize: 16 }}>筛选</Text>
                                    <TouchableOpacity onPress={() => this.setState({ show: false })}>
                                        <Text style={styles.themeColorText}
                                              onPress=
                                                {() => {
                                                if(this.state.via == 'remote'){
                                                    this.setState({
                                                        sortBy: this.state.transiSortBy,
                                                        classify: this.state.transiClassify,
                                                        location: "远程",
                                                        show: false,
                                                    });
                                                }else{
                                                    this.setState({
                                                        sortBy: this.state.transiSortBy,
                                                        classify: this.state.transiClassify,
                                                        location: this.state.initArea[1]+"市",
                                                        show: false,
                                                    });
                                                    this.state.location = this.state.initArea[1]+"市";
                                                } 
                                                this.refresh();
                                                }}
                                        >完成</Text>
                                    </TouchableOpacity>
                                </View>
                                <ScrollableTabView
                                  style={{ flex: 1, marginTop: 20, marginRight: 5, marginLeft: 5, borderRadius: 5 }}
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
                                    <TouchableOpacity onPress={() => this.setState({ tabName: 'index' },()=>{if(this.state.via == 'remote'){this.tabView.goToPage(1)}})}>
                                        <Text style={styles.themeColorText}>返回</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.blackText}>选择排序</Text>
                                    <TouchableOpacity onPress={() => this.setState({ tabName: 'index' },()=>{if(this.state.via == 'remote'){this.tabView.goToPage(1)}})}>
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
                                      onPress={() => { this.setState({ transiSortBy: '最近发布', sps: [false, true] }) }}
                                    >
                                        <Text style={[styles.themeColorText, this.state.sps[1] && styles.whiteText]}>最近发布</Text>
                                    </TouchableOpacity>
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
                                    <TouchableOpacity onPress={() => this.setState({ tabName: 'index' },()=>{if(this.state.via == 'remote'){this.tabView.goToPage(1)}})}>
                                        <Text style={styles.themeColorText}>返回</Text>
                                    </TouchableOpacity>

                                    <Text style={{ color: 'black', fontSize: 16 }}>选择分类</Text>
                                    <TouchableOpacity onPress={() => {
                                        this.setState({ tabName: 'index' },()=>{if(this.state.via == 'remote'){this.tabView.goToPage(1)}});
                                        this.state.cps.map((cp, index) => {
                                            if (cp && index>0) this.setState({transiClassify: global.goods_catalog_I[index-1].name})
                                        })
                                    }}>
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
                                        onPress={() => {
                                            this.setState({cps: [false, !this.state.cps[1], this.state.cps[2] && true, this.state.cps[3] && true, this.state.cps[4] && true, this.state.cps[5] && true, this.state.cps[6] && true] });
                                        }}
                                    >
                                        <Text style={[styles.themeColorText, this.state.cps[1] && styles.whiteText]}>{global.goods_catalog_I[0].name}</Text>
                                    </TouchableHighlight>
                                    <TouchableOpacity
                                        style={[styles.selectButton, this.state.cps[2] && { backgroundColor: global.gColors.themeColor }]}
                                        onPress={() => {
                                            this.setState({ cps: [false, this.state.cps[1] && true, !this.state.cps[2], this.state.cps[3] && true, this.state.cps[4] && true, this.state.cps[5] && true, this.state.cps[6] && true] })
                                        }}
                                    >
                                        <Text style={[styles.themeColorText, this.state.cps[2] && styles.whiteText]}>{global.goods_catalog_I[1].name}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[styles.selectButton, this.state.cps[3] && { backgroundColor: global.gColors.themeColor }]}
                                      onPress={() => {
                                          this.setState({cps: [false, this.state.cps[1] && true, this.state.cps[2] && true, !this.state.cps[3], this.state.cps[4] && true, this.state.cps[5] && true, this.state.cps[6] && true] })}
                                      }
                                    >
                                        <Text style={[styles.themeColorText, this.state.cps[3] && styles.whiteText]}>{global.goods_catalog_I[2].name}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[styles.selectButton, this.state.cps[4] && { backgroundColor: global.gColors.themeColor }]}
                                      onPress={() => {
                                          this.setState({cps: [false, this.state.cps[1] && true, this.state.cps[2] && true, this.state.cps[3] && true, !this.state.cps[4], this.state.cps[5] && true, this.state.cps[6] && true] })}
                                      }
                                    >
                                        <Text style={[styles.themeColorText, this.state.cps[4] && styles.whiteText]}>{global.goods_catalog_I[3].name}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[styles.selectButton, this.state.cps[5] && { backgroundColor: global.gColors.themeColor }]}
                                      onPress={() => {
                                          this.setState({ cps: [false, this.state.cps[1] && true, this.state.cps[2] && true, this.state.cps[3] && true, this.state.cps[4] && true, !this.state.cps[5], this.state.cps[6] && true] })}
                                      }
                                    >
                                        <Text style={[styles.themeColorText, this.state.cps[5] && styles.whiteText]}>{global.goods_catalog_I[4].name}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[styles.selectButton, this.state.cps[6] && { backgroundColor: global.gColors.themeColor }]}
                                      onPress={() => {
                                          this.setState({cps: [false, this.state.cps[1] && true, this.state.cps[2] && true, this.state.cps[3] && true, this.state.cps[4] && true, this.state.cps[5] && true, !this.state.cps[6]] })}
                                      }
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
                        <View style={styles.modalStyle}>
                            <View style={styles.subView}>
                                <View style={styles.modalHead}>
                                    <TouchableOpacity onPress={() => this.setState({ tabName: 'index' },()=>{if(this.state.via == 'remote'){this.tabView.goToPage(1)}})}>
                                        <Text style={styles.themeColorText}>返回</Text>
                                    </TouchableOpacity>
                                    <Text style={{ color: 'black', fontSize: 16 }}>位置</Text>
                                    <TouchableOpacity onPress={() => this.setState({ tabName: 'index' },()=>{if(this.state.via == 'remote'){this.tabView.goToPage(1)}})}>
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
                                />
                            </View>
                        </View>
                        : <View></View>
                  }
                </View>
                </TouchableWithoutFeedback>
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
    cover:{  
        flex:1,  
        backgroundColor: 'rgba(0, 0, 0, 0.25)',  
        position: 'absolute',  
        top: 0,  
        bottom: 0,  
        left: 0,  
        right: 0, 
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
        borderWidth: 1,
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
        flex: 1,
        marginBottom: 10,
        marginHorizontal: 20,
    },
})


export default connect((state) => {
    const { ServOfferList } = state;
    return { ServOfferList }
})(ExploreList);
