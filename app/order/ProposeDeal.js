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
    Alert
} from 'react-native';
import Header from '../components/HomeNavigation';
import Constant from '../common/constants';

const screenW = Dimensions.get('window').width;

export default class ProposeDeal extends Component{
    constructor(props) {
        super(props);
        this.state = {
            new_price: this.props.new_price,
        };
    }

    async askPrice(){
        try {
            let bidder_id = global.user.id;
            let signature_id;
            if(bidder_id ==this.props.feed.offer_user_id)
                signature_id =  this.props.feed.request_user_id;
            else
                signature_id =  this.props.feed.offer_user_id;              
            let t = global.user.authentication_token;
            let order_id = this.props.feed.id;
            let url ='http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_ORDER_UPDATE +'/' +order_id +'?token='+ t;            
            let response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    order: {
                        status: '00B',
                        lately_chat_content: this.state.new_price,
                        bidder: bidder_id,
                        signature :signature_id,
                    }
                })
            });
             let res = await response.text();
            if (response.status >= 200 && response.status < 300) {
                console.log("line:144///res"+res);
                Alert.alert(
                    '提示',
                    '已向对方询价，待对方确认',
                    [
                        { text: '确定' ,  onPress: () => console.log('确定')},
                    ]
                )
            } else {
                let error = res;
                throw error;
            }
        } catch (error) {
            this.setState({ error: error });
            console.log("158 error "+error);
        }
    }

    render(){
        return(
            <View>
                <Header
                        leftIconAction={() => this.props.navigator.pop()}
                        title={'Propose a new deal'}
                        leftIcon={require('../resource/ic_back_dark.png')}
                        rightIcon={require('../resource/user_default_image.jpg')}
                        rightIconSize={26}
                    />
                <View style={{justifyContent:'center',alignItems:'center', paddingTop:60}}>
                    <Image source={require('../resource/t_text.png')}/>
                    <Text style={{fontSize:18,color:'#808080', width:screenW}}>Make a proposal, and if it's accepted the deal at this price and time.</Text>
                    <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center', width:screenW}}>
                        <Image style={{width:40, height:40}} source={require('../resource/ic_photo_comment.png')}/>
                        <TextInput
                        style={{width:screenW,borderBottomWidth:1}}
                         multiline={true}
                        numberOfLines={1}
                        value={this.state.new_price}
                        onChangeText={(val) => {this.setState({ new_price: val})}}
                        placeholder='I propose the following deal at this price and time'
                        />
                    </View>
                    <TouchableOpacity
                    activeOpacity={0.75}
                                style={{flexDirection: 'row',alignItems: 'center',
                                    justifyContent: 'center',
                                    borderTopColor: '#ccc',
                                    marginTop:5,
                                    backgroundColor: global.gColors.buttonColor,width: screenW,height:44}}
                    onPress={this.askPrice.bind(this)}
                    >
                        <Text style={{fontSize: 20, color: 'white'}}>Propose a deal</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}