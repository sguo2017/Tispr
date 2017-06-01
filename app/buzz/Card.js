/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import PropTypes from 'prop-types';
import { View, Image, Text, StyleSheet,TouchableHighlight,Alert, PanResponder,
TouchableWithoutFeedback } from 'react-native';
/* eslint-enable import/no-extraneous-dependencies */
import ConnectPage from './HeadCard/ConnectPage';
import DiscardPage from './HeadCard/DiscardPage';

export default function Card({ content, navigator, width, height }) {

  if(content.user_name===undefined){
    return(
      <View style={[styles.wrapper, { width, height }]}>
        <Image source={require('../resource/card_l_guide_1.png')}/>
      </View>
    )
  }else {
    return (
      <View style={[styles.wrapper, { width, height }]}>
        <View style={{height :60, flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start'}}>
          <View style={{height :60, flexDirection:'row',justifyContent:'flex-start',padding:10,alignItems:'center'}}>
            <Image style={{borderRadius:20, width:40, height:40}} source={require('../resource/user_default_image.png')}/>     
            <View>
              <Text style={{color:'black',fontSize:20}}>{content.user_name}</Text>
              <Text style={{color:'grey',fontSize:16}}>常用.其它创意艺术</Text>
            </View>
          </View>
          <View style={{flexDirection:'row'}}>
            <View style={{width:0,height:0,borderWidth:10,
                borderRightColor:global.gColors.buttonColor,
                borderTopColor:global.gColors.buttonColor,borderBottomColor:'transparent',borderLeftColor:'transparent'}}></View>
            <View>
              <TouchableHighlight
              onPress={()=>{navigator.push({component:DiscardPage,name:'DiscardPage'})}}
              style={{ width: 20,height:20,backgroundColor:global.gColors.buttonColor,justifyContent:'center'}}>
                <Text style={[styles.buttonText]}>
                  &times;
                </Text>
              </TouchableHighlight>
              <View style={{width:0,height:0,borderWidth:10,
                  borderRightColor:global.gColors.buttonColor,
                  borderTopColor:global.gColors.buttonColor,borderBottomColor:'transparent',borderLeftColor:'transparent'}}></View>
            </View>
          </View>
        </View>
        <View style={{height :100,padding:10}}>
          <Text style={{color:global.gColors.themeColor,fontSize:16}}>{content.action_desc}</Text>
        </View>
        <TouchableHighlight onPress={()=>{navigator.push({component:ConnectPage,name:'ConnectPage',passProps:{content}})}}
          style={[styles.button, {backgroundColor:global.gColors.buttonColor,margin:10}]}
          >
          <Text style={styles.buttonText}>
            联系TA
          </Text>
        </TouchableHighlight>
      </View>
  );
  }
 
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 5,
    backgroundColor: '#fff',
    flex:0,
  },
  button: {
    height: 50,
    backgroundColor: global.gColors.themeColor,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
   buttonText: {
    fontSize: 22,
    color: '#FFF',
    alignSelf: 'center'
  },
  
});