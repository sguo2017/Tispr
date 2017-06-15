import React, {PureComponent} from 'react'
import {
    StyleSheet,
    View,
    Text,
    Image,
    ListView,
    TouchableOpacity,
    RefreshControl,
    Dimensions,
    ScrollView,
    Modal
} from 'react-native'
import {observer} from 'mobx-react/native'
import {reaction} from 'mobx'
import {connect} from 'react-redux';
import Loading from '../components/Loading'
import LoadMoreFooter from '../components/LoadMoreFooter'
import Toast from 'react-native-easy-toast'
import Header from '../components/HomeNavigation';
const screenW = Dimensions.get('window').width;


@observer
export default class ServOfferDetail extends PureComponent {
    
    state = {
        dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        }),
        show: false
    }

    render() {
        const { feed } = this.props;
        let img = feed.serv_images.split(',');

        return (
            <View style={styles.listView}>
                <Header
                    title='需求'
                    leftIcon={require('../resource/w-back.png')}
                    leftIconAction={() => this.props.navigator.pop()}
                    rightIcon={require('../resource/w-more.png')}
                    rightIconAction={() => this.setState({show: true})}
                    style={{height: 50}}
                />
                <ScrollView>
                    <View style={{paddingHorizontal: 16, justifyContent: 'space-between', backgroundColor: 'white'}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, height: 48, }}>
                            <View style={{justifyContent: 'space-around', flexDirection: 'row',}}>
                                <Image style={{width: 32, height: 32, borderRadius: 16}} source={{uri: feed.user.avatar}} defaultsource={require('../resource/user_default_image.png')}></Image>
                                <View style={{marginLeft: 8, marginTop: -5}}>
                                    <Text style={{fontSize: 14, lineHeight: 20}}>{feed.user.name}</Text>
                                    {
                                        feed.catalog?
                                        <Text style={{color: '#999999', fontSize: 12}}>{feed.catalog}</Text>
                                        :<Text style={{color: '#999999', fontSize: 12}}>视频</Text>
                                    }
                        
                                </View>
                            </View>
                            <View>
                                <Text style={{color: '#999999', fontSize: 12}}>{feed.created_at.substring(0,10)}</Text>
                            </View> 
                        </View>
                        <Text style={{color: '#424242', fontSize: 16, lineHeight: 24}}>{feed.serv_detail}</Text>
                        
                        <ListView
                            dataSource={this.state.dataSource.cloneWithRows(img)}
                            renderRow={(rowData) =>
                                <Image defaultSource={require('../resource/img_default_home_cover.png')} source={{uri:rowData}} style={{height: 300, width: 328, marginBottom: 10}}></Image>
                            }   
                           
                        />
                                                                       
                        
                        <Text style={{fontSize: 14, color: '#999999', marginTop: 26, marginBottom: 10}}>远程或附近</Text>
                        <Image defaultSource={require('../resource/img_default_home_cover.png')} source={{uri:img[0]}} style={{height: 128, width: 328}}></Image>
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
                                <Image source={require('../resource/user_default_image.png')} style={{borderRadius: 20, width: 40, height: 40}}></Image>
                                <Text style={{color: '#1B2833', fontSize: 16, flexShrink: 0, marginLeft: 12}}>Frank Gardner</Text>
                                <Image source={require('../resource/g_chevron right.png')} style={{position: 'absolute', right: 16}}></Image>
                            </View>
                        }
                    />                 
                    <View style={{backgroundColor: 'white', paddingTop: 23, paddingBottom: 10}}>
                        <TouchableOpacity style={{backgroundColor: '#FFC400', borderRadius: 4, height: 44, marginHorizontal: 16, paddingHorizontal: 138, paddingVertical: 10}}>
                            <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>联系TA</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{justifyContent: 'space-around', alignItems: 'center', marginTop: 12}}>
                        <Text style={{color: '#9E9E9E', fontSize: 14}}>相关服务</Text>
                    </View>
                </ScrollView>
                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={this.state.show}
                    onShow={() => { }}
                    onRequestClose={() => { }}>
                    <View style={styles.modal}>
                        <View style={styles.share}>
                            <TouchableOpacity style={styles.item}>
                                <Image source={require('../resource/ico-wechat.png')} style={styles.img}></Image>
                                <Text style={styles.text}>微信</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.item}>
                                <Image source={require('../resource/ico-friend.png')} style={styles.img}></Image>
                                <Text style={styles.text}>朋友圈</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.item}>
                                <Image source={require('../resource/ico-qq.png')} style={styles.img}></Image>
                                <Text style={styles.text}>QQ</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Image source={require('../resource/ico-weibo.png')} style={styles.img}></Image>
                                <Text style={styles.text}>新浪微博</Text>
                            </TouchableOpacity>       
                        </View>
                        <TouchableOpacity onPress={() => this.setState({show: false})} style={{height: 57, width: 300, marginTop: 30}}>
                            <Text style={styles.cancel}>取消</Text> 
                        </TouchableOpacity>                    
                    </View>

                </Modal>
            </View>
        )
    }
}



const styles = StyleSheet.create({
    listView: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    modal: {
        marginTop: 350,
        height: 250,
        backgroundColor: 'white',
        padding: 30,
    },
    share: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20
    },
    item: {
        marginRight: 40,
        flexDirection: 'column',
        alignItems: 'center'
    },
    img: {
        height: 48,
        width: 48,
    },
    text: {
        fontSize: 12,
        color: '#1B2833',
    },
    cancel: {
        color: '#1B2833',
        fontSize: 16,
        marginTop: 30,
        marginHorizontal: 132
    }
})
