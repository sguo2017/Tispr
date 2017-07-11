import React, { Component, PureComponent } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    StyleSheet,
    Navigator,
    TouchableHighlight,
    Alert,
    TouchableOpacity,
    ScrollView
} from 'react-native'
import Header from '../../components/HomeNavigation';
import Constant from '../../common/constants';
import ImagePicker from 'react-native-image-picker';
import AutoTextInput from '../../components/AutoTextInput';

export default class PasswordConfirm extends Component{
    constructor(props) {
		super(props);
        this.state = {
            content: '',
            title: '',
            choices: [false, false, false, false, false, false, false]
        };
	}

    async _sendReport(){
        try {
            let url ='http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_REPORT +`${global.user.authentication_token}`;            
            let response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    report: {
                        obj_id: this.props.obj.id,
                        obj_type: this.props.obj.type,
                        content: this.state.content
                    }
                })
            });
            let res = await response.text();
            let result = JSON.parse(res);
            if (response.status >= 200 && response.status < 300) {
                Alert.alert(
                    '提示',
                    '举报成功',
                    [
                    { text: '确定', onPress: () => this.props.navigator.pop()},
                    ]
                )              
            } else {
                let error = res;
                throw error;
            }
        } catch (error) {
            console.log("error "+error);
        }
    }

    render(){
        return(
            <View style={{ backgroundColor: 'white',flex: 1}}>
                <Header
					title='举报'
					leftIcon={require('../../resource/ic_back_white.png')}
					leftIconAction={()=> this.props.navigator.pop()}
                    rightButton='提交'
                    rightButtonAction={this._sendReport.bind(this)}
				/>
                <ScrollView>
                <View style={{marginHorizontal: 15, marginVertical: 25}}>
                    <Text style={{color: '#999999', fontSize: 14}}>{this.state.title?this.state.title:'理由'}</Text>
                </View>
                <View style={{flexWrap: 'wrap', flexDirection: 'row', marginLeft: 5}}>
                    <TouchableOpacity 
                        style={[styles.touch, this.state.choices[0] && { backgroundColor: global.gColors.themeColor}]}
                        onPress={()=>this.setState({title: '虚假信息', choices: [true, false, false, false, false, false, false]})}
                    >
                        <Text style={[styles.text, this.state.choices[0] && {color: 'white'}]}>虚假信息</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.touch, this.state.choices[1] && { backgroundColor: global.gColors.themeColor}]} 
                        onPress={()=>this.setState({title: '泄露/侵犯他人隐私', choices: [false, true, false, false, false, false, false]})}
                    >
                        <Text style={[styles.text, this.state.choices[1] && {color: 'white'}]}>泄露/侵犯他人隐私</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.touch, this.state.choices[2] && { backgroundColor: global.gColors.themeColor}]}
                        onPress={()=>this.setState({title: '盗用他人作品', choices: [false, false, true, false, false, false, false]})}
                    >
                        <Text style={[styles.text, this.state.choices[2] && {color: 'white'}]}>盗用他人作品</Text>
                    </TouchableOpacity >
                    <TouchableOpacity 
                        style={[styles.touch, this.state.choices[3] && { backgroundColor: global.gColors.themeColor}]} 
                        onPress={()=>this.setState({title: '侮辱、谩骂、不文明用语', choices: [false, false, false, true, false, false, false]})}
                    >
                        <Text style={[styles.text, this.state.choices[3] && {color: 'white'}]}>侮辱、谩骂、不文明用语</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.touch, this.state.choices[4] && { backgroundColor: global.gColors.themeColor}]} 
                        onPress={()=>this.setState({title: '暴力、血腥、色情内容', choices: [false, false, false, false, true, false, false]})}
                    >
                        <Text style={[styles.text, this.state.choices[4] && {color: 'white'}]}>暴力、血腥、色情内容</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.touch, this.state.choices[5] && { backgroundColor: global.gColors.themeColor}]} 
                        onPress={()=>this.setState({title: '消极应对、拖延时间', choices: [false, false, false, false, false, true, false]})}
                    >
                        <Text style={[styles.text, this.state.choices[5] && {color: 'white'}]}>消极应对、拖延时间</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.touch, this.state.choices[6] && { backgroundColor: global.gColors.themeColor}]} 
                        onPress={()=>this.setState({title: '错误分类', choices: [false, false, false, false, false, false, true]})}
                    >
                        <Text style={[styles.text, this.state.choices[6] && {color: 'white'}]}>错误分类</Text>
                    </TouchableOpacity>
                </View>
                <View style={{marginHorizontal: 15, marginVertical: 25}}>
                    <Text style={{color: '#999999', fontSize: 14}}>描述</Text>

                    <AutoTextInput
                        editable = {true}
                        style={styles.innput}
                        maxLength={1000}
                        underlineColorAndroid="#F2F2F2"
                        multiline={true}
                        numberOfLines={0}
                        value ={this.state.content}
                        autoFocus
                        onChangeText={(val) => {
                        this.setState({ content: val})
                        }}
                    />

                    {/*<TextInput
                    style={styles.input}
                    underlineColorAndroid="transparent"
                    multiline={true}
                    numberOfLines={1}
                    value = {this.state.content}
                    onChangeText={(text) => this.setState({ content: text })}
                    />*/}
                    <View style={{alignItems: 'flex-end'}}>
                        <Text style={{color: '#B8B8B8', fontSize: 12}}>{this.state.content? this.state.content.length:0}/1000</Text>
                    </View>
                </View>
                <View style={{marginHorizontal: 15, marginVertical: 25}}>
                    <Text style={{color: '#999999', fontSize: 14}}>附件</Text>
                </View>
                </ScrollView>
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
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
  },
  buttonText: {
    fontSize: 22,
    color: '#FFF',
    alignSelf: 'center'
  },
  input: {
    height: 50,
    margin: 10,
    padding: 4,
    fontSize: 16,
    width: global.gScreen.width - 40,
    // borderWidth: 1,
    borderColor: '#48bbec',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  touch: {
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#4A90E2',
    height: 28,
    paddingHorizontal: 8,
    marginLeft: 8,
    marginBottom: 8
  },
  text: {
      color: '#4A90E2',
      lineHeight: 22
  }
})