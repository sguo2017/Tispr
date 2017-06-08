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

const SysMsgSingleImageItem = ({
    action_title,
    action_desc,
    user,
    onPress
}) => {
        if(action_title){
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
                    <Image style={{width: 40, height: 40, marginRight: 8, borderRadius: 20}} defaultSource={require('../resource/user_default_image.png')} source={{uri: user.avatar}}/>
                    <View style={{justifyContent: 'space-around'}}>
                        <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                            <Text numberOfLines={2} style={{width: screenW * 0.7, fontSize: 16, flexShrink: 0}}>
                                <Text style={{color: '#1B2833', marginRight: 4, fontSize: 16}} >{user.name}&nbsp;&nbsp;&nbsp;</Text>
                                <Text>{action_title}</Text>
                            </Text>
                            <View numberOfLines={2} style={{width: screenW * 0.1,flexShrink: 0, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
                                <Text style={{fontSize:14}}>1h</Text>
                            </View>
                        </View>
                        <Text style={{color: '#4A90E2', fontSize: 14, paddingRight: 90}}>{action_desc}</Text>
                    </View>
                    <Image
                        style={{height: 80, width: (screenW - 15 * 2 - 10 * 2) / 3}}
                        defaultSource={require('../resource/img_news_default.png')}
                    />
                </View>
            </TouchableOpacity>
        )
    }else{
        return null;
    }
};

export default SysMsgSingleImageItem;