import React, { Component } from 'react';
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
    user,
    link_user,
    onPressAvatar,
    onPressAvatar2,
    onPressOffer,
    onPressAddress
}) => {
    let action_title_arry = action_title.split("__")
    let array_length =action_title_arry.length;
    let action_desc_arry = action_desc.split("__")
    let array_desc_length =action_desc_arry.length;
    if(action_title){
        return (
            <TouchableOpacity
                activeOpacity={0.75}
                style={{
                    paddingHorizontal: 12,
                    paddingVertical: 16,
                    marginTop: 1,
                    flexDirection: 'row',
                    backgroundColor: '#fff',
                }}                
            >
                <TouchableOpacity onPress={onPressAvatar}>
                    <Image style={{ width: 40, height: 40, marginLeft: 12, marginRight: 8, borderRadius: 20 }} defaultSource={require('../resource/user_default_image.png')} source={{ uri: user.avatar }}/>
                </TouchableOpacity>
                <View style={{ flex: 1 ,flexWrap: 'wrap'}} >
                    <Text>
                        <Text onPress={onPressAvatar} numberOfLines={1} style={{ color: '#1b2833', marginRight: 4, fontSize: 16 }} >{user.name}</Text>
                        {
                            array_length == 3 ?
                            <Text>
                                <Text numberOfLines={1} style={{ flex: 1, color: '#999999', fontSize: 16 }}>
                                    {action_title_arry[0]}
                                </Text>
                                <Text onPress={onPressAvatar2} numberOfLines={1} style={{ flex: 1, color: '#000000', fontSize: 16 }}>
                                    {link_user?link_user.name:action_title_arry[1]}
                                </Text>
                                <Text numberOfLines={1} style={{ flex: 1, color: '#999999', fontSize: 16 }}>
                                    {action_title_arry[2]}
                                </Text>
                            </Text>
                            :
                            <Text numberOfLines={1} style={{ flex: 1, color: '#999999', fontSize: 16 }}>
                                {action_title}
                            </Text>
                        }                         
                    </Text>
                        {
                            array_desc_length == 3 ?
                            <Text>
                                <Text numberOfLines={1} style={{ flex: 1, color: '#999999', fontSize: 16 }}>
                                    {action_desc_arry[0]}
                                </Text>
                                <Text onPress={onPressAddress} numberOfLines={1} style={{ flex: 1, color: '#000000', fontSize: 16 }}>
                                    {action_desc_arry[1]}
                                </Text>
                                <Text numberOfLines={1} style={{ flex: 1, color: '#999999', fontSize: 16 }}>
                                    {action_desc_arry[2]}
                                </Text>
                            </Text>
                            :
                            <Text onPress={onPressOffer} numberOfLines={2} style={{ flex: 1, color: '#4a90e2', fontSize: 14 }}>{action_desc}</Text>                            
                        }          
                    
                </View>
                <Text numberOfLines={1} style={{ fontSize:12, color: '#b8b8b8' }}>{interval}</Text>
            </TouchableOpacity>
        )
    }else{
        return null;
    }
};

export default SysMsgSingleImageItem;