import React, {PureComponent} from 'react';
import {
    View,
    Text,
    Image,
    ProgressBarAndroid,
    TouchableOpacity,
    TouchableHighlight,
    Platform,
    StyleSheet,
    Navigator
} from 'react-native'
import {observer} from 'mobx-react/native'
import Header from '../components/HomeNavigation';
import UselessTextInput from '../components/UselessTextInput';

@observer
export default class ServOffer extends PureComponent {
   
    render() {
      

        return (
            <View style={{flex: 1}}>
                <Header
                    title='Sell a service'
                    leftIcon={require('../resource/t_header_arrow_left.png')}
                />
                
                <ProgressBarAndroid color="#60d795" styleAttr='Horizontal' progress={0.9} indeterminate={false} style={{marginTop:-10}}/>
               
                <Text style={{alignSelf:'flex-end', color:"#a8a6b9"}}>90%</Text>
                
                <Image style={{ width: 50,height: 50, alignSelf:'center'}} source={require('../resource/t_text.png')} />

                <Text style={{alignSelf:'center', color:"#a8a6b9", fontSize: 12}}>What's the service?</Text>
                
                <Text style={{color:"#a8a6b9"}}>I will </Text>
                
                <UselessTextInput
                      multiline = {true}
                      numberOfLines = {3}
                 />
                
                <View style={{alignItems: 'center',flexDirection: 'row'}}>
                  <Text style={{color:"#a8a6b9"}}>min.15 characters</Text>
                  <Text style={{alignSelf:'flex-end',right: 5, justifyContent: 'center', position: 'absolute', color:"#a8a6b9"}}>62</Text>
                </View>
                
                <TouchableHighlight style={{backgroundColor: '#81d49c',marginTop: 20, alignSelf: 'stretch'}}>
                  <Text style={{fontSize: 22, color: '#FFF', alignSelf: 'center', backgroundColor: '#81d49c',}}>
                    下一步
                  </Text>
                </TouchableHighlight>

            </View>
        )
    }
}

const styles = StyleSheet.create({

})