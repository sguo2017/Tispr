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
import Header from '../../components/HomeNavigation';


export default class OffersList extends PureComponent {

     render() {
        return(

              <View style={styles.listView}>
                <Header
                    title='OffersList'
                />

               </View>
        )
    
     }


}



const styles = StyleSheet.create({
    listView: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    }
})
