import React, { Component } from 'react';
import { observer } from 'mobx-react/native'
import {
  View,
  StyleSheet,
  Image,
  InteractionManager,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  TextInput,
  Platform,
  ScrollView
} from 'react-native';
import Header from '../../components/HomeNavigation';
import Constant from '../../common/constants';
import AutoTextInput from '../../components/AutoTextInput'

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
            content: '',
            editable: false
        }
    }

    focusOnTextInput = () => {
        this.setState({ editable: true });
        InteractionManager.runAfterInteractions(() => {
            this.modelTextInput.focus();
        });
    }

    render(){
        const { feed } = this.props;      
        let button1 = this.state.button1;
        let button2 = this.state.button2;
        let button3 = this.state.button3;
        let name = feed.user_name;
        let content = this.state.content;
        let send_default_chat_conteng = this.state.send_default_chat_conteng;
        let length = 0;   

        let default_msg;
        default_msg =`${feed.user_name}` + '您好！';
        if(this.state.button1)
            default_msg += msg1;
        if(this.state.button2)
            default_msg += msg2;
        if(this.state.button3)
            default_msg += msg3;
        if (this.state.content)
            default_msg += this.state.content;
        return(
            <View style={{flex: 1, backgroundColor: '#fff'}}>
                <Header
                    leftIconAction={() => this.props.navigator.pop()}
                    leftIcon={require('../../resource/ic_back_white.png')}
                    title='联系TA'
                />
                <ScrollView>
                    <View style={{padding:20}}>
                        <Image 
                        style={{width:50,height:50,borderRadius:25,alignSelf:'center'}} 
                        defaultSource={require('../../resource/user_default_image.png')}
                        source={{uri: feed.avatar}}/>
                        <TextInput
                            ref={(textInput) => { this.modelTextInput = textInput; }}
                            multiline={true}
                            onChangeText={(text) => 
                                {
                                    length= (name+'您好！'+(button1?msg1: '')+(button2?msg2: '')+(button3?msg3: '')).length;
                                    this.setState({content: text.substring(length)});

                                }
                            }
                            onBlur={() => {
                                this.setState({send_default_chat_conteng: true})}
                            }
                            style={{fontSize: 16, color: '#1B2833', marginBottom: 8, height: 100}}
                            value={name+'您好！'+(button1?msg1: '')+(button2?msg2: '')+(button3?msg3: '')+content}
                            underlineColorAndroid={'transparent'}
                            editable={this.state.editable}
                        />
                        <TouchableHighlight 
                            style={[!this.state.button1&&styles.notSelectedButton, this.state.button1&&styles.selectedButton]} 
                            onPress={()=>this.setState({button1: !this.state.button1})}
                        >
                            <Text style={[!this.state.button1&&styles.themeColorText, this.state.button1&&styles.whiteText]}>{msg1}</Text>
                        </TouchableHighlight>
                        <TouchableHighlight 
                            style={[!this.state.button2&&styles.notSelectedButton, this.state.button2&&styles.selectedButton]} 
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

                        <Text onPress={()=> {
                            {/* this.setState({editable: true}); */}
                            this.focusOnTextInput();
                            }} style={[styles.themeColorText]}>
                            自定义信息
                        </Text>
                    </View>
                    
                </ScrollView>
                <TouchableHighlight style={[styles.button, {backgroundColor:global.gColors.buttonColor,position:'absolute', bottom: 0, flexShrink: 0, width: global.gScreen.width}]}
                    onPress={() =>{
                        this.props.callback(
                            this.props.discardIndex,
                            Constant.sys_msgs_status.FINISHED,
                            this.props.feed.smt_id, 
                            this.state.send_default_chat_conteng?default_msg :this.state.msg,
                            this.props.feed.user_id);
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
        width:Platform.OS === 'ios'? 260: 210,
        marginRight: 20,
        marginBottom:20,
        borderRadius: 4,
        justifyContent: 'center'
    },
    selectedButton:{
        borderWidth: 1,
        borderColor: global.gColors.themeColor,
        backgroundColor: global.gColors.themeColor,
        padding:5,
        height: 36,
        width:Platform.OS === 'ios'? 260: 210,
        marginRight: 20,
        marginBottom:20,
        borderRadius: 4,
        justifyContent: 'center'
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
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0,
    },
    buttonText: {
        fontSize: 22,
        color: '#FFF',
        alignSelf: 'center'
    },
})