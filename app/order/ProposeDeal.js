import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    WebView,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableHighlight,
    ScrollView,
    Platform,
    Dimensions,
    Alert,
    KeyboardAvoidingView,
} from 'react-native';
import Header from '../components/HomeNavigation';
import Constant from '../common/constants';
import AutoTextInput from '../components/AutoTextInput';
import Util from '../common/utils'
import fetchers from '../common/netRequest'
const screenW = Dimensions.get('window').width;

export default class ProposeDeal extends Component{
    constructor(props) {
        super(props);
        this.state = {
            new_price: ''
        };
    }

    async askPrice(){
        let bidder_id = global.user.id;
        let signature_id;
        if(bidder_id ==this.props.feed.offer_user_id)
            signature_id =  this.props.feed.request_user_id;
        else
            signature_id =  this.props.feed.offer_user_id;              
        let t = global.user.authentication_token;
        let order_id = this.props.feed.id;
        let url ='http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_ORDER_UPDATE +'/' +order_id +'?token='+ t;            
        let data = {
            order: {
                status: Constant.orderStatus.OFFERED,
                lately_chat_content: this.state.new_price,
                bidder: bidder_id,
                signature :signature_id,
            }
        };
        Util.patch(url,data,
            (response)=>{
             this._createChat(this.props.chatRoomId, this.state.new_price);
                Alert.alert(
                    '提示',
                    '已向对方询价，待对方确认',
                    [
                        { text: '确定' ,  onPress: () => this.props.navigator.popN(2)}
                    ]
                )
            },
            this.props.navigator
        )
    }

    async _createChat(room_id,chat_content){
        let URL = 'http:\/\/' + Constant.url.IMG_SERV_ADDR + ':' + Constant.url.SERV_API_PORT + '/api/chats/chat_rooms/' +room_id +'/chat_messages?token='+global.user.authentication_token
        let data = {
            chat_message: {
                message: chat_content,
                user_id: global.user.id,
            }
        }
        fetchers.post(URL, data, (response)=>{
                console.log("成功创建会话")
            }
        )
    }

    render(){
        return(
            <View style={{flex: 1, backgroundColor: 'white'}}>
                <Header
                        leftIconAction={() => this.props.navigator.pop()}
                        title={'提出交易条件'}
                        leftIcon={require('../resource/w-back.png')}
                    />
                <View style={{alignItems:'center', padding:16,flex: 1,}}>
                    <Image source={require('../resource/b-xuqiu-xl.png')}/>
                    <Text style={{fontSize:16,color:'black', marginTop: 12, marginBottom: 36}}>提出交易条件，如果对方接受，交易达成!</Text>
                    <Text style={{color: '#9E9E9E', fontSize: 14}} onPress={() => { this.refs.textInput.focus() }}>我提议本次交易按以下价格及方式进行</Text>
                    <AutoTextInput
                        ref="textInput"
                        onChangeText={(val) => this.setState({new_price:val})}
                        placeholderTextColor="black"
                        underlineColorAndroid="transparent"
                        style={styles.input}
                    />
                </View>
                <View style={{ flex: 1 }} /> 
                <KeyboardAvoidingView behavior="position" contentContainerStyle={styles.button}>
                    <TouchableOpacity
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                        onPress={this.state.new_price?this.askPrice.bind(this):console.log('dd')}
                    >
                        <Text style={{fontSize: 16, color: 'white'}}>发送</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </View>
        )
    }
}

styles = StyleSheet.create({
    input: {
        height: 50,
        margin: 10,
        padding: 4,
        fontSize: 18,
        width: screenW - 40,
        // borderWidth: 1,
        borderColor: '#48bbec',
        borderBottomWidth: 1,
        borderBottomColor: '#eeeeee',
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: global.gColors.buttonColor,
        height: 44,
        width: global.gScreen.width,
    },
})