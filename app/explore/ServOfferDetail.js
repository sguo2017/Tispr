import React, {PureComponent} from 'react'
import {
    StyleSheet,
    View,
    Text,
    Image,
    ListView,
    TouchableOpacity,
    RefreshControl,
} from 'react-native'
import {observer} from 'mobx-react/native'
import {reaction} from 'mobx'
import {connect} from 'react-redux';
import Loading from '../components/Loading'
import LoadMoreFooter from '../components/LoadMoreFooter'
import Toast from 'react-native-easy-toast'
import Header from '../components/HomeNavigation';



@observer
export default class ServOfferDetail extends PureComponent {
    

    render() {
        return (
            <View style={styles.listView}>
                <Header
                    title='ServOfferDetail'
                />
            </View>
        )
    }
}



const styles = StyleSheet.create({
    listView: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
})
