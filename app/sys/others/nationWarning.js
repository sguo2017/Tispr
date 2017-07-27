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
            <View
              style={{
                flex: 1,
                backgroundColor:global.gColors.themeColor,
                justifyContent:'center',
                alignItems:'center',
              }}
            >
                <View style={{
                    width: global.gScreen.width - 52,
                    backgroundColor: '#fff',
                    borderRadius: 8,
                    alignItems:'center',
                }}>
                    <Text style={{color:'#1B2833', fontSize:16, marginTop: 32,fontWeight:'bold' }}>奇客目前只开通中国地区注册，将</Text>
                    <Text style={{color:'#1B2833', fontSize:16, margin: 10, fontWeight:'bold' }}>很快开通其它国家注册服务。</Text>
                    <TouchableOpacity
                      activeOpacity={0.75}
                      style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderTopColor: '#ccc',
                          marginTop: 44,
                          marginBottom: 12,
                          width: global.gScreen.width - 52 - 24,
                          backgroundColor: global.gColors.buttonColor,
                          height: 44,
                          borderRadius: 4,
                      }}
                      onPress={() => this.props.navigator.pop()}
                    >
                        <Text style={{ fontSize: 16, color: '#FFF' }}>
                            知道了
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}