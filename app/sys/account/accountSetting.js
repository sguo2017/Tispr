import React, { Component, PureComponent } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    StyleSheet,
    Navigator,
    TouchableHighlight,
    TouchableOpacity
} from 'react-native'
import Header from '../../components/HomeNavigation';
import changePhone from './changePhone';
import changeMail from './changeMail';
import changePassword from './changePassword';

export default class accountSetting extends Component {
    render(){
        return(
            <View style={{backgroundColor: '#fff'}}>
                <Header
					title='输入登录信息'
					leftIcon={require('../../resource/ic_back_white.png')}
					leftIconAction={()=> this.props.navigator.pop()}
				/>
                <TouchableOpacity style={styles.rectangle_view} onPress={()=> this.props.navigator.push({component:changePhone,name:'changePhone'})}>
					<Text style={styles.rectangle_text} >手机号码</Text>
					<View style={{flexDirection: 'row'}}>
						<Text>{global.user.num}</Text>
						<Image source={require('../../resource/g_chevron right.png')}/>
					</View>
				</TouchableOpacity>
				<TouchableOpacity style={styles.rectangle_view} onPress={()=> this.props.navigator.push({component:changeMail,name:'changeMail'})}>
					<Text style={styles.rectangle_text} >E-Mail</Text>
					<View style={{flexDirection: 'row'}}>
						<Text>{global.user.email}</Text>
						<Image source={require('../../resource/g_chevron right.png')}/>
					</View>
					
				</TouchableOpacity>
				<TouchableOpacity style={styles.rectangle_view} onPress={()=> this.props.navigator.push({component:changePassword,name:'changePassword'})}>
					<Text style={styles.rectangle_text} >密码</Text>
					<View style={{flexDirection: 'row'}}>
						<Image source={require('../../resource/g_chevron right.png')}/>
					</View>
				</TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    rectangle_view: {
		paddingLeft: 15,
		paddingRight: 15,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: 'white',
		borderBottomColor: '#dedfe0',
		borderBottomWidth: 0.5,
        height:56
	},
	rectangle_text: {
		color: 'black',
		fontSize: 16,
		textAlign: 'center',
		paddingLeft: 8,
	},
})