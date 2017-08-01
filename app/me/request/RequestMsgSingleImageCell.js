import React, {Component} from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Image,
    Dimensions
} from 'react-native';
import DateUtil from '../../common/DateUtil';
const screenW = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    overflow: 'scroll',
  },
  cardContainer: {
    width: screenW,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 4,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 3,
    shadowOpacity: 0.3,
  },
  mark: {
    marginLeft: 4,
    backgroundColor: '#fff',
    borderRadius: 4,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 3,
    shadowOpacity: 0.3,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center'
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#999999',
    marginHorizontal: 8,
  },
});

const RequestMsgSingleImageItem = ({
  serv_detail,
  created_at,
  catalog,
  onPress,
  archivedPress
}) => {
  const createDate = DateUtil.dataStrToSmartDate(created_at);
  return (
    <ScrollView style={styles.container} horizontal={true} showsHorizontalScrollIndicator={false}>
      <TouchableOpacity
        elevation={5}
        activeOpacity={0.75}
        style={styles.cardContainer}
        onPress={onPress}
      >
        <Text style={{ color: '#1b2833', fontSize: 14 }}>{serv_detail}</Text>
        <View style ={{ marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 12, color: '#999999' }}>{createDate}</Text>
          <View style={styles.dot} />
          <Text style={{ fontSize: 12, color: '#999999' }}>{catalog}</Text>
          <View style={styles.dot} />
          <Text style={{fontSize:12, color: '#4A90E2'}}>1/5投标</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.mark} onPress={archivedPress}>
        <Text style={{color: '#4a90e2'}}>存档</Text>
      </TouchableOpacity>
    </ScrollView>
  )
};

export default RequestMsgSingleImageItem;