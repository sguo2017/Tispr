import React, { PureComponent } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    Platform,
    RefreshControl,
    Linking,
    Alert,
    ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import { fetchVillageList } from '../actions/VillageListActions';
import Loading from '../components/Loading';
import Util from '../common/utils';
import Constant from '../common/constants';
import Me from '../me/index';
import VillageDetail from './VillageDetail';
class ExploreVillageList extends PureComponent {

    constructor(props) {
        super(props);
        this._onMomentumScrollEnd = this._onMomentumScrollEnd.bind(this);
        this._onRefresh = this._onRefresh.bind(this);
    }
    componentDidMount() {
        const { dispatch } = this.props;
        if(!global.user.authentication_token){
            Util.noToken(this.props.navigator);
        }
        let exploreparams = this.props.exploreparams;

        dispatch(fetchVillageList(1, exploreparams, this.props.navigator));
    }

    _onMomentumScrollEnd(event) {
        const { dispatch, VillageList } = this.props;
        if (!VillageList.canLoadMore || VillageList.isLoadMore) return;

        const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
        let contentSizeH = contentSize.height;
        let viewBottomY = contentOffset.y + layoutMeasurement.height;

        if (Math.abs(viewBottomY - contentSizeH) <= 40) {
            dispatch(fetchVillageList(VillageList.page + 1, this.props.exploreparams, this.props.navigator));
        }
    }

    _onRefresh() {
        if (!global.user.authentication_token) {
            Util.noToken(this.props.navigator);
        }
        const { dispatch } = this.props;
        dispatch(fetchVillageList(1, this.props.exploreparams, this.props.navigator));
    }
    jumpVillageDetail(village){
        this.props.navigator.push({
            component: VillageDetail,
            passProps: {village}
        })
    }
    render() {
        const { VillageList } = this.props;
        return (
            <View style={styles.container}>
                {!VillageList.isLoading &&
                    <ScrollView
                        ref={scrollView => this.scrollView = scrollView}
                        style={{ flex: 1 }}
                        automaticallyAdjustContentInsets={false}
                        removeClippedSubviews={true}
                        scrollEventThrottle={16}
                        onMomentumScrollEnd={this._onMomentumScrollEnd}
                        bounces={true}
                        refreshControl={
                            <RefreshControl
                                refreshing={VillageList.isLoading}
                                onRefresh={this._onRefresh}
                                colors={['rgb(217, 51, 58)']}
                            />
                        }
                    >
                        <View style={styles.contentContainer}>
                            <View style={{ flex: 1 }}>
                                {VillageList.villageList.map((data, index) => {
                                    return (
                                        <TouchableOpacity key={index} onPress={this.jumpVillageDetail.bind(this, data)} style={{flexDirection:'row',alignItems: 'center',margin:6, paddingHorizontal: 12}}>
                                            
                                            <Text style={{color:'#000',margin:10,fontSize:16}}>{data.name}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                        {
                            VillageList.isLoadMore ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator />
                                    <Text style={{ fontSize: 14, marginLeft: 5 }}>正在加载更多的数据...</Text>
                                </View>
                            ) : null
                        }
                    </ScrollView>
                }
                <Loading isShow={VillageList.isLoading} />
            </View>
        );
    }
}
export default connect((state) => {
    const { VillageList } = state;
    return { VillageList }
})(ExploreVillageList);

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    overflow: 'hidden',
    padding: 4,
  },
  loadingContainer: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  container: {
    flex: 1,
    backgroundColor: '#eee'
  },
});
