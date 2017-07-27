import React, { Component, PureComponent } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Image,
	ScrollView,
	TouchableOpacity,
	TouchableHighlight
} from 'react-native'
export default class breakdown extends Component{
    render(){
        return(
            <View style={{width:global.gScreen.width,height:global.gScreen.height,backgroundColor:'#fff',
            justifyContent:'center',alignItems:'center'}}>
                    <Image style={{width:280,height:280,margin:20}} source={require('../../resource/pupop_error.png')}/>
                    <Text style={{color:'black',fontSize:20,margin:20}}>奇客爱你</Text>
                    <Text style={{color:'black',fontSize:16}}>我们正在全力修复此故障</Text>
                    <Text style={{color:'black',fontSize:16}}>感谢您的理解</Text>
                    {/* <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                       <TouchableOpacity
                            activeOpacity={0.75}
                            style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'center',borderTopColor: '#ccc',
                        marginTop: 20, backgroundColor: global.gColors.buttonColor,width: 260,height:44,borderRadius:6}}
                        onPress={() => this.props.navigator.pop()}
                        >
                            <Text style={{ fontSize: 22, color: '#FFF' }}>
                                返回
                            </Text>
                        </TouchableOpacity>
                    </View> */}
            </View>
        )
    }
}