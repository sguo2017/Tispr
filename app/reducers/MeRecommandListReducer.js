import * as types from '../actions/actionTypes';

const initialState = {
  recommandList: [],
  isLoading: true,
  isLoadMore: false,
  page: 1,
  canLoadMore: true,
};

let MeRecommandListReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case types.ME_RECOMMAND_FETCHING_LIST: {
      return Object.assign({}, state, {
        isLoadMore: true,
      });
    }
    case types.ME_RECOMMAND_RECEIVE_LIST: {
      return Object.assign({}, state, {
        isLoadMore: false,
        isLoading: false,
        recommandList: payload.page == 1 ? payload.recommandList : state.recommandList.concat(payload.recommandList),
        page: payload.recommandList.length > 0 ? payload.page : state.page,
        canLoadMore: payload.recommandList.length > 0 ? true : false,
      });
    }
    default:
      return state;
  }
}
export default MeRecommandListReducer;