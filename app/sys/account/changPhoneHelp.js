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
import AutoTextInput from '../../components/AutoTextInput'
export default class changPhoneHelp extends Component{
    constructor(props) {
		super(props);
	}

    render(){
        return(
            <View style={{height:global.gScreen.height,backgroundColor: '#fff'}}>
                <Header
					title='需要帮助？'
					leftIcon={require('../../resource/ic_back_white.png')}
					leftIconAction={()=> this.props.navigator.pop()}
				/>
                <View style={{flexDirection:'row',alignItems:'center',marginHorizontal:18, marginTop: 34}}>
                    <Image source={require('../../resource/b_messge.png')}/>
                    <TextInput
                    multiline={true}
                    numberOfLines={2}
                    style={styles.textInput}
                    placeholderTextColor='#CCCCCC'
                    underlineColorAndroid="transparent"
                    placeholder='请尽可能详细地描述您遇到的问题，我们将在48小时内回复您。'
                    />
                </View>
                <View style={{flexDirection:'row',alignItems:'center',marginHorizontal:18, marginTop: 28}}>
                    <Image source={require('../../resource/b_mail.png')}/>
                    <TextInput
                    style={styles.textInput}
                    multiline={true}
                    numberOfLines={1}
                    placeholder='mail@examlple.com'
                    placeholderTextColor='#CCCCCC'
                    underlineColorAndroid="transparent"
                    />
                </View>
                
                <TouchableHighlight style={[styles.button, { backgroundColor: global.gColors.buttonColor, position: 'absolute', bottom:22, flexShrink: 0, width: global.gScreen.width }]}>
                    <Text style={styles.buttonText}>
                        发送
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
  textInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 0,
    backgroundColor: 'white',
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    marginLeft: 16,
  },

})