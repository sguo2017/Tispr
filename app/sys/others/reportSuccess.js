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

export default class reportSuccess extends Component{
    render(){
        return(
            <View style={{width:global.gScreen.width,height:global.gScreen.height,backgroundColor:global.gColors.themeColor,
             justifyContent:'center',alignItems:'center'}}>
                <View style={{backgroundColor:'#fff',justifyContent:'center',width:300,height:200,alignItems:'center', borderRadius: 4}}>
                    <View style={{justifyContent:'center', alignItems:'center'}}>
                        <Text style={{color:'#1B2833', fontWeight:'bold',fontSize:18}}>提交成功</Text>
                        <Text style={{color:'#1B2833', fontSize:14,marginTop:16, marginBottom: 35}}>我们将认真审核举报内容</Text>
                        <TouchableOpacity
                            activeOpacity={0.75}
                            style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'center',borderTopColor: '#ccc',
                        marginTop: 20, backgroundColor: global.gColors.buttonColor,width: 260,height:44,borderRadius:4}}
                        onPress={() => this.props.navigator.popN(2)}
                        >
                            <Text style={{ fontSize: 16, color: '#FFF' }}>
                                知道了
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}