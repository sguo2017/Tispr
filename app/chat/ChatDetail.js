import React, {Component} from 'react';
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
    TextInput
} from 'react-native';
import Header from '../components/HomeNavigation';
import Common from '../common/constants';
import ShareView from '../components/ShareView';
import OrderDetail from '../order/OrderDetail'

const screenW = Dimensions.get('window').width;
export default class ChatDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
           chatText : this.props.chatText, 
        }
    }
    clickJump(){
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({　　//navigator.push 传入name和你想要跳的组件页面
                name: "OrderDetail",
                component: OrderDetail,
            });
        }
    }
    render(){
        const {feed} = this.props;
        return (
                <View style={{flex: 1, backgroundColor: 'white'}}>
                    <Header
                        leftIconAction={() => this.props.navigator.pop()}
                        title={feed.serv_offer_user_name}
                        leftIcon={require('../resource/ic_back_dark.png')}
                        rightIcon={require('../resource/user_default_image.jpg')}
                        rightIconSize={26}
                    />
                
                    <View style={[styles.cardImageContent]}>
                        <TouchableOpacity onPress={this.clickJump.bind(this)} style={{flexDirection:'row', justifyContent: 'flex-start', alignItems: 'center',padding:10}}>
                            <Image source={require('../resource/icon_phone.png')}/>
                            <Text style={{fontSize: 16,color:'black'}}>No deals have been proposed yet</Text>
                        </TouchableOpacity>
                        <ScrollView
                            bounces={false}
                            showsVerticalScrollIndicator={false}
                            removeClippedSubviews={true}
                            contentContainerStyle={{backgroundColor: 'white'}}
                        >
                            <View style={{
                                flexDirection: 'row',
                                paddingVertical: 10,
                                paddingHorizontal: 15,
                                alignItems: 'center',
                                overflow: 'hidden',
                                justifyContent: 'flex-start'
                            }}>
                            <Image style={{width: 50, height: 50, marginRight: 5, borderRadius: 35}} source={require('../resource/user_default_image.jpg')}/>
                            <View style={{padding: 10, backgroundColor:'#f8f8f0',borderRadius: 10,}}>
                                    <Text style={{color: 'black',marginRight: 5, fontSize: 16}} >{feed.lately_chat_content}&nbsp;&nbsp;&nbsp;</Text>
                            </View>
                            <Text>15:00</Text>
                            </View>

                            <View style={{
                                flexDirection: 'row',
                                paddingVertical: 10,
                                paddingHorizontal: 15,
                                alignItems: 'center',
                                overflow: 'hidden',
                                justifyContent: 'flex-end'
                            }}>
                            <Text>15:10</Text>
                            <View style={{padding: 10, backgroundColor:'lightblue',borderRadius: 10,}}>
                                    <Text style={{color: 'black',marginRight: 5, fontSize: 16}} >{feed.lately_chat_content}&nbsp;&nbsp;&nbsp;</Text>
                            </View>
                            </View>
                        </ScrollView>
                        <TextInput
                                style={{height: 40,borderWidth:2}}
                                placeholder="Type here to translate!"
                                onChangeText={(chatText) => this.setState({chatText})}
                        />
                    </View>
                </View>
        );
    }
}

const styles = StyleSheet.create({
    webView: {
        width: Common.window.width,
        height: Common.window.height - Platform.OS === 'ios' ? 64 : 50,
    },
    cardImageContent: {
        height: Common.window.height - (Platform.OS === 'ios' ? 64 : 50) - 44,
        width: Common.window.width,
        backgroundColor: '#f5f5f5',
        top: Platform.OS === 'ios' ? 64 : 50,
        bottom: 44,
        position: 'absolute'
    },
    line: {
        height: 30,
        width: Common.window.onePR,
        backgroundColor: '#ccc'
    }
})
