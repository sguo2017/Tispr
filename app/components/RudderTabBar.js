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
    height: 60,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    marginTop: -20,
    alignItems: 'flex-end',
  },
  centerTab: {
    height: 60,
    width: gScreen.width / 5,
    justifyContent: 'center',
    alignItems: 'center',
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
    //zIndex: 0,
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: 'white',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 0.3,
  },
  centerBackground: {
    position: 'absolute',
    bottom: 0,
    right: (gScreen.width / 5 - 60) / 2,
    //zIndex: 0,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 0.3,
  },
  centerCover: {
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: 0,
    //zIndex: 1,
    height: 49.5,
    backgroundColor: 'white',
  }
})

export default class RudderTabBar extends Component {
  static propType = {
    goToPage    : React.PropTypes.func,
    activeTab   : React.PropTypes.number,
    tabs        : React.PropTypes.array,

    tabNames    : React.PropTypes.array,
    tabIconNames: React.PropTypes.array,
    centralEvent: React.PropTypes.func,
  };

  componentDidMount() {
    this.props.scrollValue.addListener(this.setAnimationValue);
  }

  setAnimationValue({value}) {

  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.backgroundBar} elevation={7}/>
        {this.props.tabs.map((tab, i) => {
          let icon = this.props.activeTab == i ? this.props.selectedTabIconNames[i] : this.props.tabIconNames[i];
          let color = this.props.activeTab === i ? global.gColors.themeColor : '#999999';
          if (i == 2) {
            return (
              <View key={i} style={styles.centerTab} elevation={7}>
                <View style={styles.centerBackground} elevation={5}/>
                <View style={styles.centerCover} elevation={5}/>     
                <View elevation={6}>
                  <TouchableOpacity
                  style={{ zIndex: 999 }}   
                  activeOpacity={0.8}
                  onPress={()=>this.props.centralEvent()}
                >
                  <Image
                    style={{ height: 50, width: 50 }}
                    source={icon}
                  />
                </TouchableOpacity>
                </View>   
              </View>
            )
          } else {
            return (
              <View elevation={7} key={i} style={styles.tab}>
                <TouchableOpacity
                  activeOpacity={0.8}
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
              </View>
            )
          }
        })}
      </View>
    )
  }
}
