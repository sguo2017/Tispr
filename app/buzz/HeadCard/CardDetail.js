import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    WebView,
    Image,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    ScrollView,
    Platform,
    Dimensions,
    Alert,
    ListView
} from 'react-native';
import Header from '../../components/HomeNavigation';
import Constant from '../../common/constants';
import ConnectPage from './ConnectPage'

const screenW = Dimensions.get('window').width;

export default class CardDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            })
        }
    }


    _p() {
        this.props.navigator.push({
            component: ConnectPage,
            passProps: {feed:this.props.feed, callback: this.props.callback, discardIndex:this.props.discardIndex}
        })
    }

    render() {
        const { feed } = this.props;
        let platformMargin = Platform.OS === 'ios' ? -40 : -30;
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <Header
                    leftIconAction={() => this.props.navigator.pop()}
                    title='需求'
                    leftIcon={require('../../resource/ic_back_white.png')}
                />

                <View style={[styles.cardImageContent]}>
                    <ScrollView>
                    <View style={{paddingHorizontal: 16, justifyContent: 'space-between', backgroundColor: 'white'}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, height: 48, }}>
                            <View style={{justifyContent: 'space-around', flexDirection: 'row',}}>
                                <Image style={{width: 32, height: 32, borderRadius: 16}} source={{ uri: feed.avatar }} defaultsource={require('../../resource/user_default_image.png')}></Image>
                                <View style={{marginLeft: 8, marginTop: -5}}>
                                    <Text style={{fontSize: 14, lineHeight: 20}}>{feed.user_name}</Text>
                                    {
                                        feed.catalog?
                                        <Text style={{color: '#999999', fontSize: 12}}>{feed.catalog}</Text>
                                        :<Text style={{color: '#999999', fontSize: 12}}>其它分类</Text>
                                    }
                        
                                </View>
                            </View>
                            <View>
                                <Text style={{color: '#999999', fontSize: 12}}>{feed.created_at.substring(0,10)}</Text>
                            </View> 
                        </View>
                        <Text style={{color: '#424242', fontSize: 16, lineHeight: 24}}>{feed.serv_detail}</Text>
                        {
                            feed.serv_images?<ListView
                            dataSource={this.state.dataSource.cloneWithRows(feed.serv_images.split(','))}
                            renderRow={(rowData) =>
                                <Image defaultSource={require('../../resource/img_default_home_cover.png')} source={{uri:rowData}} style={{height: 300, width: 328, marginBottom: 10}}></Image>
                            }/>: <View></View>
                        } 
                        <View style={{flexDirection: 'row', marginTop: 20, height: 48, justifyContent: 'space-between'}}>
                            <Text style={{fontSize: 16, color: 'black'}}>投标&nbsp;&nbsp;&nbsp;4/5</Text>
                            <TouchableOpacity style={{backgroundColor: '#4A90E2', borderRadius: 2, height: 28, width: 72}}>
                                <Text style={{color: 'white', marginHorizontal: 8, marginVertical: 4}}>增加投标</Text>
                            </TouchableOpacity>
                        </View>                                                                    
                    </View>
                    <ListView
                        dataSource={this.state.dataSource.cloneWithRows(['row1', 'row2', 'row3', 'row4'])}
                        renderRow={(rowData) => 
                            <View style={{backgroundColor: '#FFFFFF', height: 64, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12}}>
                                <Image source={require('../../resource/user_default_image.png')} style={{borderRadius: 20, width: 40, height: 40}}></Image>
                                <Text style={{color: '#1B2833', fontSize: 16, flexShrink: 0, marginLeft: 12}}>Frank Gardner</Text>
                                <Image source={require('../../resource/g_chevron right.png')} style={{position: 'absolute', right: 16}}></Image>
                            </View>
                        }
                    />
                    <View style={{backgroundColor: 'white', paddingTop: 23, paddingBottom: 10}}>
                        <TouchableOpacity style={{backgroundColor: '#FFC400', borderRadius: 4, height: 44, marginHorizontal: 16, paddingHorizontal: 138, paddingVertical: 10}}
                            onPress={() => this._p(feed)}
                        >
                            <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>联系TA</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({

    bottomToolBar: {
        height: 44,
        width: Constant.window.width,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopColor: '#ccc',
        position: 'absolute',
        bottom: 5,
        backgroundColor: global.gColors.buttonColor,
    },
    cardImageContent: {
        height: Constant.window.height - (Platform.OS === 'ios' ? 64 : 50) - 44,
        width: Constant.window.width,
        backgroundColor: global.gColors.bgColors,
        top: Platform.OS === 'ios' ? 64 : 50,
        bottom: 44,
        position: 'absolute'
    },
    line: {
        height: 30,
        width: Constant.window.onePR,
        backgroundColor: '#ccc'
    }
})
