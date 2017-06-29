import Util from '../common/utils';
import Common from '../common/constants';
import * as types from '../actions/actionTypes';

export let fetchMarkList = (page) => {
  let URL = `http://`+ Common.url.SERV_API_ADDR + ':'+ Common.url.SERV_API_PORT+Common.url.SERV_API_SERV_OFFER_MARKS+`${global.user.authentication_token}&page=${page}`;
  return dispatch => {
    dispatch({ type: types.ME_BOOK_MARK_FETCHING_LIST });
    Util.get(URL, (response) => {
      dispatch(receiveOfferList(JSON.parse(response.feeds), page));
    }, (error) => {
      dispatch(receiveOfferList([], page));
    },{});
  }
}

let receiveOfferList = (markList, page) => {
  const type = types.ME_BOOK_MARK_RECEIVE_LIST;
  return {
    type,
    payload: {markList, page}
  }
};