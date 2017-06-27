import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    LayoutAnimation,
    Platform,
    UIManager,
    Dimensions
} from 'react-native';
import Constants from '../common/constants';
const screenW = Dimensions.get('window').width;
const IndicatorAnimation = {
    duration: 100,
    create: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.left
    },
    update: {
        type: LayoutAnimation.Types.easeInEaseOut
    }
}

export default class TabCategoryBar extends Component {
    static propType = {
        goToPage: React.PropTypes.func,
        activeTab: React.PropTypes.number,
        tabs: React.PropTypes.array,

        tabNames: React.PropTypes.array
    };

    constructor(props) {
        super(props);
        this.setAnimationValue = this.setAnimationValue.bind(this);
        this.state = {
            indicatorPosition: 0
        }
    }

    componentDidMount() {
        this.props.scrollValue.addListener(this.setAnimationValue);
    }
    // paddingTop: Platform.OS === 'ios' ? 20 : 0,
    setAnimationValue({value}) {
        // console.log(value);
        LayoutAnimation.linear();
        this.setState({indicatorPosition: value * Constants.window.width / 4})
    }

    render() {
        return (
            <View style={{
                backgroundColor:global.gColors.themeColor,
                padding:5,
                paddingTop: Platform.OS === 'ios' ? 25 : 5,
            }}>
                <View style={styles.tabs}>
                {this.props.tabs.map((tab, i) => {
                    let color = this.props.activeTab === i ?  global.gColors.themeColor:'white' ;
                    let bgcolor = this.props.activeTab === i ? 'white': global.gColors.themeColor ;
                    return (
                        <TouchableOpacity
                            key={i}
                            activeOpacity={0.8}
                            style={[styles.tab,{backgroundColor: bgcolor}]}
                            onPress={() => this.props.goToPage(i)}
                        >
                            <Text style={{ color: color, fontSize: 14 }}>
                                {this.props.tabNames[i]}
                            </Text>
                        </TouchableOpacity>
                    )
                })}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    tabs: {
        flexDirection: 'row',
        height: 28,
        borderWidth: 1,
        margin: 6,
        borderColor: '#fff',
        backgroundColor:global.gColors.themeColor,
        borderRadius: 5,
        overflow: 'hidden',
    },
    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: screenW*0.2,
    },
    indicatorContainer: {
        position: 'absolute',
        bottom: 7,
        height: 3,
        width: Constants.window.width / 4,
        alignItems: 'center'
    }
});