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
    Dimensions
} from 'react-native';
import Header from '../components/HomeNavigation';
import Constant from '../common/constants';
import ProposeDeal from './ProposeDeal';

const screenW = Dimensions.get('window').width;

export default class BeforePropose extends Component{
    clickJump() {
        const { navigator } = this.props;
        const { feed } = this.props;
        if (navigator) {
          navigator.push({　　//navigator.push 传入name和你想要跳的组件页面
            name: "ProposeDeal",
            component: ProposeDeal,
            passProps: {feed}
           });
        }
     }

    render(){
        return(
            <View>
                <Header
                        leftIconAction={() => this.props.navigator.pop()}
                        title={'当前交易'}
                        leftIcon={require('../resource/ic_back_dark.png')}
                        rightIcon={require('../resource/user_default_image.png')}
                        rightIconSize={26}
                    />
                <ScrollView style={{ height: Constant.window.height - (Platform.OS === 'ios' ? 64 : 50) - 18,}}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10 }}>
                        <Image source={require('../resource/icon_phone.png')} />
                        <Text style={{ fontSize: 16, color: 'black' }}>还没有提出交易</Text>
                    </View>
                    <View style={{justifyContent:'center', alignItems:'center',marginTop:200}}>
                        <Image style={{width:200,height:200}} source={require('../resource/ic_arrow_down_default.png')} />
                    </View>
                </ScrollView>
                <TouchableOpacity
                activeOpacity={0.75}
                            style={{flexDirection: 'row',alignItems: 'center',
                                justifyContent: 'center',
                                borderTopColor: '#ccc',
                                position: 'absolute',
                                bottom: 0,
                                backgroundColor: global.gColors.buttonColor,width: screenW,height:44}}
                onPress={this.clickJump.bind(this)}
                >
                    <Text style={{fontSize: 20, color: 'white'}}>提出交易</Text>
                </TouchableOpacity>
            </View>
            
        )
    }
}