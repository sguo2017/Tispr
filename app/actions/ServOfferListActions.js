import Util from '../common/utils';
import Common from '../common/constants';
import * as types from '../actions/actionTypes';

export let fetchExploreList = (page, exploreparams) => {
  let URL = `http://` + Common.url.SERV_API_ADDR + ':' + Common.url.SERV_API_PORT + Common.url.SERV_API_SERV_OFFER_INDEX + `${global.user.authentication_token}&page=${page}&qry_type=${Common.serv_qry_type.OFFER}`;
  return dispatch => {
    dispatch({ type: types.EXPLORE_FETCHING_LIST, payload: {page} });
    Util.get(URL, (response) => {
      // console.log("response.feeds:"+(JSON.parse(response.feeds)).length);
      dispatch(receiveExploreList(JSON.parse(response.feeds), page));
    }, (error) => {
      // console.log('Fetch category list error: ' + error);
      dispatch(receiveExploreList([], page));
    }, exploreparams);
  }
}

let receiveExploreList = (exploreList, page) => {
  let type = types.EXPLORE_RECEIVE_LIST;
  return {
    type,
    payload: {exploreList, page}
  }
};