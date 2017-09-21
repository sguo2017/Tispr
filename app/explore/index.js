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
import { fetchFriendList } from '../actions/UserListActions';
import { fetchVillageList } from '../actions/VillageListActions';
import Picker from 'react-native-picker';
import { fetchExploreList } from '../actions/ServOfferListActions';
import { connect } from 'react-redux';
import ServOfferList from './ServOfferList';
import FriendList from './FriendList'
import VillageList from './VillageList'
import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabCategoryBar from '../me/TabCategoryBar';
import Constant from '../common/constants'
import area from '../sys/others/area.json'
import Util from '../common/utils'
import MarkList from './MarkList'
import UserDefaults from '../common/UserDefaults'
var goods_catalogs_II=[];
var goods_catalogs_II_id=[];
class ExploreList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            friendSearch:false,
            communitySearch:false,
            classSearch: true,
            searchTitle:''
        };
    }
    componentWillMount() {
        
    }


    componentDidMount() {

    }
    
    refresh() {
        const { dispatch } = this.props;
        console.log('indexrefresh');
        if(!global.user.authentication_token){
            Util.noToken(this.props.navigator);
        }
        let page =1
        let exploreparams = {title:this.state.searchTitle};
        dispatch(fetchExploreList(1, page, exploreparams, this.props.navigator));
    }

    friendSearch(){
        this.setState({
            classSearch: false,
            communitySearch: false,
            friendSearch:true, 
        })
        const { dispatch } = this.props;
        dispatch(fetchFriendList(1, {title:this.state.searchTitle}, this.props.navigator));
    }
    communitySearch(){
        this.setState({
            classSearch: false,
            communitySearch: true,
            friendSearch:false, 
        })
        const { dispatch } = this.props;
        dispatch(fetchVillageList(1, {title:this.state.searchTitle}, 1 , this.props.navigator));
    }
    classSearch(){
        this.setState({
            classSearch: true,
            communitySearch: false,
            friendSearch:false,
        },this.refresh)
    }
    freshSearch(){
        if(this.state.classSearch){
            this.classSearch();
        }else if(this.state.communitySearch){
            this.communitySearch();
        }else if(this.state.friendSearch){
            this.friendSearch();
        }
    }
    render() {
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
                            value={this.state.searchTitle}
                            placeholder='搜索'
                            returnKeyType = 'search'
                            returnKeyLabel = 'search'
                            placeholderTextColor='white'
                            selectTextOnFocus ={true}
                            onSubmitEditing = {this.freshSearch.bind(this)}
                            onChangeText={(val) => {
                                this.setState({searchTitle: val})
                            }}
                            onFocus = {()=>{}}
                            obBlur = {()=> {}}
                        />
                    </View>
                </View>
                <View style={{flexDirection: 'row', paddingVertical: 6, backgroundColor: 'rgba(0,0,0,0.16)'}}>
                    <TouchableOpacity style={styles.filterButton} onPress={this.classSearch.bind(this)}>
                        <Text style={styles.whiteText}>职业</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterButton} onPress={this.friendSearch.bind(this)}>
                        <Text style={styles.whiteText}>好友</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterButton} onPress={this.communitySearch.bind(this)}>
                        <Text style={styles.whiteText}>社区</Text>
                    </TouchableOpacity>
                </View>
                {
                    this.state.friendSearch?
                    <FriendList {...this.props} exploreparams={{title:this.state.searchTitle}}/> :
                   null  
                }
                {
                    this.state.communitySearch?
                    <VillageList {...this.props} qry_type={1} exploreparams={{title:this.state.searchTitle}}/> :
                   null
                }
                {
                    this.state.classSearch?
                     <ServOfferList {...this.props} exploreparams={{title:this.state.searchTitle}} />   :
                     null
                }
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