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
    interval,
    user_name
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
            >
            <View style ={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <View style={{justifyContent: 'space-around'}}>
                        <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                            <Text numberOfLines={2} style={{width: screenW * 0.7, fontSize: 16, flexShrink: 0}}>
                                <Text style={{color: '#1B2833', marginRight: 4, fontSize: 16}} >{user_name}&nbsp;&nbsp;&nbsp;</Text>
                                <Text>{action_title}</Text>
                            </Text>
                            <View numberOfLines={2} style={{width: screenW * 0.1,flexShrink: 0, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
                                <Text style={{fontSize:14}}>{interval}</Text>
                            </View>
                        </View>
                        <Text style={{color: '#4A90E2', fontSize: 14, paddingRight: 90}}>{action_desc}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }else{
        return null;
    }
};

export default SysMsgSingleImageItem;