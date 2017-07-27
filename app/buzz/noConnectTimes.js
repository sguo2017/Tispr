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
                    <Image style={{width:160,height:160,margin:20}} source={require('../resource/pupop-times0.png')}/>
                    <Text style={{color:'#1B2833',fontSize:16,margin:20}}>抱歉，今天的沟通机会已用完</Text>
                    
                    <View style={{flexDirection:'row', justifyContent:'center',marginTop:20}}>
                        <TouchableOpacity 
                        style={{borderRadius:5,width:200,height:40,justifyContent:'center',alignItems:'center',backgroundColor:global.gColors.buttonColor}}
                        onPress={() => this.props.navigator.popN(2)}
                        >
                            <Text style={{color:'white'}}>知道了</Text>
                        </TouchableOpacity>
                    </View>
            </View>
        )
    }
}