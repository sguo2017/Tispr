import React, { Component, PureComponent } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    ProgressBarAndroid,
    TouchableOpacity,
    TouchableHighlight,
    Platform,
    StyleSheet,
    Navigator,
    AsyncStorage,
    PixelRatio,
    Alert
} from 'react-native'

import Header from '../../components/HomeNavigation';
import ScrollableTabView from 'react-native-scrollable-tab-view'
import TabCategoryBar from '../../me/TabCategoryBar'
import Constant from '../../common/constants';
const titles = ['1aaa', '2bbb', '3ccc', '4ddd','5aaa', '6bbb', '7ccc', '8ddd','9fff'];

import OffersList from '../../me/page/offersList'
import RequestsList from '../../me/page/requestsList';
import BookmarksList from '../../me/page/bookmarksList';
const controllers = [
    {categoryId: 1, controller: OffersList},
    {categoryId: 2, controller: RequestsList},
    {categoryId: 3, controller: BookmarksList},
    {categoryId: 4, controller: BookmarksList},
    {categoryId: 5, controller: BookmarksList},
    {categoryId: 6, controller: BookmarksList},
    {categoryId: 7, controller: BookmarksList},
    {categoryId: 8, controller: BookmarksList},
    {categoryId: 9, controller: BookmarksList}
]

export default class navpage extends Component{
    render(){
        return(
            <View style={styles.listView}>
                <Header
                    leftIconAction={() => this.props.navigator.pop()}
                    title='Chose a Category'
                    leftIcon={require('../../resource/ic_back_dark.png')}
                />
                
                <ScrollableTabView
                    renderTabBar={() => <TabCategoryBar tabNames={titles}/>}
                    tabBarPosition='top'
                    locked={false}
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