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
    serv_offer_user_name,
    serv_offer_titile,
    lately_chat_content,
    avatar,
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
                <Image style={{width: 70, height: 70, marginRight: 5, borderRadius: 35}} source={{uri:avatar}}/>
                <View style={{justifyContent: 'space-around'}}>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center',paddingBottom:2}}>
                        <Text numberOfLines={2} style={{width: screenW * 0.5, fontSize: 15, flexShrink: 0}}>
                            <Text style={{fontSize: 18, color:'black', fontWeight:'bold'}}>{serv_offer_user_name}</Text>
                        </Text>
                        <View numberOfLines={2} style={{width: screenW * 0.25, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
                            <Text style={{fontSize:13}}>星期五</Text>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                        <Text numberOfLines={1} style={{width: screenW * 0.7}}>
                            {
                                serv_offer_titile === null ? 
                                <Text style={{color: 'black'}}>Tempe,Arizona, United States, 85281</Text> : 
                                <Text style={{color: 'grey', fontSize: 16, width: screenW*0.65 }}>{serv_offer_titile}</Text>
                            }
                        </Text>
                        <View style={{width: screenW * 0.05, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
                            <Text style={{fontSize:20}}>&gt;</Text>
                        </View>
                    </View>
                    
                    <Text style={{color: 'black',marginRight: 5, fontSize: 16}} >&quot;{lately_chat_content}&quot;&nbsp;&nbsp;&nbsp;</Text>
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