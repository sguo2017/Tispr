import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    Dimensions
} from 'react-native';
const screenW = Dimensions.get('window').width;

const RequestMsgSingleImageItem = ({
    action_title,
    action_desc,
    user,
    onPress
}) => {
    return (
        <TouchableOpacity
            activeOpacity={0.75}
            style={{
                width: screenW,
                padding: 15,
                marginTop: 2,
                flexDirection: 'row',
                backgroundColor: '#fff',
                justifyContent: 'space-between'
            }}
            onPress={onPress}
        >
           <View style ={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <View style={{justifyContent: 'space-around'}}>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                        <Text numberOfLines={2} style={{width: screenW * 0.55, fontSize: 15, flexShrink: 0}}>
                            <Text style={{fontWeight: 'bold', color: 'black',marginRight: 5}} >{user.name}&nbsp;&nbsp;&nbsp;</Text>
                            <Text>{action_title}</Text>
                        </Text>
                        <View numberOfLines={2} style={{width: screenW * 0.25,flexShrink: 0, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
                            <Text style={{fontSize:13}}>1h</Text>
                        </View>
                    </View>
                    
                    {
                        action_desc === null ? 
                        <Text style={{color: 'black'}}>Tempe,Arizona, United States, 85281</Text> : 
                        <Text style={{color: 'green', fontSize: 15}}>{action_desc}</Text>
                    }
                </View>
                <Image
                    style={{height: 80, width: (screenW - 15 * 2 - 10 * 2) / 3}}
                    defaultSource={require('../../resource/img_news_default.png')}
                />
            </View>
        </TouchableOpacity>
    )
};

export default RequestMsgSingleImageItem;