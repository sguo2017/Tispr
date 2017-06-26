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
            <View>
                <Header
					title='输入登录信息'
					leftIcon={require('../../resource/ic_back_white.png')}
					leftIconAction={()=> this.props.navigator.pop()}
				/>
                <TouchableOpacity style={styles.rectangle_view} onPress={()=> this.props.navigator.push({component:changePhone,name:'changePhone'})}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={styles.rectangle_text} >
								手机号码
			  				</Text>
						</View>
                        <Text>{global.user.name}</Text>
						<Image source={require('../../resource/g_chevron right.png')} style={{ alignSelf: 'center', width: 20, height: 20 }} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.rectangle_view} onPress={()=> this.props.navigator.push({component:changeMail,name:'changeMail'})}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={styles.rectangle_text} >
								E-mail
			  			    </Text>
						</View>
                        <Text>{global.user.email}</Text>
						<Image source={require('../../resource/g_chevron right.png')} style={{ alignSelf: 'center', width: 20, height: 20 }} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.rectangle_view} onPress={()=> this.props.navigator.push({component:changePassword,name:'changePassword'})}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={styles.rectangle_text} >
								密码
			  	            </Text>
						</View>
						<Image source={require('../../resource/g_chevron right.png')} style={{ alignSelf: 'center', width: 20, height: 20 }} />
					</TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    rectangle_view: {
		paddingTop: 8,
		paddingBottom: 8,
		paddingLeft: 15,
		paddingRight: 15,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: 'white',
		borderBottomColor: '#dedfe0',
		borderBottomWidth: 1,
        height:50
	},
	rectangle_text: {
		color: 'black',
		fontSize: 16,
		textAlign: 'center',
		paddingLeft: 8,
	},
})