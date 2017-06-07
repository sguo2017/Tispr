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
    ScrollView
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
        })
    }

    render() {
        return (
            <View style={styles.listView}>
                <Header
                    title='需求'
                    leftIcon={require('../resource/w-back.png')}
                    leftIconAction={() => this.props.navigator.pop()}
                    rightIcon={require('../resource/w-more.png')}
                    style={{height: 50}}
                />
                <ScrollView>
                    <View style={{paddingHorizontal: 16, justifyContent: 'space-between', backgroundColor: 'white'}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, height: 48, }}>
                            <View style={{justifyContent: 'space-around', flexDirection: 'row',}}>
                                <Image style={{width: 32, height: 32, borderRadius: 16}} source={require('../resource/user_default_image.png')}></Image>
                                <View style={{marginLeft: 8, marginTop: -5}}>
                                    <Text style={{fontSize: 14, lineHeight: 20}}>李小娜</Text>
                                    <Text style={{color: '#999999', fontSize: 12}}>视频</Text>
                                </View>
                            </View>
                            <View>
                                <Text style={{color: '#999999', fontSize: 12}}>2017/2/21</Text>
                            </View> 
                        </View>
                        <Text style={{color: '#424242', fontSize: 16, lineHeight: 24}}>三月，醉一场青春的流年。慢步在三月的春光里，走走停停，看花开嫣然，看春雨绵绵，感受春风拂面，春天，就是青春的流年。青春，是人生中最美的风景，是一场花开的遇见；青春，是一场痛并快乐着的旅行；青春，是一场轰轰烈烈的比赛；青春，是一场鲜衣奴马的争荣岁月；青春，是一场风花雪月的光阴。</Text>
                        <Text style={{fontSize: 14, color: '#999999', marginTop: 26, marginBottom: 10}}>远程或附近</Text>
                        <Image source={require('../resource/img_default_home_cover.png')} style={{height: 128, width: 328}}></Image>
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
            </View>
        )
    }
}



const styles = StyleSheet.create({
    listView: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
})
