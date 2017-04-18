import React, {PureComponent} from 'react'
import {
    StyleSheet,
    View,
    Text,
    Image,
    ListView,
    TouchableOpacity,
    RefreshControl,
} from 'react-native'
import Header from '../components/HomeNavigation';
import ScrollableTabView from 'react-native-scrollable-tab-view'
import TabCategoryBar from './TabCategoryBar'

const titles = ['Offers', 'Requests', 'Bookmarks'];

import OffersList from './page/offersList'
import RequestsList from './page/requestsList';
import BookmarksList from './page/bookmarksList';

const controllers = [
    {categoryId: 1, controller: OffersList},
    {categoryId: 2, controller: RequestsList},
    {categoryId: 3, controller: BookmarksList}
]

export default class MeInfo extends PureComponent {
    componentWillMount(){
        //global.username =
        //global.avatar =
    }
     render() {
        return(

              <View style={styles.listView}>
                <Header
                    title='Tisprs'
                />
                <View style={{flexDirection:'row', justifyContent:'flex-start',margin: 20}}>
                    <View style={{}}>
                        <Image style={{width:80, height:80, borderRadius: 40, justifyContent:'flex-end', alignItems:'flex-end'}} source={{uri:global.user.avatar}}>
                        </Image>
                        <Image style={{width:20, height:20, borderRadius: 10,position: 'absolute',left: 60, top: 60}} source={require('../resource/icon_tel.png')}/>
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
