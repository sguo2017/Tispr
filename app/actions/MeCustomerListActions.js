import Util from '../common/utils';
import Common from '../common/constants';
import * as types from '../actions/actionTypes';
import breakdown from '../sys/others/breakdown';
import offline from '../sys/others/offline';
export let fetchCustomerList = (page, navigator) => {
  let URL = 'http://' + Common.url.SERV_API_ADDR + ':' + Common.url.SERV_API_PORT + Common.url.SERV_API_FRIENDS_LIST+'?user_id='+global.user.id +'&qry_type=3&page='+page+'&token='+global.user.authentication_token;
  return dispatch => {
    dispatch({ type: types.ME_CUSTOMER_FETCHING_LIST });
    Util.get(URL, (response) => {
      dispatch(receiveCustomerList(JSON.parse(response.feeds), page));
    }, (error) => {
      if(error.message == 'Network request failed'){
          navigator.push({component: offline})
      }else{
          navigator.push({component: breakdown})
          console.log("客户请求"+error)
      }
    },{});
  }
}

let receiveCustomerList = (customerList, page) => {
  const type = types.ME_CUSTOMER_RECEIVE_LIST;
  return {
    type,
    payload: {customerList, page}
  }
};