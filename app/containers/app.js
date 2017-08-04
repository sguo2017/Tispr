import React, {PureComponent} from 'react'
import {
    View,
    Platform,
    StatusBar,
    StyleSheet
} from 'react-native';
import NavigationExperimental from 'react-native-deprecated-custom-components';
import {observer} from 'mobx-react/native'
import Splash from '../pages/Splash'
import RootStore from '../mobx'

const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <StatusBar backgroundColor={backgroundColor} {...props} />
  </View>
);


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
                {
                    Platform.OS === 'ios' ?<View></View>:
                    <MyStatusBar backgroundColor={global.gColors.themeColor} barStyle="light-content" />
                }
                <NavigationExperimental.Navigator
                    initialRoute={{name: initialPageName, component: initialPage}}
                    configureScene={this._configureScene}
                    renderScene={this._renderScene}
                />
            </View>
        )
    }
}

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
  content: {
    flex: 1,
    backgroundColor: '#33373B',
  },
});