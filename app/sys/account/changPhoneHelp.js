import React, { Component, PureComponent } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    StyleSheet,
    Navigator,
    TouchableHighlight
} from 'react-native'
import Header from '../../components/HomeNavigation';
import accountSetting from './accountSetting'
export default class changPhoneHelp extends Component{
    constructor(props) {
		super(props);
	}

    render(){
        return(
            <View style={{height:global.gScreen.height}}>
                <Header
					title='需要帮助？'
					leftIcon={require('../../resource/t_header_arrow_left.png')}
					leftIconAction={()=> this.props.navigator.pop()}
				/>
                <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',margin:10}}>
                    <Image style={{width: 40, height: 40}} source={require('../../resource/b_messge.png')}/>
                    <TextInput
                    style={{flexDirection:'row',width: global.gScreen.width*0.8}}
                    multiline={true}
                    numberOfLines={1}
                    placeholder='请尽可能详细地描述您遇到的问题，我们将在48小时内回复您。'
                    />
                </View>
                <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',margin:10}}>
                    <Image style={{width: 40, height: 40}} source={require('../../resource/b_mail.png')}/>
                    <TextInput
                    style={{flexDirection:'row',width: global.gScreen.width*0.8}}
                    multiline={true}
                    numberOfLines={1}
                    placeholder='mail@examlple.com'
                    />
                </View>
                
                <TouchableHighlight style={[styles.button, { backgroundColor: global.gColors.buttonColor, position: 'absolute', bottom:22, flexShrink: 0, width: global.gScreen.width }]}>
                    <Text style={styles.buttonText}>
                        确定
                    </Text>
                </TouchableHighlight>
            </View>
        )
    }
}
const styles = StyleSheet.create({
 button: {
    height: 50,
    backgroundColor: global.gColors.themeColor,
    alignSelf: 'stretch',
    marginTop: 10,
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 22,
    color: '#FFF',
    alignSelf: 'center'
  },

})