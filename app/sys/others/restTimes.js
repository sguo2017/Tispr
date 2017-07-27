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
export default class offline extends Component{
    render(){
        return(
            <View style={{width:global.gScreen.width,height:global.gScreen.height,backgroundColor:'#4A90E2',
            justifyContent:'center',alignItems:'center'}}>
                <View style={{width: 300, height: 392, backgroundColor: 'white', justifyContent:'center',alignItems:'center', borderRadius: 4}}>
                    <Image style={{width:160,height:160,margin:20}} source={require('../../resource/pupop_times25.png')}/>
                    <Text style={{color:'#1B2833 ',fontSize:16,margin:20}}>今天您还可以联系25位奇客</Text>
                    <View style={{flexDirection:'row', justifyContent:'space-between',marginTop:20}}>
                        <TouchableOpacity 
                        style={{borderRadius:5,width:100,height:44,justifyContent:'center',alignItems:'center',marginRight:40}}
                        onPress={() => this.props.navigator.pop()}
                        >
                            <Text style={{color:'#9E9E9E'}}>再看看</Text>
                            </TouchableOpacity> 
                        <TouchableOpacity 
                        style={{borderRadius:5,width:100,height:44,justifyContent:'center',alignItems:'center',backgroundColor:global.gColors.buttonColor}}
                        onPress={() => this.props.navigator.pop()}
                        >
                            <Text style={{color:'white'}}>立即沟通</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}