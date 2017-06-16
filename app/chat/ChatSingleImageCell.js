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

const ChatSingleImageItem = ({
    user_name,
    serv_offer_titile,
    lately_chat_content,
    avatar,
    onPress,
    updated_at,
    status
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
                <Image style={{width: 40, height: 40, marginRight: 5, borderRadius: 20}} source={{uri:avatar}}/>
                <View style={{justifyContent: 'space-around'}}>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center',paddingBottom:2}}>
                        <View style={{width: screenW * 0.6, flexDirection: 'row', alignItems: 'center'}}>
                            <Text numberOfLines={2}>
                                <Text style={{fontSize: 16, color:'black'}}>{user_name}</Text>
                            </Text>
                            {
                                status=='00C'?
                                <View style={{backgroundColor: '#FFC400', borderRadius: 2, height: 16}}>
                                    <Text style={{fontSize: 12, color: 'white'}}>达成协议</Text>
                                </View>:<View></View>
                            }
                        </View>
                        
                        <View numberOfLines={2} style={{width: screenW * 0.25, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
                            <Text style={{fontSize:12}}>{updated_at}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                        <Text numberOfLines={1} style={{width: screenW * 0.7}}>
                            {
                                serv_offer_titile === null ? 
                                <Text style={{color: 'black'}}>Tempe,Arizona, United States, 85281</Text> : 
                                <Text style={{color: 'grey', fontSize: 14, width: screenW*0.65 }}>{serv_offer_titile}</Text>
                            }
                        </Text>
                        <View style={{width: screenW * 0.05, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
                            <Text style={{fontSize:20}}>&gt;</Text>
                        </View>
                    </View>
                    
                    <Text style={{color: '#4A90E2',marginRight: 5, fontSize: 14}} >&quot;{lately_chat_content}&quot;&nbsp;&nbsp;&nbsp;</Text>
                </View>
                <Image
                    style={{height: 80, width: (screenW - 15 * 2 - 10 * 2) / 3}}
                    defaultSource={require('../resource/img_news_default.png')}
                />
            </View>
        </TouchableOpacity>
    )
};

export default ChatSingleImageItem;