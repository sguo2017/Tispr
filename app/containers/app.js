import React, {PureComponent} from 'react'
import {
    View,
    Platform,
    StatusBar
} from 'react-native';
import NavigationExperimental from 'react-native-deprecated-custom-components';
import {observer} from 'mobx-react/native'
import Splash from '../pages/Splash'
import RootStore from '../mobx'

@observer
export default class App extends PureComponent {

    _configureScene = route => {
        if (route.sceneConfig) return route.sceneConfig

        return {
            ...NavigationExperimental.Navigator.SceneConfigs.PushFromRight,
            gestures: {}    // 禁用左滑返回手势
        }
    }

    _renderScene = (route, navigator) => {
        let Component = route.component
        return <Component navigator={navigator}{...route.passProps}/>
    }

    render() {
        const initialPage = Splash; // Platform.OS === 'ios' ? TabBarView : Splash
        const initialPageName = 'Splash';// Platform.OS === 'ios' ? 'TabBarView' : 'Splash'

        return (
            <View style={{flex: 1}}>
                <StatusBar barStyle={RootStore.barStyle}/>
                <NavigationExperimental.Navigator
                    initialRoute={{name: initialPageName, component: initialPage}}
                    configureScene={this._configureScene}
                    renderScene={this._renderScene}
                />
            </View>
        )
    }
}
