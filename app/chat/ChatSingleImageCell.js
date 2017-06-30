import React, { PureComponent } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    Dimensions
} from 'react-native';
import DateUtil from '../common/DateUtil';

const screenW = Dimensions.get('window').width;

const ChatSingleImageItem = ({
    user_name,
    serv_offer_title,
    lately_chat_content,
    avatar,
    onPress,
    updated_at,
    status,
    chat_status
}) => {
    var smartTime = DateUtil.dataStrToSmartDate(updated_at);
    return (
        <TouchableOpacity
            activeOpacity={0.75}
            style={{
                paddingHorizontal: 12,
                paddingVertical: 16,
                marginTop: 1,
                flexDirection: 'row',
                backgroundColor: '#fff',
                justifyContent: 'space-between'
            }}
            onPress={onPress}
        >
          <Image style={{width: 40, height: 40, marginRight: 12, borderRadius: 20}} source={{ uri: avatar }}/>
          <View style={{ flex: 1 }}>
            <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center',paddingBottom:2}}>
              {/*姓名*/}
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Text numberOfLines={1} style={{ fontSize: 16, color:'#1b2833' }}>{user_name}</Text>
                {
                  status=='00C'?
                    <View style={{ backgroundColor: '#ffc400', borderRadius: 2, paddingVertical: 2, paddingHorizontal: 4, marginLeft: 8 }}>
                      <Text style={{fontSize: 12, color: 'white'}}>达成协议</Text>
                    </View> : null
                }
              </View>
              {/*未读/时间*/}
              <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                {
                  chat_status == 'unread'?
                    <View style={{ backgroundColor: '#FF5252', borderRadius: 4, height: 8, width: 8, marginRight: 4 }} />
                    : null
                }
                <Text numberOfLines={1} style={{ fontSize: 12, color: '#b8b8b8' }}>{smartTime}</Text>
              </View>
            </View>
            {/*副标题*/}
            <Text numberOfLines={1} style={{ marginTop: 2, color: '#999999', fontSize: 14 }}>
              {
                serv_offer_title == null || serv_offer_title.length <= 0 ? "Tempe,Arizona, United States, 85281" : serv_offer_title
              }
            </Text>
            {/*内容*/}
            <Text style={{ color: '#4a90e2',marginRight: 5, fontSize: 14}} >{lately_chat_content}</Text>
          </View>
        </TouchableOpacity>
    )
};

export default ChatSingleImageItem;