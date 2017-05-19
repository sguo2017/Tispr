import React, { Component } from 'react';
import { observer } from 'mobx-react/native'
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import Header from '../../components/HomeNavigation';
export default class ConnectPage extends Component{
    constructor(props) {  
        super(props);
        this.state={
            msg:'我想我能够帮到您！'
        }
    }
    render(){
        const { content } = this.props;
        return(
            <View>
                <Header
                    leftIconAction={() => this.props.navigator.pop()}
                    leftIcon={require('../../resource/ic_back_dark.png')}
                    title='联系TA'
                />
                <View style={{padding:20}}>
                    <Image 
                    style={{width:50,height:50,borderRadius:25,alignSelf:'center'}} 
                    source={require('../../resource/user_default_image.png')}/>
                    <Text style={{color:'black', fontSize:18,marginTop:20,marginBottom:20}}>{content.user_name} 您好！{this.state.msg}</Text>
                    <TouchableHighlight 
                        style={[styles.selectButton,{width:160}]} 
                        onPress={()=>this.setState({msg:'我想我能够帮到您！'})}
                    >
                        <Text style={[styles.themeColorText]}>我想我能够帮到您！</Text>
                    </TouchableHighlight>
                    <TouchableHighlight 
                        style={[styles.selectButton,{width:160}]} 
                        onPress={()=>this.setState({msg:'能否再说得详细些？'})}
                    >
                        <Text style={[styles.themeColorText]}>能否再说得详细些？</Text>
                    </TouchableHighlight>
                    <TouchableHighlight 
                        style={[styles.selectButton]} 
                        onPress={()=>this.setState({msg:'请问需要多长时间内完成？'})}
                    >
                        <Text style={[styles.themeColorText]}>请问需要多长时间内完成？</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={[styles.button, {backgroundColor:global.gColors.buttonColor,position:'absolute', top: 506,flexShrink: 0, width: global.gScreen.width}]}>
                        <Text style={styles.buttonText}>
                        联系TA
                        </Text>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    selectButton: {
        borderWidth: 1,
        borderColor: global.gColors.themeColor,
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