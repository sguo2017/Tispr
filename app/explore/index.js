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
import {reaction} from 'mobx'
import {connect} from 'react-redux';
import Loading from '../components/Loading'
import LoadMoreFooter from '../components/LoadMoreFooter'
import Toast from 'react-native-easy-toast'
import Header from '../components/HomeNavigation';
import ServOfferList from './ServOfferList';



class ExploreList extends PureComponent {
    
    

    render() {
        return (
            <View style={styles.listView}>
                <Header
                    title='Qiker'
                />

                <ServOfferList {...this.props} />
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


export default connect((state) => {
    const {feedHome} = state;
    return {feedHome}
})(ExploreList);