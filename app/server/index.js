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
    PixelRatio,
    Alert,
    Animated,
} from 'react-native'
import NavPage from './nav/index';
import TabBarView from'../containers/TabBarView';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: global.gColors.themeColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleText: {
        marginTop: 12,
        color: '#ffffff',
        fontSize: 14,
    },
    clickItem: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemImageContent: {
        borderRadius: 12,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 0.3,
    },
    itemImage: {
        width: 130,
        height: 130,
        borderRadius: 12,
    },
});

export default class Server extends Component {

    constructor(props) {
        super(props);

        this.state = {
            user: this.props.user,
            pwd: this.props.pwd,
            goods_tpye:this.props.goods_tpye,
            itemsSpacing: new Animated.Value(gScreen.width),
            buttonBottom: new Animated.Value(10),
            rotateAngle: new Animated.Value(0.25),
            buttonColor: new Animated.Value(0),
        };  
    }
    componentDidMount() {
        Animated.parallel([
            Animated.timing(
              this.state.itemsSpacing,
              {
                  toValue: 35,
              }
            ).start(),
            Animated.timing(
              this.state.buttonBottom,
              {
                  toValue: 48,
              }
            ),
            Animated.timing(
              this.state.rotateAngle,
              {
                  toValue: 1,
              }
            ),
            Animated.timing(
              this.state.buttonColor,
              {
                  toValue: 1,
              }
            ),
        ]).start();
    }

    clickNavigationJump(serv) {        
        const { navigator } = this.props; 
        this.state.goods_tpye= serv;
        let goods_tpye =this.state.goods_tpye;
        // console.log("goods_tpye:"+this.state.goods_tpye);
        if (navigator&&goods_tpye) {
            navigator.resetTo({
                name: 'NavPage',  
                component: NavPage,  
                passProps: {goods_tpye},
            });
        }
    }

    render() {
        const rotateAngle = this.state.rotateAngle.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        });
        const buttonColor = this.state.buttonColor.interpolate({
            inputRange: [0, 1],
            outputRange: [global.gColors.buttonColor, 'transparent']
        });
        return (
            <View style={styles.container}>
                <View style={{ flexDirection: 'row' }}>
                    <Animated.View style={{ marginRight: this.state.itemsSpacing }}>
                        <TouchableOpacity style={styles.clickItem} onPress={() => {this.clickNavigationJump("serv_offer")}}>
                            <View elevation={5} style={styles.itemImageContent}>
                                <Image style={styles.itemImage} source={require('../resource/t_offer_serv.png')} />
                            </View>
                            <Text style={styles.titleText}>发布服务</Text>
                        </TouchableOpacity>
                    </Animated.View>
                    <TouchableOpacity style={styles.clickItem}  onPress={() => {this.clickNavigationJump("serv_request")}}>
                        <View elevation={5} style={styles.itemImageContent}>
                            <Image elevation={5} style={styles.itemImage} source={require('../resource/t_serv_request.png')} />
                        </View>
                        <Text style={styles.titleText}>发布需求</Text>
                    </TouchableOpacity>
                </View>
                <Animated.View style={{ position: 'absolute', borderRadius: 25, backgroundColor: buttonColor, bottom: this.state.buttonBottom, transform: [{ rotate: rotateAngle }] }} >
                    <TouchableOpacity onPress={() => {this.props.navigator.resetTo({component: TabBarView})}}>
                        <Image style={{ width: 50, height: 50 }} source={require('../resource/w-cancel-line-nor.png')} />
                    </TouchableOpacity>
                </Animated.View>
            </View>
        )
    }
}