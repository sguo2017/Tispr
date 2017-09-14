import React, {PureComponent} from 'react'
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
import { fetchRecommandList } from '../../actions/MeRecommandListActions';
import Loading from '../../components/Loading';
import util from '../../common/utils'
import Constant from '../../common/constants'
class RecommandList extends PureComponent {
    constructor(props) {
        super(props);
        this._onMomentumScrollEnd = this._onMomentumScrollEnd.bind(this);
        this._onRefresh = this._onRefresh.bind(this);
        this.state = {
        }
    }
    componentWillMount() {

    }
    componentDidMount() {
        const { dispatch, userId } = this.props;
        if(!global.user.authentication_token){
            Util.noToken(this.props.navigator);
        }
        dispatch(fetchRecommandList(1,userId, this.props.navigator));
    }
    _onMomentumScrollEnd(event) {
        const { dispatch, MeRecommandList, userId } = this.props;

        const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
        let contentSizeH = contentSize.height;
        let viewBottomY = contentOffset.y + layoutMeasurement.height;

        if (Math.abs(viewBottomY - contentSizeH) <= 40) {
            dispatch(fetchRecommandList(MeRecommandList.page + 1, userId, this.props.navigator));
        }
    }
    _onRefresh() {
        if (!global.user.authentication_token) {
            Util.noToken(this.props.navigator);
        }
        const { dispatch, userId } = this.props;
        dispatch(fetchRecommandList(1, userId, this.props.navigator));
    }

    render() {
        const { MeRecommandList } = this.props;
        return (
            <View style={styles.container}>
                {!MeRecommandList.isLoading &&
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
                                refreshing={MeRecommandList.isLoading}
                                onRefresh={this._onRefresh}
                                colors={['rgb(217, 51, 58)']}
                            />
                        }
                    >
                        <View style={styles.contentContainer}>
                            <View style={{ flex: 1 }}>
                                {MeRecommandList.recommandList.map((data, index) => {
                                    return (
                                        <TouchableOpacity key={index} style={{flexDirection:'row',alignItems: 'center',margin:6, paddingHorizontal: 12}}>
                                            <Image source={{uri: data.avatar}} style={{width:50, height:50, borderRadius:25}}/>
                                            <Text style={{color:'#000',margin:10,fontSize:16}}>{data.name}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                        {
                            MeRecommandList.isLoadMore ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator />
                                    <Text style={{ fontSize: 14, marginLeft: 5 }}>正在加载更多的数据...</Text>
                                </View>
                            ) : null
                        }
                    </ScrollView>
                }
                <Loading isShow={MeRecommandList.isLoading} />
            </View>
        );
    }
}
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
        backgroundColor: '#f5f5f5'
    },
})


export default connect((state) => {
    const {MeRecommandList} = state;
    return {MeRecommandList}
})(RecommandList);