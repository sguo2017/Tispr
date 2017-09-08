import Util from '../common/utils';
import Common from '../common/constants';
import * as types from '../actions/actionTypes';
import breakdown from '../sys/others/breakdown';
import offline from '../sys/others/offline';
export let fetchFriendList = (page, exploreparams, navigator) => {
  let URL = `http://` + Common.url.SERV_API_ADDR + ':' + Common.url.SERV_API_PORT + Common.url.SERV_API_FRIEND_SEARCH + '?token='+global.user.authentication_token+'&page='+page;
  return dispatch => {
    dispatch({ type: types.FRIEND_FETCHING_LIST, payload: {page} });
    Util.get(URL, (response) => {
       console.log("response.feeds:"+response.feeds);
      dispatch(receiveFriendList(response.feeds, page));
    }, (error) => {
      if(error.message == 'Network request failed'){
          navigator.push({component: offline})
      }else{
        console.log("17好友:"+error)
          // navigator.push({component: breakdown})
      }
      // console.log('Fetch category list error: ' + error);
    }, exploreparams);
  }
}

let receiveFriendList = (userList, page) => {
  let type = types.FRIEND_RECEIVE_LIST;
  return {
    type,
    payload: {userList, page}
  }
};