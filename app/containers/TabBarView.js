import React, {PureComponent} from 'react'
import {
    View,
    Text,
} from 'react-native'
import RootStore from '../mobx'
import FoodEncyclopedia from '../pages/home/FoodEncyclopedia'
import Profile from '../pages/profile/Profile'
import TabBar from '../components/TabBar'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import Bussiness from '../pages/buzz/Bussiness';
import Server from '../server/index'
import Buzz from '../buzz/index';
import Explore from '../explore/index';
import Me from '../me/index';
import Chat from '../chat/index';

const tabTitles = ['动态', '发现', '发布', '消息', '我的']
const tabIcons = [
    require('../resource/ic_tab_buzz.png'),
    require('../resource/ic_tab_explore.png'),
    require('../resource/ic_tab_add.png'),
    require('../resource/ic_tab_my.png'),
    require('../resource/ic_tab_chats.png')
]
const tabSelectedIcon = [
    require('../resource/ic_tab_buzz_select.png'),
    require('../resource/ic_tab_explore_select.png'),
    require('../resource/ic_tab_add_select.png'),
    require('../resource/ic_tab_my_select.png'),
    require('../resource/ic_tab_chats_select.png')
]

export default class TabBarView extends PureComponent {

    _onChangeTab = ({i}) => RootStore.barStyle = i == 1 ? 'default' : 'light-content'

    render() {
        return (
            <ScrollableTabView
                renderTabBar={() =>
                    <TabBar
                        tabNames={tabTitles}
                    />
                }
                tabBarPosition='bottom'
                tabBarActiveTextColor={global.gColors.themeColor}
                tabBarTextStyle={{fontSize: 18}}
                locked
                scrollWithoutAnimation
                onChangeTab={this._onChangeTab}
            >
                <Buzz tabLabel="Buzz" navigator={this.props.navigator}/>
                <Explore tabLabel="Explore" categoryId={0} navigator={this.props.navigator}/>
                <Server tabLabel="Server" navigator={this.props.navigator}/>
                <Chat tabLabel="Chat" navigator={this.props.navigator}/>
                <Me tabLabel="Me" navigator={this.props.navigator}/>       
            </ScrollableTabView>
        )
    }
}
