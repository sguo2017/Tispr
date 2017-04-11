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

     render() {
        return(

              <View style={styles.listView}>
                <Header
                    title='Tisprs'
                />
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
