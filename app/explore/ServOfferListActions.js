import Util from '../common/utils';
import Common from '../common/constants';

export let fetchFeedList = (category, page) => {
    let URL = `http://` + Common.url.IMG_SERV_ADDR + ':' + Common.url.SERV_API_PORT + Common.url.SERV_API_SERV_OFFER_INDEX + `${global.user.authentication_token}&page=1`;  
    return dispatch => {
        dispatch(fetchingFeedList(category, page));
        Util.get(URL, (response) => {
            console.log("response.feeds:"+(JSON.parse(response.feeds)).length)
            dispatch(receiveFeedList(JSON.parse(response.feeds), category, page));
        }, (error) => {
            // console.log('Fetch category list error: ' + error);
            dispatch(receiveFeedList([]));
        });
    }
}

export const FEED_HOME_LIST_FETCH_LIST = 'FEED_HOME_LIST_FETCH_LIST';

let fetchingFeedList = (category, page) => {
    let type = FEED_HOME_LIST_FETCH_LIST;
    return {
        type,
        payload: {page}
    }
}

export const FEED_HOME_LIST_RECEIVE_LIST = 'FEED_HOME_LIST_RECEIVE_LIST';
let receiveFeedList = (feedList, category, page) => {
    let type = FEED_HOME_LIST_RECEIVE_LIST;
    
    return {
        type,
        payload: {feedList, page}
    }
};