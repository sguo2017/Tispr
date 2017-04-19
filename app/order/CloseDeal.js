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

export default class CloseDeal extends Component{
    render(){
        return(
            <View style={{justifyContent:'center', alignItems:'center'}}>
                <Image style={{marginTop:100, width: 300, height:300, borderRadius: 150}} source={require('../resource/img_buzz_detail_default.png')}/>
                <Text style={{color:'black', fontWeight:'bold',fontSize:20}}>You Closed the deal!</Text>
                <Text style={{color:'black', fontSize:20}}>What now? Meet for coffee, start the job, get Paid!</Text>
                <TouchableOpacity
                    activeOpacity={0.75}
                    style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'center',borderTopColor: '#ccc',
                   marginTop: 30, backgroundColor: '#81d49c',width: 300,height:44}}
                   onPress={() => this.props.navigator.pop()}
                >
                    <Text style={{ fontSize: 22, color: '#FFF' }}>
                        Got it
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

}