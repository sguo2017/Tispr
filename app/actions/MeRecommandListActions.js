import Util from '../common/utils';
import Common from '../common/constants';
import * as types from '../actions/actionTypes';
import breakdown from '../sys/others/breakdown';
import offline from '../sys/others/offline';
export let fetchRecommandList = (page, userId, navigator) => {
  let URL = 'http://' + Common.url.SERV_API_ADDR + ':' + Common.url.SERV_API_PORT + Common.url.SERV_API_FRIENDS_LIST+'?user_id='+ userId +'&qry_type=3&page='+page+'&token='+global.user.authentication_token;
  return dispatch => {
    dispatch({ type: types.ME_RECOMMAND_FETCHING_LIST });
    Util.get(URL, (response) => {
      dispatch(receiveRecommandList(JSON.parse(response.feeds), page));
    }, (error) => {
      if(error.message == 'Network request failed'){
          navigator.push({component: offline})
      }else{
          navigator.push({component: breakdown})
      }
    },{});
  }
}

let receiveRecommandList = (recommandList, page) => {
  const type = types.ME_RECOMMAND_RECEIVE_LIST;
  return {
    type,
    payload: {recommandList, page}
  }
};