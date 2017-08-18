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
} from 'react-native';
import TabBarView from'../containers/TabBarView';
export default class CloseDeal extends Component{
    render(){
        return(
            <View style={{justifyContent:'center', alignItems:'center', backgroundColor: 'white'}}>
                <Image style={{marginTop:100, width: 300, height:300, borderRadius: 150}} source={require('../resource/img_buzz_detail_default.png')}/>
                <Text style={{color:'black', fontWeight:'bold',fontSize:20}}>你完成了本次交易!</Text>
                <Text style={{color:'black', fontSize:20}}>下一步做什么？见面聊一聊，提供您的服务并获得报酬！</Text>
                <TouchableOpacity
                    activeOpacity={0.75}
                    style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'center',borderTopColor: '#ccc',
                   marginTop: 30, backgroundColor: '#81d49c',width: 300,height:44}}
                   onPress={() => this.props.navigator.resetTo({component:TabBarView, passProps:{initialPage: 3}})}
                >
                    <Text style={{ fontSize: 22, color: '#FFF' }}>
                       知道了
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

}