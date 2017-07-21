import React, { Component, PureComponent } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Image,
    Switch,
    Platform,
    TimePickerAndroid,
    TouchableHighlight,
    ToastAndroid,
} from 'react-native'

import Header from '../../components/HomeNavigation';
import Constant from '../../common/constants';
import Util from '../../common/utils'
class CustomButton extends React.Component {
  render() {
    return (
      <TouchableHighlight
        style={styles.button}
        underlayColor="#a5a5a5"
        onPress={this.props.onPress}>
        <Text style={styles.buttonText}>{this.props.text}</Text>
      </TouchableHighlight>
    );
  }
}
export default class PhoneSetting extends Component {

	constructor(props) {
		super(props);
        this.state={
            allDaySwitch: false,
            startTime: global.user.call_from,
            endTime: global.user.call_to,
            startHour: 0,
            startMinute: 0,
            endHour: 0,
            endMinute: 0,
        }
	}

    componentWillMount(){
        this._getTime();
    }

    async showPicker(options,type) {
        try {
            const {action, minute, hour} = await TimePickerAndroid.open(options);
            if (action === TimePickerAndroid.timeSetAction) {
                let time = this._formatTime(hour,minute);
                ToastAndroid.show('选择的时间为'+time,ToastAndroid.SHORT);
                if(type =='start'){
                    this.setState({
                        startHour: hour,
                        startMinute: minute,
                        startTime: time
                    });
                }
                if(type =='end'){
                    this.setState({
                        endHour: hour,
                        endMinute: minute,
                        endTime: time,
                    });
                }
            } else if (action === TimePickerAndroid.dismissedAction) {
                ToastAndroid.show('选择器关闭取消',ToastAndroid.SHORT);
            }
        } catch ({code, message}) {
            ToastAndroid.show('错误信息:'+message,ToastAndroid.SHORT);
        }
    }
     _formatTime(hour, minute) {
        return hour + ':' + (minute < 10 ? '0' + minute : minute);
    }

    _getTime(){
        if(global.user.call_from){
            let time = global.user.call_from
            if(time.length == 4){
                this.state.startHour = parseInt(time.substr(0,1));
                this.state.startMinute = parseInt(time.substr(2,2));
            }else{
                this.state.startHour = parseInt(time.substr(0,2));
                this.state.startMinute = parseInt(time.substr(3,2));
            }
        }
        if(global.user.call_to){
            let time = global.user.call_to
            if(time.length == 4){
                this.state.endHour = parseInt(time.substr(0,1));
                this.state.endMinute = parseInt(time.substr(2,2));
            }else{
                this.state.endHour = parseInt(time.substr(0,2));
                this.state.endMinute = parseInt(time.substr(3,2));
            }
        }
        if(global.user.switch_to == true){
            this.state.startHour = 0
            this.state.startMinute = 0
            this.state.startTime = "0:00"
            this.state.endHour = 23
            this.state.endMinute = 59
            this.state.endTime = "23:59"
            this.state.allDaySwitch = true
        }
    }
    async saveSetting(){
        let url ='http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_PHONE_SETTING + global.user.id+'?token='+global.user.authentication_token;
        let data = {
            user: {
                switch_to: this.state.allDaySwitch,
                call_from: this.state.startTime,
                call_to: this.state.endTime
            }
        }
        Util.patch(url, data,
            (response)=>{
                ToastAndroid.show('保存成功',ToastAndroid.LONG);
                global.user.call_from = this.state.startTime;
                global.user.call_to = this.state.endTime;
                global.user.switch_to = this.state.allDaySwitch;
            },
            this.props.navigator
        )
    }
	render() {
		return (
			<View style={{backgroundColor: '#fff'}}>
				<Header
					title='电话设置'
					leftIcon={require('../../resource/ic_back_white.png')}
					leftIconAction={()=>this.props.navigator.pop()}
                    rightButton='保存'
                    rightButtonAction={this.saveSetting.bind(this)}
				/>
                <View style={styles.firstRowView}>
                    <Text style={styles.textStyle}>全天</Text>
                    <Switch
                        onValueChange={(value) => this.setState({allDaySwitch: value})}
                        value={this.state.allDaySwitch}
                        onTintColor="#ffc400"
                        thumbTintColor={Platform.OS == 'ios'?null:'white'}
                    />
                </View>

                <View>
                    <Text style={{margin:10}}>
                            选择你可以接听电话的时间段
                    </Text>

                    <CustomButton 
                     text={"开始时间 "+this.state.startTime}
                    onPress={this.showPicker.bind(this,{
                        hour: this.state.startHour,
                        minute: this.state.startMinute,
                        is24Hour:true,
                    },'start')}
                    />
                    <CustomButton 
                    text={"结束时间 "+this.state.endTime}
                    onPress={this.showPicker.bind(this,{
                        hour: this.state.endHour,
                        minute: this.state.endMinute,
                        is24Hour:true,
                    },'end')}
                    />
                </View>

			</View>
		);
	}
}

const styles = StyleSheet.create({
	firstRowView: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor: '#a8a6b9',
        borderBottomWidth:1,
        height: 56,
        marginHorizontal: 16,
    },
    textStyle:{
        fontSize: 16,
        marginTop: 10,
        color: '#1b2833',
    },
    button: {
        margin:5,
        backgroundColor: 'white',
        padding: 15,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#cdcdcd',
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});