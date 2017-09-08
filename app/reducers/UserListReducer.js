import * as types from '../actions/actionTypes';

const initialState = {
  userList: [],
  isLoading: true,
  isLoadMore: false,
  page: 1,
  canLoadMore: true,
};

let UserListReducer = (state = initialState, { type, payload }) => {

  switch (type) {
    case types.FRIEND_FETCHING_LIST: {
      return Object.assign({}, state, {
        isLoadMore: true,
      });
    }
    case types.FRIEND_RECEIVE_LIST: {
      return Object.assign({}, state, {
        isLoadMore: false,
        isLoading: false,
        userList: payload.page == 1 ? payload.userList : state.userList.concat(payload.userList),
        page: payload.userList.length > 0 ? payload.page : state.page,
        canLoadMore: payload.userList.length > 0 ? true : false,
      });
    }
    default:
      return state
  }
}

export default UserListReducer;