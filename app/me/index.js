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
import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import OffersList from './page/offersList';
import RequestsList from './page/requestsList';
import BookmarksList from './page/bookmarksList';
import PersonInfo from './personalinfoEdit';
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
            info: global.user.profile,
            country: global.user.addressComponent.country,
            province: global.user.addressComponent.province,
            city: global.user.addressComponent.city,
            district: global.user.addressComponent.district
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
        var titles = ['服务('+global.user.offer_count+')', '需求('+global.user.request_count+')', '收藏('+global.user.favorites_count+')'];
        return(
          <View style={styles.container}>
            <View style={styles.headerView}>
                <View style={{ flexDirection:'row', justifyContent:'flex-start' }}>
                    <View style={{}}>
                        <TouchableOpacity onPress={this.clickJump.bind(this)}>
                        <Image style={{width: 72, height:72, borderRadius: 36, justifyContent:'flex-end', alignItems:'flex-end'}} source={{uri:this.state.avatar}}>
                        </Image>
                        <Image style={{width:20, height:20, borderRadius: 10,position: 'absolute',left: 52, top: 52}} source={require('../resource/y-call-tx3x.png')}/>
                        </TouchableOpacity>
                    </View>
                    <View style={{justifyContent:'space-between', alignItems:'flex-start',marginLeft: 15}}>
                        <Text style={{fontSize:16, color:'white'}}>{global.user.name}</Text>
                        <Text style={styles.text}>{this.state.country} {this.state.province} {this.state.city} {this.state.district}</Text>
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
                renderTabBar={() => <ScrollableTabBar tabNames={titles}/>}
                tabBarPosition='top'
                scrollWithoutAnimation={false}
                tabBarActiveTextColor="#4a90e2"
                tabBarInactiveTextColor="#1b2833"
                tabBarUnderlineStyle={{ backgroundColor: '#4a90e2', height: 2 }}
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
    container: {
        flex: 1,
    },
    headerView: {
        backgroundColor: '#4a90e2',
        paddingTop: Platform.OS === 'ios' ? 40 : 20,
    },
    text: {
        fontSize: 14,
        color: 'white',
    }
})
