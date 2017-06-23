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
    TouchableHighlight
} from 'react-native'
import {
    fetchFeedList
} from './ServOfferListActions';
import { connect } from 'react-redux';
import ServOfferList from './ServOfferList';
import ScrollableTabView, { DefaultTabBar, } from 'react-native-scrollable-tab-view';
import TabCategoryBar from '../me/TabCategoryBar';
import Constant from '../common/constants'

const titles = ['远程', '本地',];
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
            lps: [false, false],//位置按钮操作
            searchText: this.props.searchText
        };
    }
    componentWillMount() {
        const { feed } = this.props;
        this.setState({
            show: false,
            tabName: this.props.tabName,
            sortBy: '综合排序',
            transiSortBy: '最近发布',
            classify: '全部人才',
            transiClassify: '全部人才',
            location: '广州',
            transiLocation: '广州',
            searchText: ''
        });
        if (global.goods_catalog_I === undefined) {
            this.getGoodsCatalog();
        }
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
        let district = this.state.lps;
        if(district[0])
            exploreparams.district = "番禺区"
        if(district[1])
            exploreparams.district = "海珠区"
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
        dispatch(fetchFeedList(categoryId, page, exploreparams));
    }

    render() {
        return (
            <View style={styles.listView}>
                <View style={styles.container}>
                    <View style={styles.searchBox}>
                        <Image source={require('../resource/w-search.png')} style={styles.searchIcon} />
                        <TextInput style={styles.inputText} underlineColorAndroid='transparent'
                            keyboardType='web-search' value={this.state.exploretitle}
                            //onChangeText={(val)=>this.setState({searchText:val})}
                            placeholder='搜索'
                            placeholderTextColor='white'
                            onChangeText={(val) => {
                                let explore = this.state.exploreparams;
                                explore.title = val;
                                this.setState({ exploreparams: explore, exploretitle:val })
                            }} />
                        <TouchableOpacity onPress={() => {
                            let explore = this.state.exploreparams;
                            explore.title = '';
                            this.setState({ exploreparams: explore,exploretitle:'' });
                        }}>
                            
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => this.refresh()}>
                        <Image source={require('../resource/w-content.png')} style={styles.scanIcon} />
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', paddingVertical: 10, backgroundColor: 'rgba(0,0,0,0.16)'}}>
                    <TouchableOpacity style={styles.filterButton} onPress={() => this.setState({ tabName: 'index', show: true })}>
                        <Text style={styles.whiteText}>{this.state.sortBy}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterButton} onPress={() => this.setState({ tabName: 'index', show: true })}>
                        <Text style={styles.whiteText}>{this.state.classify}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterButton} onPress={() => this.setState({ tabName: 'index', show: true })}>
                        <Image source={require('../resource/w-location.png')} style={{marginTop: -2}}></Image>
                        <Text style={styles.whiteText}>{this.state.location}</Text>
                    </TouchableOpacity>
                </View>
                <ServOfferList exploreparams={this.state.exploreparams} cps={this.state.cps} lps={this.state.lps} {...this.props} />
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
                                        <TouchableOpacity onPress={() => this.setState({ tabName: 'index' })}>
                                            <Text style={styles.themeColorText}>重置</Text>
                                        </TouchableOpacity>

                                        <Text style={{ color: 'black', fontSize: 16 }}>筛选</Text>
                                        <TouchableOpacity onPress={() => this.setState({ show: false })}>
                                            <Text style={styles.themeColorText}
                                                onPress=
                                                {() => {this.setState({
                                                    sortBy: this.state.transiSortBy,
                                                    classify: this.state.transiClassify,
                                                    location: this.state.transiLocation,
                                                    show: false,
                                                });
                                                this.refresh();
                                                }}
                                            >完成</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <ScrollableTabView
                                        style={{ marginTop: 20, marginRight: 5, marginLeft: 5, borderRadius: 5 }}
                                        initialPage={0}
                                        renderTabBar={() => <TabCategoryBar tabNames={titles} />}
                                        tabBarPosition='top'
                                        scrollWithoutAnimation={false}
                                        tabBarBackgroundColor={global.gColors.themeColor}
                                    >
                                        <View tabLabel='本地'>
                                            <View style={{ flexDirection: 'row' }}>
                                                <TouchableOpacity onPress={() => this.setState({ tabName: 'recentPublish' })} style={styles.filterRow}>
                                                    <Text style={styles.blackText}>排序</Text>
                                                    <Text style={styles.greyText}>{this.state.transiSortBy}&nbsp;&gt;</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <TouchableOpacity onPress={() => this.setState({ tabName: 'allTalentedPeople' })} style={styles.filterRow}>
                                                    <Text style={styles.blackText}>类型</Text>
                                                    <Text style={styles.greyText}>{this.state.transiClassify}&nbsp;&gt;</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <TouchableOpacity onPress={() => this.setState({ tabName: 'guangzhou' })} style={styles.filterRow}>
                                                    <Text style={styles.blackText}>位置</Text>
                                                    <Text style={styles.greyText}>{this.state.transiLocation}&nbsp;&gt;</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <View tabLabel='远程'>
                                            <View style={{ flexDirection: 'row' }}>
                                                <TouchableOpacity onPress={() => this.setState({ tabName: 'recentPublish' })} style={styles.filterRow}>
                                                    <Text style={styles.blackText}>排序</Text>
                                                    <Text style={styles.greyText}>{this.state.transiSortBy}&nbsp;&gt;</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <TouchableOpacity onPress={() => this.setState({ tabName: 'allTalentedPeople' })} style={styles.filterRow}>
                                                    <Text style={styles.blackText}>类型</Text>
                                                    <Text style={styles.greyText}>{this.state.transiClassify}&nbsp;&gt;</Text>
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
                                    <View style={{ marginTop: 20, marginBottom: 20, marginLeft: 20 }}>
                                        <TouchableOpacity
                                            style={[styles.selectButton, { backgroundColor: global.gColors.themeColor }]}
                                        >
                                            <Text style={[styles.whiteText]}>全部排序</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginLeft: 20 }}>
                                        <TouchableOpacity
                                            style={[styles.selectButton, this.state.sps[1] && { backgroundColor: global.gColors.themeColor }]}
                                            onPress={() => { this.setState({ transiSortBy: '最近发布', sps: [false, true, false, false] }) }}
                                        >
                                            <Text style={[styles.themeColorText, this.state.sps[1] && styles.whiteText]}>最近发布</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.selectButton, { width: 100 }, this.state.sps[2] && { backgroundColor: global.gColors.themeColor }]}
                                            onPress={() => { this.setState({ transiSortBy: '半年内发布', sps: [false, false, true, false] }) }}
                                        >
                                            <Text style={[styles.themeColorText, this.state.sps[2] && styles.whiteText]}>半年内发布</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.selectButton, { width: 120 }, this.state.sps[3] && { backgroundColor: global.gColors.themeColor }]}
                                            onPress={() => this.setState({ transiSortBy: '六周以内发布', sps: [false, false, false, true] })}>
                                            <Text style={[styles.themeColorText, this.state.sps[3] && styles.whiteText]}>六周以内发布</Text>
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
                                        <TouchableOpacity onPress={() => this.setState({ tabName: 'index' })}>
                                            <Text style={styles.themeColorText}>返回</Text>
                                        </TouchableOpacity>

                                        <Text style={{ color: 'black', fontSize: 16 }}>选择分类</Text>
                                        <TouchableOpacity onPress={() => this.setState({ tabName: 'index' })}>
                                            <Text style={styles.themeColorText}>确定</Text>
                                        </TouchableOpacity>

                                    </View>
                                    <View style={{ marginTop: 20, marginBottom: 20, marginLeft: 20 }}>
                                        <TouchableOpacity
                                            style={[styles.selectButton, this.state.cps[0] && { backgroundColor: global.gColors.themeColor }]}
                                            onPress={() => this.setState({ transiClassify: '全部分类', cps: [!this.state.cps[0], false, false, false, false, false] })}
                                        >
                                            <Text style={[styles.themeColorText, this.state.cps[0] && styles.whiteText]}>全部分类</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: 20 }}>
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
                        this.state.tabName == 'guangzhou' ?
                            <View style={styles.modalStyle}>
                                <View style={styles.subView}>
                                    <View style={styles.modalHead}>
                                        <TouchableOpacity onPress={() => this.setState({ tabName: 'index' })}>
                                            <Text style={styles.themeColorText}>返回</Text>
                                        </TouchableOpacity>
                                        <Text style={{ color: 'black', fontSize: 16 }}>选择范围</Text>
                                        <TouchableOpacity onPress={() => this.setState({ tabName: 'index' })}>
                                            <Text style={styles.themeColorText}>确定</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ marginTop: 20, marginBottom: 20, marginLeft: 20 }}>
                                        <TouchableOpacity style={styles.selectButton}>
                                            <Text style={styles.themeColorText}>全部范围</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginLeft: 20 }}>
                                        <TouchableOpacity
                                            style={[styles.selectButton, this.state.lps[0] && { backgroundColor: global.gColors.themeColor }]}
                                            onPress={() => this.setState({ transiLocation: '番禺区', lps: [true, false] })}
                                        >
                                            <Text style={[styles.themeColorText, this.state.lps[0] && styles.whiteText]}>番禺区</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.selectButton, this.state.lps[1] && { backgroundColor: global.gColors.themeColor }]}
                                            onPress={() => this.setState({ transiLocation: '海珠区', lps: [false, true] })}
                                        >
                                            <Text style={[styles.themeColorText, this.state.lps[1] && styles.whiteText]}>海珠区</Text>
                                        </TouchableOpacity>
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
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: Platform.OS === 'ios' ? 20 : 0,  // 处理iOS状态栏    
        height: Platform.OS === 'ios' ? 68 : 48,   // 处理iOS状态栏    
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
        height: 20,
        width: 20,
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
        height: 26.7,
        width: 26.7,
        resizeMode: 'stretch'
    },

    blackText: {
        color: '#000',
        padding: 5,
        borderRadius: 3,
        fontSize: 18
    },
    filterButton: {
        backgroundColor: global.gColors.themeColor,
        borderRadius: 2,
        height: 28,
        marginLeft: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        flexDirection: 'row'
    },
    filterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: global.gScreen.width,
        marginRight: 10,
        paddingBottom: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0'

    },
    themeColorText: {
        color: global.gColors.themeColor,
        fontSize: 16
    },
    greyText: {
        color: '#808080',
        fontSize: 18,
        marginRight: 20
    },
    whiteText: {
        color: '#fff',
        fontSize: 14
    },
    selectButton: {
        borderWidth: 1,
        borderColor: global.gColors.themeColor,
        padding: 5,
        height: 36,
        width: Platform.OS === 'ios' ? 104 : 80,
        marginRight: 20,
        marginBottom: 20
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
        backgroundColor: '#fff',
        height: 300,
    },
    // 标题  
    modalHead: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10
    }
})


export default connect((state) => {
    const { feedHome } = state;
    return { feedHome }
})(ExploreList);