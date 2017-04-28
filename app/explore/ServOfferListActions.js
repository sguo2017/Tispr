import Util from '../common/utils';
import Common from '../common/constants';

export let fetchFeedList = (category, page) => {
    let URL;
    switch(category){        
        case 0:
        URL = `http://` + Common.url.SERV_API_ADDR + ':' + Common.url.SERV_API_PORT + Common.url.SERV_API_SERV_OFFER_INDEX + `${global.user.authentication_token}&page=${page}`;  
        break;
        case 1:
        URL = `http://` + Common.url.SERV_API_ADDR + ':' + Common.url.SERV_API_PORT + Common.url.SERV_API_SERV_OFFER_INDEX + `${global.user.authentication_token}&page=${page}&user_id=${global.user.id}`;  
        break;
         case 2:
        URL = `http://` + Common.url.SERV_API_ADDR + ':' + Common.url.SERV_API_PORT + Common.url.SERV_API_SERV_OFFER_INDEX + `${global.user.authentication_token}&page=${page}&user_id=${global.user.id}&serv_catagory=serv_request`;  
        break;
        case 3:
        URL = `http://`+ Common.url.SERV_API_ADDR + ':'+ Common.url.SERV_API_PORT+Common.url.SERV_API_SERV_OFFER_MARKS+global.user.authentication_token;
        break;
    }
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
export const ME_BOOK_MARK_FETCH_LIST = 'ME_BOOK_MARK_FETCH_LIST';
export const ME_OFFER_FETCH_LIST = 'ME_OFFER_FETCH_LIST';

let fetchingFeedList = (category, page) => {
    let type ;
    switch (category) {
        case 0:
            type = FEED_HOME_LIST_FETCH_LIST;
            break;
        case 1:
            type = ME_OFFER_FETCH_LIST;
            break;
        case 2:
            type = FEED_HOME_LIST_FETCH_LIST;
            break;
        case 3:
            type = ME_BOOK_MARK_FETCH_LIST;
            break;
    }
   // type = FEED_HOME_LIST_FETCH_LIST;
    return {
        type,
        payload: {page}
    }
}

export const FEED_HOME_LIST_RECEIVE_LIST = 'FEED_HOME_LIST_RECEIVE_LIST';
export const ME_BOOK_MARK_RECEIVE_LIST = 'ME_BOOK_MARK_RECEIVE_LIST';
export const ME_OFFER_RECEIVE_LIST = 'ME_OFFER_RECEIVE_LIST';
let receiveFeedList = (feedList, category, page) => {
    let type ;
    switch (category) {
        case 0:
            type = FEED_HOME_LIST_RECEIVE_LIST;
            break;
        case 1:
            type = ME_OFFER_RECEIVE_LIST;
            break;
        case 2:
            type = FEED_HOME_LIST_RECEIVE_LIST;
            break;
        case 3:
            type = ME_BOOK_MARK_RECEIVE_LIST;
            break;
    }
    
            //type = FEED_HOME_LIST_RECEIVE_LIST;
    return {
        type,
        payload: {feedList,page}
    }
};