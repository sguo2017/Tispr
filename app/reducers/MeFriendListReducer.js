import * as types from '../actions/actionTypes';

const initialState = {
  friendList: [],
  isLoading: true,
  isLoadMore: false,
  page: 1,
  canLoadMore: true,
};

let MeFriendListReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case types.ME_FRIEND_FETCHING_LIST: {
      return Object.assign({}, state, {
        isLoadMore: true,
      });
    }
    case types.ME_FRIEND_RECEIVE_LIST: {
      return Object.assign({}, state, {
        isLoadMore: false,
        isLoading: false,
        friendList: payload.page == 1 ? payload.friendList : state.friendList.concat(payload.friendList),
        page: payload.friendList.length > 0 ? payload.page : state.page,
        canLoadMore: payload.friendList.length > 0 ? true : false,
      });
    }
    default:
      return state;
  }
}
export default MeFriendListReducer;