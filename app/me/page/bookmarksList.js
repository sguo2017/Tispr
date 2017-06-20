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
import {connect} from 'react-redux';
import Marklist from '../mark/marklist';



class BookmarksList extends PureComponent {

     render() {
        return(

              <View style={styles.listView}>
                <Marklist {...this.props} />
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

export default connect((state) => {
    const {MeMarkList} = state;
    return {MeMarkList}
})(BookmarksList);