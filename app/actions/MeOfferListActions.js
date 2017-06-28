import Util from '../common/utils';
import Common from '../common/constants';
import * as types from '../actions/actionTypes';

export let fetchOfferList = (page, userId) => {
  let URL = `http://` + Common.url.SERV_API_ADDR + ':' + Common.url.SERV_API_PORT + Common.url.SERV_API_SERV_OFFER_INDEX + `${global.user.authentication_token}&page=${page}&user_id=${userId}&qry_type=${Common.serv_qry_type.OFFER}`;
  return dispatch => {
    dispatch({ type: types.ME_OFFER_FETCHING_LIST });
    Util.get(URL, (response) => {
      dispatch(receiveOfferList(JSON.parse(response.feeds), page));
    }, (error) => {
      dispatch(receiveOfferList([], page));
    },{});
  }
}

let receiveOfferList = (offerList, page) => {
  const type = types.ME_OFFER_RECEIVE_LIST;
  return {
    type,
    payload: {offerList, page}
  }
};