import React, { Component, PureComponent } from 'react'
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
import { observer } from 'mobx-react/native'
import { reaction } from 'mobx'
import Header from '../components/HomeNavigation';
import ScrollableTabView from 'react-native-scrollable-tab-view'
import ChatList from './ChatIndex';
import BuzzList from './SysMsgIndex';
import TabCategoryBar from './TabCategoryBar';
const titles = ['消息', '通知'];
const controllers = [
    {controller: ChatList},
    {controller: BuzzList},
]

const KNOWLEDGE_ID = 3

@observer
export default class Chat extends PureComponent {

    render() {
        return (
            <View style={styles.listView}>
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
        backgroundColor: '#f5f5f5'
    }
})