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
    Alert
} from 'react-native'
import NavPage from './nav/index';
import TabBarView from'../containers/TabBarView';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: global.gColors.themeColor,
        justifyContent: 'flex-end',
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
        };  
    }

    clickNavigationJump(serv) {        
        const { navigator } = this.props; 
        this.state.goods_tpye= serv;
        let goods_tpye =this.state.goods_tpye;
        console.log("goods_tpye:"+this.state.goods_tpye);
        if (navigator&&goods_tpye) {
            navigator.resetTo({
                name: 'NavPage',  
                component: NavPage,  
                passProps: {goods_tpye},
            });
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={[styles.clickItem, { marginRight: 35 }]} onPress={() => {this.clickNavigationJump("serv_offer")}}>
                        <View elevation={5} style={styles.itemImageContent}>
                            <Image style={styles.itemImage} source={require('../resource/t_offer_serv.png')} />
                        </View>
                        <Text style={styles.titleText}>发布服务</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.clickItem}  onPress={() => {this.clickNavigationJump("serv_request")}}>
                        <View elevation={5} style={styles.itemImageContent}>
                            <Image elevation={5} style={styles.itemImage} source={require('../resource/t_serv_request.png')} />
                        </View>
                        <Text style={styles.titleText}>发布需求</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{ marginTop: 110, marginBottom: 48 }} onPress={() => {this.props.navigator.resetTo({component: TabBarView})}}>
                    <Image style={{ width: 48, height: 48 }} source={require('../resource/w-cancel-line-nor.png')} />
                </TouchableOpacity>
            </View>
        )
    }
}