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
    ListView,
    Modal
} from 'react-native';
import { observer } from 'mobx-react/native'
import Header from '../../components/HomeNavigation';
import Constant from '../../common/constants';
import UserDefaults from '../../common/UserDefaults';
import Report from '../../sys/others/report';
import Util from '../../common/utils';
const screenW = Dimensions.get('window').width;

@observer
export default class RequestMsgDetail extends Component {
    constructor(props) {
        super(props);
         this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            show_modal: false,
            isFavorited: this.props.feed.isFavorited,
            favorite_id: this.props.feed.favorite_id,
            isReported: this.props.feed.isReported
        };
    }

     _switch() {
        if (this.state.isFavorited) {
            this.cancelCollect()
        } else {
            this.collect()
        }
    }

    async collect() {
        try {
            let t = global.user.authentication_token;
            let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_SERV_OFFER_COLLECT + t;
            console.log("69")
            let response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    favorite: {
                        obj_id: this.props.feed.id,
                        obj_type: 'serv_request',
                        user_id: global.user.id,
                    }
                })
            });

            let res = await response.text();
            if (response.status >= 200 && response.status < 300) {
                let rmsg = JSON.parse(response._bodyText);
                this.props.feed.favorite_id = rmsg.favorite_id;
                this.props.feed.isFavorited? (this.props.feed.isFavorited= true):(this.props.isFavorited);
                this.setState({ isFavorited: true });
            } else {
                let error = res;
                throw error;
            }
        } catch (error) {
            console.log(`Fetch evaluating list error: ${error}`)
        }
    }

    async cancelCollect() {
        try {
            let t = global.user.authentication_token;
            let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_SERV_OFFER_COLLECT_CANCEL + '/' + this.props.feed.favorite_id + '?token=' + t;
            console.log("101")
            let response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });

            let res = await response.text();
            if (response.status >= 200 && response.status < 300) {
                this.props.feed.isFavorited = false;
                global.user.favorites_count--;
                this.setState({ isFavorited: false });
            } else {
                let error = res;
                throw error;
            }
        } catch (error) {
            console.log(`Fetch evaluating list error: ${error}`)
        }
    }

    reportRequest(id) {
        this.setState({
            show_modal: false,
        })
        let obj = {
            id: id,
            type: 'good'
        };
        let _this = this;
        let getData = (a) => {
            _this.setState({isReported: a})
        }
        this.props.navigator.push({
            component: Report,
            passProps: { obj, getData}
        });
    }

    render() {
        const { feed } = this.props;
          let platformMargin = Platform.OS === 'ios' ? -40 : -30;
  

        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>


                <Header
                    leftIconAction={() => this.props.navigator.pop()}
                    title='查看详情'
                    leftIcon={require('../../resource/ic_back_white.png')}
                    rightIcon={require('../../resource/w-more.png')}
                    rightIconAction={() => {
                        this.setState({show_modal: true})
                    }
                    }
                   />
                <View style={[styles.cardImageContent]}>
                    <ScrollView>
                        <View style={{paddingHorizontal: 16, justifyContent: 'space-between', backgroundColor: 'white'}}>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, height: 48, }}>
                                <View style={{justifyContent: 'space-around', flexDirection: 'row',}}>
                                    <Image style={{width: 32, height: 32, borderRadius: 16}} source={{ uri: feed.user.avatar }} defaultsource={require('../../resource/user_default_image.png')}></Image>
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
                                    <Image  source={{uri:rowData}} style={{height: 300, width: 328, marginBottom: 10}}></Image>
                                }/>: <View></View>
                            }                                                                     
                        </View>
                
                            {
                                feed.user_id == global.user.id?
                                <View></View>:
                                <View style={{backgroundColor: 'white', paddingTop: 23, paddingBottom: 10}}>
                                    <TouchableOpacity style={{backgroundColor: '#FFC400', borderRadius: 4, height: 44, marginHorizontal: 16, paddingHorizontal: 138, paddingVertical: 10}}
                                        onPress={() => this._p(feed)}
                                    >
                                        <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>联系TA</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                    </ScrollView>
                </View>
                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={this.state.show_modal}
                    onRequestClose={() => {}}
                >
                    <View style={styles.container}> 
                    <View style={styles.modal}>
                        <View style={{ borderRadius: 16, backgroundColor: 'white'}}>
                            <TouchableOpacity 
                                style={[styles.modalItem, {alignItems: 'center', justifyContent:'center',}]}
                                onPress={()=>{
                                    this._switch(this.state.isFavorited, this.state.favorite_id);
                                    this.setState({show_modal: false})
                                }}
                            >
                                {!this.state.isFavorited?
                                <View style={{ flexDirection: 'row' }}>
                                    <Image source={require('../../resource/b-archive.png')} />
                                    <Text style={styles.modalText}>存档</Text>
                                </View>:
                                <View style={{ flexDirection: 'row' }}>
                                    <Image source={require('../../resource/y-check-r.png')} />
                                    <Text style={{ lineHeight: 21 }}>已存档</Text>
                                </View>}
                            </TouchableOpacity>
                            <View style={{height: 0.5, backgroundColor: 'rgba(237,237,237,1)'}}></View>
                            {!this.state.isReported?
                            <TouchableOpacity style={[styles.modalItem, {justifyContent: 'center', alignItems: 'center' }]}
                                onPress={
                                    this.reportRequest.bind(this, feed.id)
                                }
                            >
                                <View style={{ flexDirection: 'row' }}>
                                    <Image source={require('../../resource/y-jubao.png')} />
                                    <Text style={styles.modalText}>举报</Text>
                                </View>
                            </TouchableOpacity>:
                            <View style={[styles.modalItem, {justifyContent: 'center', alignItems: 'center' }]}>
                                <Text style={{ fontSize: 14, lineHeight: 20 }}>已举报</Text>
                            </View>
                            }
                            
                        </View>
                        <TouchableOpacity 
                            onPress={() => this.setState({ show_modal: false })} 
                            style={{ alignItems: 'center', justifyContent: 'center', marginTop: 6, borderRadius: 16, backgroundColor: 'white', height: 56}}>
                            <Text style={styles.modalText}>取消</Text>
                        </TouchableOpacity>
                    </View>
                    </View>
                </Modal>
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
        backgroundColor: global.gColors.buttonColor
    },
    cardImageContent: {
        height: Constant.window.height - (Platform.OS === 'ios' ? 64 : 50) - 44,
        width: Constant.window.width,
        backgroundColor: '#f5f5f5',
        top: Platform.OS === 'ios' ? 64 : 50,
        bottom: 44,
        position: 'absolute'
    },
    line: {
        height: 30,
        width: Constant.window.onePR,
        backgroundColor: '#ccc'
    },
    container:{  
        flex:1,  
        backgroundColor: 'rgba(0, 0, 0, 0.25)',  
        position: 'absolute',  
        top: 0,  
        bottom: 0,  
        left: 0,  
        right: 0,  
        justifyContent:'center',  
        alignItems:'center'  
    }, 
    modal: {
        marginTop: 300,
        width: global.gScreen.width,
        position: 'absolute',
        bottom: 0,
        height: 180, 
        borderTopWidth: 0,
         paddingHorizontal: 8, 
         backgroundColor: 'transparent'
    },
    modalItem: {
        height: 56,
        justifyContent: 'center',
        marginHorizontal: 22
    },
    modalText: {
        fontSize: 16,
        color: 'black',
    },
})
