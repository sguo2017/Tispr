import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  InteractionManager,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
  RefreshControl,
  Linking,
  Alert,
} from 'react-native';

import util from '../../common/utils'
import Constant from '../../common/constants'

export default class FriendsList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            friends: [],
            profriends: []
        }
    }

    componentWillMount() {
        
    }

    render() {
        return(
            <ScrollView style={{marginHorizontal: 16, marginVertical: 8}}>
                <View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={{color: 'black'}}>你的推荐</Text>
                        <Text style={{color: '#4a90e2'}}>添加推荐</Text>
                    </View>
                </View>
            </ScrollView>
        )
    }
}
