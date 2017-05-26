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
            <View style={{width:global.gScreen.width,height:global.gScreen.height,backgroundColor:'#fff',
            justifyContent:'center',alignItems:'center'}}>
                    <Image style={{width:160,height:160,margin:20}} source={require('../../resource/pupop_times25.png')}/>
                    <Text style={{color:'black',fontSize:20,margin:20}}>今天您还可以联系25位奇客</Text>
                    <View style={{flexDirection:'row', justifyContent:'space-between',marginTop:20}}>
                        <TouchableOpacity 
                        style={{borderRadius:5,width:100,height:40,justifyContent:'center',alignItems:'center',backgroundColor:'#f0f0f0',marginRight:40}}
                        onPress={() => this.props.navigator.pop()}
                        >
                            <Text style={{color:'black'}}>再看看</Text>
                            </TouchableOpacity> 
                        <TouchableOpacity 
                        style={{borderRadius:5,width:100,height:40,justifyContent:'center',alignItems:'center',backgroundColor:global.gColors.buttonColor}}
                        onPress={() => this.props.navigator.pop()}
                        >
                            <Text style={{color:'white'}}>立即沟通</Text>
                        </TouchableOpacity>
                    </View>
            </View>
        )
    }
}