import * as types from '../actions/actionTypes';

const initialState = {
  exploreList: [],
  isLoading: true,
  isLoadMore: false,
  page: 1,
  canLoadMore: true,
};

let servOfferListReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case types.EXPLORE_FETCHING_LIST:
      return Object.assign({}, state, {
        isLoadMore: true,
      });
    case types.EXPLORE_RECEIVE_LIST:
      return Object.assign({}, state, {
        isLoadMore: false,
        isLoading: false,
        exploreList: payload.page == 1 ? payload.exploreList : state.exploreList.concat(payload.exploreList),
        page: payload.exploreList.length > 0 ? payload.page : state.page,
        canLoadMore: payload.exploreList.length > 0 ? true : false,
      });
    default:
      return state
  }
}
export default servOfferListReducer;