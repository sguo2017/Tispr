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
    Linking
} from 'react-native';
import TabBarView from '../containers/TabBarView'
export default class recommandSuccess extends Component{
    constructor(props) {
		super(props);
	}
    openSms(){
        let message = "我刚刚在【为邻】上推荐了你，你可以免费注册，并完善你的资料，这样我的朋友们可以通过为邻订购你的服务"
        Linking.canOpenURL(`sms:${user.num}`).then(supported => {
        if (!supported) {
            Alert.alert(
            '提示',
            '无法打开短信',
            [
                { text: '确定', onPress: null },
            ]
            )
        } else {
            Linking.openURL((`sms:${user.num}?body=${message}`) )
        }
        }).catch(err => {
            Alert.alert(
                null,
                '出错了',
                [
                { text: '确定', onPress: null },
                ]
            );
        });
    }
    render(){
        return(
            <View style={{width:global.gScreen.width,height:global.gScreen.height,backgroundColor:global.gColors.themeColor,
            justifyContent:'center',alignItems:'center'}}>
                <View style={{backgroundColor:'#fff',justifyContent:'center',width:300,height:215,alignItems:'center',borderRadius:8}}>
                    <View style={{justifyContent:'center', alignItems:'center'}}>
                        <Text style={{color:'black',fontSize:20, fontWeight:'bold'}}>推荐成功</Text>
                        <Text style={{color:'black', fontSize:14,margin:10}}>现在邀请他加入为邻，确认推荐并完善资料</Text>
                        <View style={{flexDirection:'row', justifyContent:'space-between',marginTop:20}}>
                            <TouchableOpacity 
                            style={{borderRadius:5,width:100,height:40,justifyContent:'center',alignItems:'center',backgroundColor:'#f0f0f0',marginRight:40}}
                            onPress={() => this.props.navigator.resetTo({component: TabBarView})}
                            >
                                <Text style={{color:'black'}}>残忍地拒绝</Text>
                                </TouchableOpacity> 
                            <TouchableOpacity 
                            style={{borderRadius:5,width:100,height:40,justifyContent:'center',alignItems:'center',backgroundColor:global.gColors.buttonColor}}
                            onPress={this.openSms.bind(this)}
                            >
                                <Text style={{color:'white'}}>邀请</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}