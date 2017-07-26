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

export default class uploadImage extends Component{
    render(){
        return(
            <View style={{width:global.gScreen.width,height:global.gScreen.height,backgroundColor:global.gColors.themeColor,
             justifyContent:'center',alignItems:'center'}}>
                <View style={{backgroundColor:'#fff',justifyContent:'center',width:300,height:380,alignItems:'center', borderRadius: 4}}>
                    <Image source={require('../../resource/pupop-uploadwork.png')} style={{height: 128, width: 128, borderRadius: 64}}/>
                    <View elevation={5} style={{justifyContent:'center', alignItems:'center'}}>
                        <Text style={{color:'black', fontWeight:'bold',fontSize:18, marginTop: 32, marginBottom: 16}}>请上传您的作品或相关图片！</Text>
                        <Text style={{color:'black', fontSize:14, }}>为您的服务添加精美高清图片，获</Text>
                        <Text style={{color:'black', fontSize:14,}}>得客户的机会将增大5倍！</Text>
                        <TouchableOpacity
                            activeOpacity={0.75}
                            style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'center',borderTopColor: '#ccc', marginTop: 40,
                                     backgroundColor: global.gColors.buttonColor,width: 260,height:44,borderRadius:6}}
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