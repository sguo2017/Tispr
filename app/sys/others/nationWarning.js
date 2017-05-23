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
                        <Text style={{color:'black',fontSize:14}}>奇客目前只开通中国地区注册，将</Text>
                        <Text style={{color:'black', fontSize:14,margin:10}}>很快开通其它国家注册服务</Text>
                        <TouchableOpacity
                            activeOpacity={0.75}
                            style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'center',borderTopColor: '#ccc',
                        marginTop: 20, backgroundColor: global.gColors.buttonColor,width: 260,height:44,borderRadius:6}}
                        onPress={() => this.props.navigator.pop()}
                        >
                            <Text style={{ fontSize: 22, color: '#FFF' }}>
                                知道了
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}