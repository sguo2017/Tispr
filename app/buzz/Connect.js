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
    AsyncStorage,
    Dimensions,
    PixelRatio,
    Alert
} from 'react-native'
import { observer } from 'mobx-react/native'
import { observable, computed, action, runInAction } from 'mobx';
import ImagePicker from 'react-native-image-picker';
import Header from '../components/HomeNavigation';
import UselessTextInput from '../components/UselessTextInput';
import UserDefaults from '../common/UserDefaults';
import Constant from '../common/constants';

const screenW = Dimensions.get('window').width;

@observer
export default class DealConnect extends Component {

    constructor(props) {
        super(props);
        this.state={
            lately_chat_content: '',
            send_default_chat_conteng:true,
        }
    }
    
    async _createDeal() {
        const { feed } = this.props;
        try {
            let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_ORDER_CREATE + global.user.authentication_token;
            let response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify({
                    order: {
                        serv_offer_title: feed.serv_title,
                        serv_offer_id: feed.id,
                        offer_user_id: feed.user_id,
                        lately_chat_content: this.state.lately_chat_content,
                    }
                })
            });

            let res = await response.text();
            console.log('dd');
            if (response.status >= 200 && response.status < 300) {
                //console.log("line:153");
                let resObject =JSON.parse(res);
                this._createChat(resObject.id);
                Alert.alert(
                    '提示',
                    '成功',
                    [
                        { text: '已通知到对方', onPress: () => this.props.navigator.pop() },
                    ]
                )
            } else {
                let error = res;
                throw error;
            }
        } catch (error) {
            this.setState({ error: error });
            console.log("error " + error);
            this.setState({ showProgress: false });

        }
    }

    async _createChat(_deal_id){
        let chat_content = this.state.lately_chat_content;
        try {
            let URL = `http://` + Constant.url.IMG_SERV_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_CHAT + `${global.user.authentication_token}`;
            let response = await fetch(URL, {
                method: 'POST',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                },

                body: JSON.stringify({
                chat: {
                    deal_id: _deal_id,
                    chat_content: chat_content,
                    user_id: global.user.id,
                    catalog: 2
                    }
                })
            });

            let res = await response.text();
            if (response.status >= 200 && response.status < 300) {
                console.log("line:99");
            } else {
                let error = res;
                throw error;
            }
        } catch (error) {
            console.log("error " + error);
        }
    }

    render() {
        const { feed } = this.props;

        return (
            <View style={{ flex: 1 }}>
                <Header
                    title='联系TA'
                    leftIcon={require('../resource/t_header_arrow_left.png')}
                    leftIconAction={() => this.props.navigator.pop()}
                />
                {
                    this.state.send_default_chat_conteng?
                    <View style={{paddingHorizontal: 20}}>
                        <Image defaultSource={require('../resource/user_default_image.png')} source={{uri: feed.user.avatar}} style={styles.avatar}></Image>        
                        <Text style={{fontSize: 14, color: '#1B2833'}}>{feed.user.name} 您好！{this.state.lately_chat_content}</Text>
                        <TouchableHighlight 
                            style={[styles.selectButton,{width:170, marginTop: 26}]} 
                            onPress={()=>this.setState({lately_chat_content:'你发布的专业服务很棒！'})}
                        >
                            <Text style={[styles.themeColorText]}>你发布的专业服务很棒！</Text>
                        </TouchableHighlight>
                        <TouchableHighlight 
                            style={[styles.selectButton,{width:156}]} 
                            onPress={()=>this.setState({lately_chat_content:'请问你是如何收费的？'})}
                        >
                            <Text style={[styles.themeColorText]}>请问你是如何收费的？</Text>
                        </TouchableHighlight>
                        <TouchableHighlight 
                            style={[styles.selectButton, {width: 184}]} 
                            onPress={()=>this.setState({lately_chat_content:'我想看一下你的更多作品。'})}
                        >
                            <Text style={[styles.themeColorText]}>我想看一下你的更多作品。</Text>
                        </TouchableHighlight>

                        <View style={{height: 1, backgroundColor: 'rgba(0,0,0,0.12)', marginVertical: 13.7}}></View>

                        <TouchableHighlight 
                            style={[styles.selectButton, {width: 86}]} 
                            onPress={()=>this.setState({send_default_chat_conteng:false})}
                        >
                            <Text style={[styles.themeColorText]}>自定义信息</Text>
                        </TouchableHighlight>
                        <View>
                            <Text style={{color: '#999999', marginVertical: 36}}>获得更多竞标</Text>
                        </View>
                        <View style={{flexDirection: 'row', marginTop: -10, marginBottom: 26}}>
                            <Text style={{fontSize: 16, color: 'black', marginRight: 162}}>为我找到更多人才</Text>
                            <Text style={{lineHeight: 20}}>是</Text>
                            <Image source={require('../resource/g_chevron right.png')} style={{justifyContent: 'flex-end'}}></Image>
                        </View> 
                    </View>:          
                    <View style={{paddingHorizontal: 20}}>
                        <Image defaultSource={require('../resource/user_default_image.png')} source={{uri: feed.user.avatar}} style={styles.avatar}></Image>                                
                        <Text style={{ marginTop:30, color: "#a8a6b9", fontSize: 16}}>联系{feed.user.name}询问服务细节</Text>
                        <TextInput
                            multiline={true}
                            numberOfLines={3}
                            value ={this.state.lately_chat_content}
                            placeholder='请输入聊天内容'
                            onChangeText={(val) => {
                                this.setState({ lately_chat_content: val })
                                }}
                        />
                        <TouchableHighlight 
                            onPress={()=>this.setState({send_default_chat_conteng:true})}
                        >
                            <Text style={[styles.themeColorText]}>发送默认消息</Text>
                        </TouchableHighlight>
                    </View>
                }
                
                <TouchableOpacity style={{height: 44, backgroundColor: '#FFC400'}}  onPress={this._createDeal.bind(this)}>
                    <Text style={{fontSize: 16, color: 'white', marginVertical: 10, marginHorizontal: 164}}>发送</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    webView: {
        width: Constant.window.width,
        height: Constant.window.height - Platform.OS === 'ios' ? 64 : 50,
    },
    bottomToolBar: {
        height: 44,
        width: Constant.window.width,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopColor: '#ccc',
        position: 'absolute',
        bottom: 5,
        backgroundColor: '#81d49c'
    },
    themeColorText:{
        color:global.gColors.themeColor,
        fontSize:14
    },
    selectButton: {
        borderWidth: 1,
        borderColor: global.gColors.themeColor,
        padding:5,
        height: 36,
        width:210,
        marginRight: 20,
        marginBottom: 8,
        borderRadius: 2
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
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginHorizontal: 130,
        marginVertical: 20
    }
})
