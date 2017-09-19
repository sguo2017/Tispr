import Util from '../common/utils';
import Common from '../common/constants';
import * as types from '../actions/actionTypes';
import breakdown from '../sys/others/breakdown';
import offline from '../sys/others/offline';
export let fetchExploreList = (qry_level, page, exploreparams, navigator) => {
  let URL = `http://` + Common.url.SERV_API_ADDR + ':' + Common.url.SERV_API_PORT + Common.url.SERV_API_SERV_OFFER_INDEX + `${global.user.authentication_token}&page=${page}&qry_level=${qry_level}&qry_type=${Common.serv_qry_type.OFFER}`;
  return dispatch => {
    dispatch({ type: types.EXPLORE_FETCHING_LIST, payload: {page, qry_level} });
    Util.get(URL, (response) => {
      // console.log("response.feeds:"+(JSON.parse(response.feeds)).length);
      dispatch(receiveExploreList(JSON.parse(response.feeds), page, qry_level));
    }, (error) => {
      if(error.message == 'Network request failed'){
          navigator.push({component: offline})
      }else{
          navigator.push({component: breakdown})
      }
      // console.log('Fetch category list error: ' + error);
    }, exploreparams);
  }
}

let receiveExploreList = (exploreList, page, qry_level) => {
  let type = types.EXPLORE_RECEIVE_LIST;
  return {
    type,
    payload: {exploreList, page, qry_level}
  }
};