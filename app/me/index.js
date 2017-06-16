import React, {Component, PureComponent} from 'react'
import {
    StyleSheet,
    View,
    Text,
    Image,
    ListView,
    ProgressBarAndroid,
    TouchableOpacity,
    Platform,
    RefreshControl,
    Alert,
    Navigator,
} from 'react-native'
import Header from '../components/HomeNavigation';
import ScrollableTabView from 'react-native-scrollable-tab-view'
import TabCategoryBar from './TabCategoryBar'
import Constant from '../common/constants';
const titles = ['服务', '需求', '收藏'];

import OffersList from './page/offersList'
import RequestsList from './page/requestsList';
import BookmarksList from './page/bookmarksList';
import PersonInfo from './personalinfoEdit';
import ImagePicker from 'react-native-image-picker';
import Setting from '../sys/Setting';
const controllers = [
    {categoryId: 1, controller: OffersList},
    {categoryId: 2, controller: RequestsList},
    {categoryId: 3, controller: BookmarksList}
]
export default class MeInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fileName: this.props.fileName,
            fileSource: this.props.source,
            avatar: global.user.avatar,
            errors: this.props.errors,
            info: global.user.profile
        }
    }
   

    clickJump() {
        let _this = this;
        const { navigator } = this.props;
        let  getdata=(a, b)=>{_this.setState({
                        avatar:a,
                        info: b
                    })}
        let abc='abc';
        let info = _this.state.info;
        if (navigator) {
            navigator.push({　　//navigator.push 传入name和你想要跳的组件页面
                name: "PersonInfo",
                component: PersonInfo,
                passProps: {getdata, info},
            });
        }
    }


     render() {
        return(

              <View style={styles.listView}>
                <View style={{ backgroundColor: '#4A90E2' }}>
                    <View style={{flexDirection:'row', justifyContent:'flex-start',margin: 20}}>
                        <View style={{}}>
                            <TouchableOpacity onPress={this.clickJump.bind(this)}>
                            <Image style={{width: 72, height:72, borderRadius: 36, justifyContent:'flex-end', alignItems:'flex-end'}} source={{uri:this.state.avatar}}>
                            </Image>
                            <Image style={{width:20, height:20, borderRadius: 10,position: 'absolute',left: 52, top: 52}} source={require('../resource/y-call-tx3x.png')}/>
                            </TouchableOpacity>
                        </View>
                        <View style={{justifyContent:'space-between', alignItems:'flex-start',marginLeft: 15}}>
                            <Text style={{fontSize:16, color:'white'}}>{global.user.name}</Text>
                            <Text style={styles.text}>番禺区，广州市，广东省，中国</Text>
                            <Text style={{backgroundColor: 'rgba(255,255,255,0.24)', borderRadius: 10, paddingLeft: 10, paddingRight:10, height: 20}}>
                                {
                                    global.user.profile?
                                    <Text style={{color: 'white', fontSize: 12, lineHeight: 18}} onPress={this.clickJump.bind(this)}>{global.user.profile}</Text>
                                    :<Text style={{color: 'white', fontSize: 12, lineHeight: 18}} onPress={this.clickJump.bind(this)}>编辑个人信息</Text>
                                }      
                                    
                            </Text>
                        </View>
                        <TouchableOpacity onPress={()=>this.props.navigator.push({component:Setting})}>
                            <Image style={{marginLeft: 26}} source={require('../resource/w-setting.png')}></Image>
                        </TouchableOpacity>
                    </View>
                    <View style={{marginHorizontal: 16}}>
                        <Text style={styles.text}>Being the savage's bowsman, that is, the person who pulled the bow-oar in his boat.</Text>
                    </View>
                    <View style={{marginLeft: 16, marginVertical: 16, flexDirection: 'row'}}>
                        <Image style={{ marginRight: 11 }} source={require('../resource/w-earth.png')}></Image>
                        <Text style={styles.text}>www.straphoto.com</Text>
                    </View>
                </View>
                <ScrollableTabView
                    renderTabBar={() => <TabCategoryBar tabNames={titles}/>}
                    tabBarPosition='top'
                    scrollWithoutAnimation={false}
                >
                    {controllers.map((data, index) => {
                        let Component = data.controller;
                        return (
                            <Component
                                key={titles[index]}
                                tabLabel={titles[index]}
                                categoryId={data.categoryId}
                                navigator={this.props.navigator}
                            />
                        )
                    })}
                </ScrollableTabView>
               </View>
        )
    
     }


}



const styles = StyleSheet.create({
    listView: {
        flex: 1,
    },
    text: {
        fontSize: 14,
        color: 'white',
    }
})
