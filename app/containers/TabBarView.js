/**
 * Created by ljunb on 16/5/26.
 */
import React, {PureComponent} from 'react'
import {
    View,
    Text,
} from 'react-native'
import RootStore from '../mobx'
import Feed from '../pages/feed/Feed'
import FoodEncyclopedia from '../pages/home/FoodEncyclopedia'
import Profile from '../pages/profile/Profile'
import TabBar from '../components/TabBar'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import Bussiness from '../pages/buzz/Bussiness';
import ServOffer from '../server/servoffer'

const tabTitles = ['Buzz', 'Explore', '', 'Me', 'Chats']
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
                        tabIconNames={tabIcons}
                        selectedTabIconNames={tabSelectedIcon}
                    />
                }
                tabBarPosition='bottom'
                tabBarActiveTextColor='#665dc6'
                tabBarTextStyle={{fontSize: 18}}
                locked
                scrollWithoutAnimation
                onChangeTab={this._onChangeTab}
            >
                <Bussiness tabLabel="Buzz" navigator={this.props.navigator}/>
                <Feed tabLabel="Home" navigator={this.props.navigator}/>
                <FoodEncyclopedia tabLabel="Profile" navigator={this.props.navigator}/>
                <Profile tabLabel="Home" navigator={this.props.navigator}/>
                <ServOffer tabLabel="ServOffer" navigator={this.props.navigator}/>
            </ScrollableTabView>
        )
    }
}