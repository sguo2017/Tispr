import * as types from '../actions/actionTypes';

const initialState = {
  meOfferList: [],
  isLoading: true,
  isLoadMore: false,
  page: 1,
  canLoadMore: true,
};

let MeOfferListReducer = (state = initialState, { type, payload }) => {

  switch (type) {
    case types.ME_OFFER_FETCHING_LIST: {
      return Object.assign({}, state, {
        isLoadMore: true,
      });
    }
    case types.ME_OFFER_RECEIVE_LIST: {
      return Object.assign({}, state, {
        isLoadMore: false,
        isLoading: false,
        meOfferList: payload.page == 1 ? payload.offerList : state.meOfferList.concat(payload.offerList),
        page: payload.offerList.length > 0 ? payload.page : state.page,
        canLoadMore: payload.offerList.length > 0 ? true : false,
      });
    }
    default:
      return state
  }
}

export default MeOfferListReducer;