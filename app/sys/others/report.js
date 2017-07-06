import React, { Component, PureComponent } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    StyleSheet,
    Navigator,
    TouchableHighlight,
    Alert
} from 'react-native'
import Header from '../../components/HomeNavigation';
import Constant from '../../common/constants';
export default class PasswordConfirm extends Component{
    constructor(props) {
		super(props);
        this.state = {
            content: ''
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
				/>
                <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',margin:10}}>
                    <TextInput
                    style={styles.input}
                    multiline={true}
                    numberOfLines={1}
                    value = {this.state.content}
                    onChangeText={(text) => this.setState({ content: text })}
                    />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center',marginLeft:10 }}>
                    <Text style={{fontSize:16,color:global.gColors.themeColor}}>请详细描述举报原因</Text>
                </View>
                <TouchableHighlight onPress={this._sendReport.bind(this)} style={[styles.button, { backgroundColor: global.gColors.buttonColor, position: 'absolute', bottom:22, flexShrink: 0, width: global.gScreen.width }]}>
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
    fontSize: 18,
    width: global.gScreen.width - 40,
    // borderWidth: 1,
    borderColor: '#48bbec',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
},
})