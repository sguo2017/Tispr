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

const screenW = Dimensions.get('window').width;
export default class ChatDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
           chatText : this.props.chatText, 
        }
    }

    render(){
        const {feed} = this.props;
        return (
                <FoodCardComponent
                    popAction={() => this.props.navigator.pop()}
                    collectAction={() => alert('collect')}
                    feed ={feed}
                />
        )
    }
}

const WebViewComponent = ({
    popAction}) => {
    return (
        <View style={{flex: 1, backgroundColor: 'white'}}>
            <Header
                leftIconAction={popAction}
                title='资讯详情'
                leftIcon={require('../resource/ic_back_dark.png')}
            />
            <WebView
                startInLoadingState={true}
                bounces={false}
                scalesPageToFit={true}
                style={styles.webView}
            />
        </View>
    )
};

const FoodCardComponent = ({
    popAction,
    collectAction,
    feed
}) => {

    let platformMargin = Platform.OS === 'ios' ? -40 : -30;

    return (
        <View style={{flex: 1, backgroundColor: 'white'}}>
            <Header
                leftIconAction={popAction}
                title={feed.serv_offer_user_name}
                leftIcon={require('../resource/ic_back_dark.png')}
                rightIcon={require('../resource/user_default_image.jpg')}
                rightIconSize={26}
            />
            <View style={[styles.cardImageContent]}>
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
    )
};

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
