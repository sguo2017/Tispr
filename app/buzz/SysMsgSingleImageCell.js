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

const FeedSingleImageItem = ({
    action_title,
    action_desc,
    user_name,
    onPress
}) => {
    return (
        <TouchableOpacity
            activeOpacity={0.75}
            style={{
                width: screenW,
                padding: 15,
                marginTop: 15,
                flexDirection: 'row',
                backgroundColor: '#fff',
                justifyContent: 'space-between'
            }}
            onPress={onPress}
        >
            <View style={{justifyContent: 'space-between'}}>
                <Text numberOfLines={2} style={{width: screenW * 0.55, fontSize: 15}}>{action_title}</Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <Image
                            style={{width: 14, height: 14, marginRight: 3}}
                            source={require('../resource/ic_feed_watch.png')}
                        />
                        <Text style={{color: 'rgb(150,150,150)', fontSize: 13}}>{user_name}</Text>
                    </View>
                    <Text style={{color: 'rgb(150,150,150)', fontSize: 13}}>{action_desc}</Text>
                </View>
            </View>
            <Image
                style={{height: 80, width: (screenW - 15 * 2 - 10 * 2) / 3}}
                defaultSource={require('../resource/img_news_default.png')}
            />
        </TouchableOpacity>
    )
};

export default FeedSingleImageItem;