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
import signup from '../../pages/signup'
export default class offline extends Component{
    render(){
        return(
            <View style={{width:global.gScreen.width,height:global.gScreen.height,backgroundColor:'#fff',
            justifyContent:'center',alignItems:'center'}}>
                    <Image style={{width:280,height:280,margin:20}} source={require('../../resource/pupop_offline.png')}/>
                    <Text style={{color:'black',fontSize:20,margin:20}}>深海模式</Text>
                    <Text style={{color:'black',fontSize:14}}>您已离线，请重新登录</Text>
                    <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                       <TouchableOpacity
                            activeOpacity={0.75}
                            style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'center',borderTopColor: '#ccc',
                        marginTop: 20, backgroundColor: global.gColors.buttonColor,width: 260,height:44,borderRadius:6}}
                        onPress={() => this.props.navigator.resetTo({component: signup})}
                        >
                            <Text style={{ fontSize: 22, color: '#FFF' }}>
                                返回
                            </Text>
                        </TouchableOpacity>
                    </View>
            </View>
        )
    }
}