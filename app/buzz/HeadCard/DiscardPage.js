import React, { Component } from 'react';
import { observer } from 'mobx-react/native'
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import Constant from '../../common/constants';

export default class DiscardPage extends Component{
    constructor(props) {
        super(props);
    }
    
    render(){
        const { feed } = this.props;
        return(
            <View style={{width:global.gScreen.width,height:global.gScreen.height,backgroundColor:global.gColors.themeColor,
            justifyContent:'center',alignItems:'center'}}>
                <View style={{backgroundColor:'#fff',justifyContent:'center',width:300,height:400,alignItems:'center'}}>
                    <Image style={{width:120,height:120,margin:20}} source={require('../../resource/pupop_notice.png')}/>
                    <Text style={{color:'black',fontSize:20,margin:30}}>忽略此需求卡？</Text>
                    <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                       <TouchableOpacity 
                       style={{borderRadius:5,width:100,height:40,justifyContent:'center',alignItems:'center',backgroundColor:'#f0f0f0',marginRight:40}}
                       onPress={() => this.props.navigator.pop()}
                       >
                           <Text style={{color:'grey'}}>取消</Text>
                        </TouchableOpacity> 
                       <TouchableOpacity 
                       style={{borderRadius:5,width:100,height:40,justifyContent:'center',alignItems:'center',backgroundColor:global.gColors.buttonColor}}
                       onPress={() =>{this.props.callback(this.props.discardIndex,Constant.sys_msgs_status.DISCARDED,this.props.feed.smt_id); this.props.navigator.pop()}}
                       >
                           <Text style={{color:'white'}}>确定</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}