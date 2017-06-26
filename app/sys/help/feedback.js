import React, { Component, PureComponent } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Image,
	ScrollView,
	TouchableOpacity,
	TouchableHighlight,
	TextInput
} from 'react-native'
import { observer } from 'mobx-react/native';
import { observable, computed, action, runInAction } from 'mobx';
import Header from '../../components/HomeNavigation';
import Setting from '../Setting';
import feedbackSuccess from './feedbackSuccess';

export default class UseHelp extends Component {

	constructor(props) {
		super(props);

	}

	_onBack = () => {
		const { navigator } = this.props;
		navigator.pop()
	}
	sendFeedback(){
		this.props.navigator.push({
			name:'feedbackSuccess',
			component:feedbackSuccess
		});
	}

	render() {
		return (
			<View style={{height:global.gScreen.height}}>
				<Header
					title='意见反馈'
					leftIcon={require('../../resource/t_header_arrow_left.png')}
					leftIconAction={this._onBack.bind(this)}
				/>
				<View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',margin:10}}>
                    <TextInput
                    style={{flexDirection:'row',width: global.gScreen.width*0.8}}
                    multiline={true}
                    numberOfLines={1}
					placeholder='输入您的意见和建议'
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