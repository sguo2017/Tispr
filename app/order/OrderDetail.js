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

const screenW = Dimensions.get('window').width;

export default class OrderDetail extends Component {
    render(){
        return (
            <View>
                <Header
                        leftIconAction={() => this.props.navigator.pop()}
                        title={'Current Proposal'}
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
                        <View style={{flexDirection:'row', justifyContent:'flex-start', alignItems:'center',padding:10, width: screenW}}>
                            <Image style={{width: 50, height: 50, borderRadius:25}} source={require('../resource/user_default_image.jpg')}/>
                            <View style={{paddingLeft: 10}}>
                                <Text style={{fontSize:20, color:'black'}}>username</Text>
                                <Text style={{fontSize: 16}}>Pending Confirmation</Text>
                            </View>
                            
                        </View>
                        <View style={{flexDirection:'row', justifyContent:'flex-start', alignItems:'center',padding:10, width: screenW,backgroundColor:'white'}}>
                            <Image style={{width: 50, height: 50, borderRadius:25}} source={require('../resource/user_default_image.jpg')}/>
                            <View style={{paddingLeft: 10}}>
                                <Text style={{fontSize:20, color:'black'}}>wendi liu</Text>
                                <Text style={{fontSize: 16}}>Pending Confirmation</Text>
                            </View>
                            <View style={{flexDirection:'row',width:screenW*0.35, justifyContent:'flex-end'}}>
                                <Image style={{width:30, height: 30}} source={require('../resource/icon_check_img.png')}/>
                            </View>
                        </View>
                        <View style={{flexDirection:'row',paddingTop: 30, paddingLeft: 10,}}>
                            <Text style={{fontSize: 16, color:'black', }}>
                                你的服务很好，我愿意支付你100元，培训2小时
                            </Text>
                        </View>
                    </ScrollView>
                    <View>
                         <TouchableOpacity
                            activeOpacity={0.75}
                            style={{flexDirection: 'row',alignItems: 'center',
        justifyContent: 'center',
        borderTopColor: '#ccc',
        position: 'absolute',
        bottom: 5,
        backgroundColor: '#665dc6',width: screenW*0.5,height:44}}
                        >
                            <Text style={{ fontSize: 22, color: '#FFF' }}>
                                New Proposal
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.75}
                            style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'center',borderTopColor: '#ccc',position: 'absolute',
                            bottom: 5,left: screenW*0.5,backgroundColor: '#81d49c',width: screenW*0.5,height:44}}
                            onPress={() => alert('confirm deal')}
                        >
                            <Text style={{ fontSize: 22, color: '#FFF' }}>
                                Confirm deal
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    
    cardImageContent: {
        height: Common.window.height - (Platform.OS === 'ios' ? 64 : 50) - 18,
        width: Common.window.width,
        backgroundColor: '#f5f5f5',
        top: Platform.OS === 'ios' ? 64 : 50,
        position: 'absolute'
    }
})