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
import ChatDetail from '../chat/ChatDetail'
export default class offline extends Component{
    render(){
        return(
            <View style={{width:global.gScreen.width,height:global.gScreen.height,backgroundColor:'#fff',
            justifyContent:'center',alignItems:'center'}}>
                    <Image style={{width:160,height:160,margin:20}} source={require('../resource/pupop-times5.png')}/>
                    <Text style={{color:'black',fontSize:20,margin:20}}>联系成功！</Text>
                    {
                        this.props.type == "offer"?
                        <Text style={{color:'#1B2833',fontSize:16,margin:20}}>今天您还可以联系{this.props.avaliableTimes}位奇客</Text>
                        :<Text style={{color:'#1B2833',fontSize:16,margin:20}}>今天您还可以联系{this.props.avaliableTimes}个需求</Text>
                    }
                    <View style={{flexDirection:'row', justifyContent:'space-between',marginTop:20}}>
                        <TouchableOpacity 
                        style={{borderRadius:5,width:100,height:44,justifyContent:'center',alignItems:'center',backgroundColor:'#f0f0f0',marginRight:40}}
                        onPress={() => this.props.navigator.popN(2)}
                        >
                            <Text style={{color:'#9E9E9E'}}>再看看</Text>
                            </TouchableOpacity> 
                        <TouchableOpacity 
                        style={{borderRadius:5,width:100,height:44,justifyContent:'center',alignItems:'center',backgroundColor:global.gColors.buttonColor}}
                        onPress={() => this.props.navigator.resetTo({component:ChatDetail, passProps: {feed:this.props.feed, newChat: true}})}
                        >
                            <Text style={{color:'white'}}>立即沟通</Text>
                        </TouchableOpacity>
                    </View>
            </View>
        )
    }
}