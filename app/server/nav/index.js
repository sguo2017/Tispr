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
import TabCategoryBar from './TabCategoryBar'
import Constant from '../../common/constants';
const titles = ['1aaa', '2bbb', '3ccc', '4ddd','5aaa', '6bbb', '7ccc', '8ddd','9fff'];

import OffersList from '../../me/page/offersList'
import RequestsList from '../../me/page/requestsList';
import BookmarksList from '../../me/page/bookmarksList';
import Catalog from './catalog'
import ServOffer from './index';
const controllers = [
    {categoryId: 1, controller: Catalog},
    {categoryId: 2, controller: Catalog},
    {categoryId: 3, controller: Catalog},
    {categoryId: 4, controller: Catalog},
    {categoryId: 5, controller: Catalog},
    {categoryId: 6, controller: Catalog},
    {categoryId: 7, controller: Catalog},
    {categoryId: 8, controller: Catalog},
    {categoryId: 9, controller: Catalog}
]

export default class navpage extends Component{

    render(){
        return(
            <View style={styles.listView}>
                <Header
                    leftIconAction={() => this.props.navigator.pop()}
                    title='Chose a Category'
                    leftIcon={require('../../resource/ic_back_dark.png')}
                    rightIconAction = {() => {const { navigator } = this.props;navigator.push({name: "ServOffer", component: ServOffer})}} 
                    rightIcon={require('../../resource/ic_contrast_add.png')}
                />
                
                <ScrollableTabView
                    style={{height:100}}
                    contentContainerStyle = {{paddingVertical: -50, marginBottom: -300,}}
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
        backgroundColor: '#f5f5f5',
        height: 200
    }
})