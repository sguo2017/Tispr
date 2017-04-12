/**
 * Created by ljunb on 16/5/26.
 */
import * as types from './actionTypes';
import Util from '../common/utils';
import Common from '../common/constants';

export let fetchFeedList = (category, page) => {
    let URL = `http://` + Common.url.IMG_SERV_ADDR + ':' + Common.url.SERV_API_PORT + Common.url.SERV_API_SERV_OFFER_INDEX + `Wy4PnM5-ZsPXx1sPr9FK` + `&page=1`;  
    return dispatch => {
        dispatch(fetchingFeedList(category, page));
        console.log("fetchFeedList:"+URL)
        Util.get(URL, (response) => {
            console.log("response.feeds:"+(JSON.parse(response.feeds)).length)
            dispatch(receiveFeedList(JSON.parse(response.feeds), category, page));
        }, (error) => {
            // console.log('Fetch category list error: ' + error);
            dispatch(receiveFeedList([]));
        });
    }
}

let fetchingFeedList = (category, page) => {
    let type = types.FEED_HOME_LIST_FETCH_LIST;
    return {
        type,
        payload: {page}
    }
}

let receiveFeedList = (feedList, category, page) => {
    let type = types.FEED_HOME_LIST_RECEIVE_LIST;
    
    return {
        type,
        payload: {feedList, page}
    }
};