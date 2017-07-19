import React, {PureComponent} from 'react'
import {
    View,
    Text,
} from 'react-native'
import RootStore from '../mobx'
import RudderTabBar from '../components/RudderTabBar'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import Server from '../server/index'
import Buzz from '../buzz/index';
import Explore from '../explore/index';
import Me from '../me/index';
import Chat from '../chat/index';

const tabTitles = ['动态', '发现', '发布', '消息', '我的']
const tabIcons = [
    require('../resource/tabbar/ico_dt_nor.png'),
    require('../resource/tabbar/ico_fx_nor.png'),
    require('../resource/tabbar/ico_fb_nor.png'),
    require('../resource/tabbar/ico_xx_nor.png'),
    require('../resource/tabbar/ico_wd_nor.png')
]
const tabSelectedIcon = [
    require('../resource/tabbar/ico_dt_hl.png'),
    require('../resource/tabbar/ico_fx_hl.png'),
    require('../resource/tabbar/ico_fb_nor.png'),
    require('../resource/tabbar/ico_xx_hl.png'),
    require('../resource/tabbar/ico_wd_hl.png')
]

export default class TabBarView extends PureComponent {

    _onChangeTab = ({i}) => RootStore.barStyle = i == 1 ? 'default' : 'light-content'

    render() {
        return (
          <ScrollableTabView
            renderTabBar={() =>
              <RudderTabBar
                tabNames={tabTitles}
                tabIconNames={tabIcons}
                selectedTabIconNames={tabSelectedIcon}
                centralEvent={()=>{
                    this.props.navigator.resetTo({component:Server, name:'Server',passProps:{}})
                }}
              />
            }
            initialPage  = {this.props.initialPage?this.props.initialPage: 0}
            tabBarPosition='bottom'
            tabBarActiveTextColor={global.gColors.themeColor}
            tabBarTextStyle={{fontSize: 18}}
            locked
            scrollWithoutAnimation
            onChangeTab={this._onChangeTab}
          >
              <Buzz tabLabel="Buzz" navigator={this.props.navigator}/>
              <Explore tabLabel="Explore" categoryId={0} navigator={this.props.navigator} city={this.props.city}/>
              {/*<Server tabLabel="Server" navigator={this.props.navigator}/>*/}
              <View />
              <Chat tabLabel="Chat" navigator={this.props.navigator}/>
              <Me tabLabel="Me" isBrowseMode={false} navigator={this.props.navigator}/>
          </ScrollableTabView>
        )
    }
}