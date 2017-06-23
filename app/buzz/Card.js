import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  PanResponder,
  TouchableWithoutFeedback,
} from 'react-native';
import ConnectPage from './HeadCard/ConnectPage';
import DiscardPage from './HeadCard/DiscardPage';
import DateUtil from '../common/DateUtil';
import CardDetail from './HeadCard/CardDetail';
let styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingTop: 10,
    paddingBottom: 15,
    flex:1,
  },
  wrapper: {
    borderRadius: 5,
    backgroundColor: '#fff',
    flex:1,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 0.3,
  },
  button: {
    borderRadius: 8,
    height: 40,
    alignSelf: 'stretch',
    justifyContent: 'center',
    backgroundColor:global.gColors.buttonColor,
    margin:10
  },
  buttonText: {
    fontSize: 20,
    color: '#FFF',
    alignSelf: 'center'
  },
  headerContainer: {
    height :70,
    flexDirection:'row',
    alignItems:'center',
    padding: 10,
  },
  avatar: {
    borderRadius: 20,
    width: 40,
    height: 40,
  },
  contentView: {
    flex: 1,
    paddingVertical: 15,
    marginHorizontal: 10,
    borderTopWidth : 1,
    borderTopColor: '#f5f5f5',
  }
});

export default function Card({ content, navigator, width, height, update,index }) {
  var time = content.created_at;
  if (time.length >= 19) {
    var dateStr = time.substr(0,11);
    if (DateUtil.getCurrentDateStr() == dateStr) {
      time = time.substr(12);
    } else {
      time = dateStr;
    }
  }
  return (
    <View style={[styles.container,{ width, height }]}>
      <View elevation={5} style={styles.wrapper}>
        {/*右上关闭*/}
        <TouchableOpacity
          style={{ position: 'absolute', top: 0, right: 0, borderTopRightRadius: 5, overflow: 'hidden' }}
          onPress={()=>{navigator.push({component:DiscardPage,name:'DiscardPage',passProps:{feed:content,callback:update,discardIndex:index}})}}
        >
          <Image
            style={{ width: 30, height: 30 }}
            source={require('../resource/qk_card_close.png')}
          />
        </TouchableOpacity>
        {/*头部*/}
        <View style={styles.headerContainer}>
          <Image style={styles.avatar} source={{uri:content.avatar}}/>
          <View style={{ marginLeft: 10, flex: 1 }}>
            <View style={{ flexDirection:'row', alignItems:'center', justifyContent: 'space-between' }}>
              <Text style={{ color:'black', fontSize: 16 }}>{content.user_name}</Text>
              <Text style={{ color:'grey', fontSize: 12 }}>{time}</Text>
            </View>
            <View style={{ flexDirection:'row', marginTop: 3 }}>
              <Text style={{ color:'grey', fontSize: 14 }}>{content.catalog}</Text>
            </View>
          </View>
        </View>
        {/*内容*/}
        <View style={styles.contentView}>
          <Text style={{ color: global.gColors.themeColor, fontSize: 16, marginBottom: 8 }}>{content.action_desc}</Text>
        </View>
        {/*距离*/}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }}>
          <Image style={{ width: 18, height: 18 }} source={require('../resource/g-location-s.png')}/>
          <Text style={{ fontSize: 12, color: '#b8b8b8' }}>{content.district}</Text>
        </View>
        {/*按钮*/}
        <TouchableOpacity
          style={[styles.button, {backgroundColor:global.gColors.buttonColor,margin:10}]}
          onPress={()=>{navigator.push({component:CardDetail,name:'CardDetail',passProps:{feed:content,callback:update,discardIndex:index}})}}
        >
          <Text style={styles.buttonText}>
            查看详情
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
