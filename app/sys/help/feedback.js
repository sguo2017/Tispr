import React, { Component, PureComponent } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Image,
	ScrollView,
	TouchableOpacity,
	TouchableHighlight,
	TextInput,
	Alert
} from 'react-native'
import Header from '../../components/HomeNavigation';
import Setting from '../Setting';
import feedbackSuccess from './feedbackSuccess';
import Constant from '../../common/constants'
export default class feedback extends Component {

	constructor(props) {
		super(props);
		this.state =({
			suggestion: '',
		});

	}

	_onBack = () => {
		const { navigator } = this.props;
		navigator.pop()
	}
	async sendFeedback(){
		if(this.state.suggestion == ''){
			return;
		}
		try{
			let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_SUGGESTION + global.user.authentication_token;
			let response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    suggestion: {
                        user_id : global.user.id,
						content: this.state.suggestion,
                    }
                })
            });
			let res = await response.text();
            if (response.status >= 200 && response.status < 300) {
                this.props.navigator.push({
					name:'feedbackSuccess',
					component:feedbackSuccess
				});
            } else {
                let error = res;
                throw error;
            }
        } catch (error) {
            console.log("error " + error);
        }
	}

	render() {
		return (
			<View style={{height:global.gScreen.height}}>
				<Header
					title='意见反馈'
					leftIcon={require('../../resource/ic_back_white.png')}
					leftIconAction={this._onBack.bind(this)}
				/>
				<View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',margin:10}}>
                    <TextInput
                    style={{flexDirection:'row',width: global.gScreen.width*0.8}}
                    multiline={true}
                    numberOfLines={1}
					placeholder='输入您的意见和建议'
					val={this.state.suggestion}
					onChangeText={(val) => {
                      this.setState({ suggestion: val});
                    }}
                    />
                </View>
				<TouchableHighlight onPress={this.sendFeedback.bind(this)} style={[styles.button, { backgroundColor: global.gColors.buttonColor, position: 'absolute', bottom:22, flexShrink: 0, width: global.gScreen.width }]}>
                    <Text style={styles.buttonText}>
                        确定
                    </Text>
                </TouchableHighlight>
			</View>
		);
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
});