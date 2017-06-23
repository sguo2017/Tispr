import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import GlobalContants from '../common/globalContants';

const styles = StyleSheet.create({
  container: {
    height: 70,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    marginTop: -20,
    alignItems: 'flex-end',
  },
  centerTab: {
    height: 70,
    width: gScreen.width / 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  tab: {
    height: 50,
    width: gScreen.width / 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },

  tabItem: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  icon: {
    width: 26,
    height: 26,
    marginBottom: 2
  },
  centerIcon: {
    width: 60,
    height: 60,
  },
  backgroundBar: {
    position: 'absolute',
    zIndex: 0,
    borderTopColor: global.gColors.themeColor,
    borderTopWidth: 0.5,
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: '#ffffff'
  },
})

export default class RudderTabBar extends Component {
  static propType = {
    goToPage    : React.PropTypes.func,
    activeTab   : React.PropTypes.number,
    tabs        : React.PropTypes.array,

    tabNames    : React.PropTypes.array,
    tabIconNames: React.PropTypes.array
  };

  componentDidMount() {
    this.props.scrollValue.addListener(this.setAnimationValue);
  }

  setAnimationValue({value}) {

  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.backgroundBar} />
        {this.props.tabs.map((tab, i) => {
          let icon = this.props.activeTab == i ? this.props.selectedTabIconNames[i] : this.props.tabIconNames[i];
          let color = this.props.activeTab === i ? global.gColors.themeColor : '#999999';
          if (i == 2) {
            return (
              <TouchableOpacity
                key={i}
                activeOpacity={0.8}
                style={styles.centerTab}
                onPress={()=>this.props.goToPage(i)}
              >
                <Image
                  style={styles.centerIcon}
                  source={icon}
                />
              </TouchableOpacity>
            )
          } else {
            return (
              <TouchableOpacity
                key={i}
                activeOpacity={0.8}
                style={styles.tab}
                onPress={()=>this.props.goToPage(i)}
              >
                <View style={styles.tabItem}>
                  <Image
                    style={styles.icon}
                    source={icon}
                  />
                  <Text style={{color: color, fontSize: 12}}>
                    {this.props.tabNames[i]}
                  </Text>
                </View>
              </TouchableOpacity>
            )
          }
        })}
      </View>
    )
  }
}
