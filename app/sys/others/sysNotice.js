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

export default class feedbackSuccess extends Component{
    render(){
        return(
            <View style={{width:global.gScreen.width,height:global.gScreen.height,backgroundColor:global.gColors.themeColor,
            justifyContent:'center',alignItems:'center'}}>
                <View style={{backgroundColor:'#fff',justifyContent:'center',width:300,height:215,alignItems:'center',borderRadius:8}}>
                    <View style={{justifyContent:'center', alignItems:'center'}}>
                        <Text style={{color:'black',fontSize:20, fontWeight:'bold'}}>不要错过最好的工作机会哦！</Text>
                        <Text style={{color:'black', fontSize:14,margin:10}}>允许推送附近发布的最新需求</Text>
                        <View style={{flexDirection:'row', justifyContent:'space-between',marginTop:20}}>
                            <TouchableOpacity 
                            style={{borderRadius:5,width:100,height:40,justifyContent:'center',alignItems:'center',backgroundColor:'#f0f0f0',marginRight:40}}
                            onPress={() => this.props.navigator.pop()}
                            >
                                <Text style={{color:'black'}}>残忍拒绝</Text>
                                </TouchableOpacity> 
                            <TouchableOpacity 
                            style={{borderRadius:5,width:100,height:40,justifyContent:'center',alignItems:'center',backgroundColor:global.gColors.buttonColor}}
                            onPress={() => this.props.navigator.pop()}
                            >
                                <Text style={{color:'white'}}>允许</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}