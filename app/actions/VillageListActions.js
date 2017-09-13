import Util from '../common/utils';
import Common from '../common/constants';
import * as types from '../actions/actionTypes';
import breakdown from '../sys/others/breakdown';
import offline from '../sys/others/offline';
export let fetchVillageList = (page, exploreparams,qry_type, navigator) => {
  let URL = `http://` + Common.url.SERV_API_ADDR + ':' + Common.url.SERV_API_PORT + Common.url.SERV_API_VILLAGE_SEARCH + '?token='+global.user.authentication_token+'&qry_type='+qry_type+'&page='+page;
  return dispatch => {
    dispatch({ type: types.VILLAGE_FETCHING_LIST, payload: {page} });
    Util.get(URL, (response) => {
      dispatch(receiveVillageList(response.feeds, page));
    }, (error) => {
      if(error.message == 'Network request failed'){
          navigator.push({component: offline})
      }else{
          // navigator.push({component: breakdown})
      }
      // console.log('Fetch category list error: ' + error);
    }, exploreparams);
  }
}

let receiveVillageList = (villageList, page) => {
  let type = types.VILLAGE_RECEIVE_LIST;
  return {
    type,
    payload: {villageList, page}
  }
};