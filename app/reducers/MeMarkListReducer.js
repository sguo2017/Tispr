import * as types from '../actions/actionTypes';

const initialState = {
  markList: [],
  isLoading: true,
  isLoadMore: false,
  page: 1,
  canLoadMore: true,
};

let MeMarkListReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case types.ME_BOOK_MARK_FETCHING_LIST: {
      return Object.assign({}, state, {
        isLoadMore: true,
      });
    }
    case types.ME_BOOK_MARK_RECEIVE_LIST: {
      return Object.assign({}, state, {
        isLoadMore: false,
        isLoading: false,
        markList: payload.page == 1 ? payload.markList : state.markList.concat(payload.markList),
        page: payload.markList.length > 0 ? payload.page : state.page,
        canLoadMore: payload.markList.length > 0 ? true : false,
      });
    }
    default:
      return state;
  }
}
export default MeMarkListReducer;