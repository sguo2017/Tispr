import * as types from '../actions/actionTypes';

const initialState = {
  exploreList: [],
  isLoading: true,
  isLoadMore: false,
  page: 1,
  canLoadMore: true,
  changeLevel: false,
  qry_level: 1,
  autoLoad:false,
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
        exploreList: payload.page == 1 && payload.qry_level ==1? payload.exploreList : state.exploreList.concat(payload.exploreList),
        page: payload.exploreList.length > 0 ? payload.page : state.page,
        canLoadMore: payload.qry_level != 6 || payload.exploreList.length > 0? true : false,
        changeLevel: payload.exploreList.length < 5 ? true : false,
        qry_level: payload.exploreList.length <5 ? payload.qry_level : state.qry_level,
        autoLoad: true
      });
    default:
      return state
  }
}
export default servOfferListReducer;