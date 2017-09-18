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
import signup from '../../pages/signup'
import aboutqike from  '../help/aboutQike'
export default class wrongCode extends Component{
    render(){
        return(
            <View style={{width:global.gScreen.width,height:global.gScreen.height,backgroundColor:global.gColors.themeColor,
            justifyContent:'center',alignItems:'center'}}>
                <View style={{backgroundColor:'#fff',justifyContent:'center',width:300,height:215,alignItems:'center',borderRadius:8}}>
                    <View style={{justifyContent:'center', alignItems:'center'}}>
                        <Text style={{color:'black',fontSize:20, fontWeight:'bold'}}>十分抱歉，为邻是邀请制</Text>
                        <Text style={{color:'black', fontSize:14,margin:10}}>需要已注册的用户向你发出邀请</Text>
                        <View style={{flexDirection:'row', justifyContent:'space-between',marginTop:20}}>
                            <TouchableOpacity 
                            style={{borderRadius:5,width:100,height:40,justifyContent:'center',alignItems:'center',backgroundColor:'#f0f0f0',marginRight:40}}
                            onPress={() => this.props.navigator.resetTo({component: aboutqike})}
                            >
                                <Text style={{color:'black'}}>联系奇客</Text>
                                </TouchableOpacity> 
                            <TouchableOpacity 
                            style={{borderRadius:5,width:100,height:40,justifyContent:'center',alignItems:'center',backgroundColor:global.gColors.buttonColor}}
                            onPress={() => this.props.navigator.resetTo({component: signup})}
                            >
                                <Text style={{color:'white'}}>确定</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}