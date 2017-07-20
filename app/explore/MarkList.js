import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet
} from 'react-native';

import Header from '../components/HomeNavigation';
import BookMarkList from '../me/page/bookmarksList'

export default class MarkList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: 'white'}}>
                <Header
                    title='收藏'
                    leftIcon={require('../resource/w-back.png')}
                    leftIconAction={() => this.props.navigator.pop()}
                    style={{ height: 50 }}
                />
                <BookMarkList/>
            </View>
        )
    }

}