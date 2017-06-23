import React, { Component } from 'react';
import { observer } from 'mobx-react/native'
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  TextInput
} from 'react-native';
import Header from '../../components/HomeNavigation';
import Constant from '../../common/constants';
const msg1 = '我想我能够帮到您！';
const msg2 = '能否再说得详细些？';
const msg3 = '请问需要多长时间内完成？';
export default class ConnectPage extends Component{
    constructor(props) {  
        super(props);
        this.state={
            msg:'',
            send_default_chat_conteng: true,
            button1: true,
            button2: false, 
            button3: false,
        }
    }

    render(){
        const { feed } = this.props;                               
        let default_msg = feed.user_name + '您好！' + this.state.button1&&msg1 + this.state.button2&&msg2 + this.state.button3&&msg3;
        return(
            <View>
                <Header
                    leftIconAction={() => this.props.navigator.pop()}
                    leftIcon={require('../../resource/ic_back_dark.png')}
                    title='联系TA'
                />
                {
                    this.state.send_default_chat_conteng?
                    <View style={{padding:20}}>
                        <Image 
                        style={{width:50,height:50,borderRadius:25,alignSelf:'center'}} 
                        defaultSource={require('../../resource/user_default_image.png')}
                        source={{uri: feed.avatar}}/>
                        <Text style={{color:'black', fontSize:18,marginTop:20,marginBottom:20,height:80}}>{feed.user_name} 您好！{this.state.button1&&msg1}{this.state.button2&&msg2}{this.state.button3&&msg3}</Text>
                        <TouchableHighlight 
                            style={[!this.state.button1&&styles.notSelectedButton, this.state.button1&&styles.selectedButton,{width:160}]} 
                            onPress={()=>this.setState({button1: !this.state.button1})}
                        >
                            <Text style={[!this.state.button1&&styles.themeColorText, this.state.button1&&styles.whiteText]}>{msg1}</Text>
                        </TouchableHighlight>
                        <TouchableHighlight 
                            style={[!this.state.button2&&styles.notSelectedButton, this.state.button2&&styles.selectedButton,{width:160}]} 
                            onPress={()=>this.setState({button2: !this.state.button2})}
                        >
                            <Text style={[!this.state.button2&&styles.themeColorText, this.state.button2&&styles.whiteText]}>{msg2}</Text>
                        </TouchableHighlight>
                        <TouchableHighlight 
                            style={[!this.state.button3&&styles.notSelectedButton, this.state.button3&&styles.selectedButton]} 
                            onPress={()=>this.setState({button3: !this.state.button3})}
                        >
                            <Text style={[!this.state.button3&&styles.themeColorText, this.state.button3&&styles.whiteText]}>{msg3}</Text>
                        </TouchableHighlight>
                        <View style={{height: 1, backgroundColor: 'rgba(0,0,0,0.12)', marginVertical: 13.7}}></View>

                        <TouchableHighlight 
                            style={[styles.notSelectedButton, {width: 90}]} 
                            onPress={()=>this.setState({send_default_chat_conteng:false})}
                        >
                            <Text style={[styles.themeColorText, {width: 86}]}>自定义信息</Text>
                        </TouchableHighlight>
                    </View>:
                    <View style={{padding: 20}}>
                        <Image 
                        style={{width:50,height:50,borderRadius:25,alignSelf:'center'}} 
                        defaultSource={require('../../resource/user_default_image.png')}
                        source={{uri: feed.avatar}}/>                                
                        <Text style={{ marginTop:30, color: "#a8a6b9", fontSize: 16}}>联系{feed.user_name}询问服务细节</Text>
                        <TextInput
                            multiline={true}
                            numberOfLines={3}
                            placeholder='请输入聊天内容'
                            onChangeText={(val) => {
                                this.setState({ msg: val })
                                }}
                        />
                        <TouchableHighlight 
                            onPress={()=>this.setState({send_default_chat_conteng:true})}
                        >
                            <Text style={[styles.themeColorText]}>发送默认消息</Text>
                        </TouchableHighlight>
                    </View>
                }
                
                    <TouchableHighlight style={[styles.button, {backgroundColor:global.gColors.buttonColor,position:'absolute', top: 506,flexShrink: 0, width: global.gScreen.width}]}
                        onPress={() =>{
                            this.props.callback(
                                this.props.discardIndex,
                                Constant.sys_msgs_status.FINISHED,
                                this.props.feed.smt_id, 
                                this.state.send_default_chat_conteng?
                                default_msg :this.state.msg);
                            this.props.navigator.pop()}}

                    >
                        <Text style={styles.buttonText}
                        >
                        联系TA
                        </Text>
                    </TouchableHighlight>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    notSelectedButton: {
        borderWidth: 1,
        borderColor: global.gColors.themeColor,
        padding:5,
        height: 36,
        width:210,
        marginRight: 20,
        marginBottom:20
    },
    selectedButton:{
        borderWidth: 1,
        borderColor: global.gColors.themeColor,
        backgroundColor: global.gColors.themeColor,
        padding:5,
        height: 36,
        width:210,
        marginRight: 20,
        marginBottom:20
    },
    themeColorText:{
        color:global.gColors.themeColor,
        fontSize:16
    },
    whiteText: {
        color:'#fff',
        fontSize:16
    },
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