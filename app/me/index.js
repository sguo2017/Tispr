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
const titles = ['Offers', 'Requests', 'Bookmarks'];

import OffersList from './page/offersList'
import RequestsList from './page/requestsList';
import BookmarksList from './page/bookmarksList';
import PersonInfo from './page/personalinfoEdit';
import ImagePicker from 'react-native-image-picker';
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
        }
    }
   

    clickJump() {
        let _this = this;
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({　　//navigator.push 传入name和你想要跳的组件页面
                name: "PersonInfo",
                component: PersonInfo,
                params: {
                    fileName: "fileName",
                    fileSource: "fileSource",
                    getdata: (a)=>{
                    _this.setState({
                        avatar:a
                        })
                    }
                }
            });
        }
    }


     render() {
        return(

              <View style={styles.listView}>
                <Header
                    title='Tisprs'
                />
                <View style={{flexDirection:'row', justifyContent:'flex-start',margin: 20}}>
                    <View style={{}}>
                        <TouchableOpacity onPress={this.clickJump.bind(this)}>
                        <Image style={{width:80, height:80, borderRadius: 40, justifyContent:'flex-end', alignItems:'flex-end'}} source={{uri:this.state.avatar}}>
                        </Image>
                        <Image style={{width:20, height:20, borderRadius: 10,position: 'absolute',left: 60, top: 60}} source={require('../resource/icon_tel.png')}/>
                        </TouchableOpacity>
                    </View>
                    <View style={{justifyContent:'space-between', alignItems:'flex-start',marginLeft: 15}}>
                        <Text style={{fontSize:20, color:'black'}}>{global.user.name}</Text>
                        <Text>番禺区，广州市，广东省，中国</Text>
                        <Text style={{backgroundColor:'grey', color:'white',borderRadius: 10,paddingLeft: 10, paddingRight:10}}>
                            <Text style={{}}>Complete your profile!</Text>
                        </Text>
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
                                navigator={navigator}
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
        backgroundColor: '#f5f5f5'
    }
})
