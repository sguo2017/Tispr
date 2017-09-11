import * as types from '../actions/actionTypes';

const initialState = {
  villageList: [],
  isLoading: true,
  isLoadMore: false,
  page: 1,
  canLoadMore: true,
};

let VillageListReducer = (state = initialState, { type, payload }) => {

  switch (type) {
    case types.VILLAGE_FETCHING_LIST: {
      return Object.assign({}, state, {
        isLoadMore: true,
      });
    }
    case types.VILLAGE_RECEIVE_LIST: {
      return Object.assign({}, state, {
        isLoadMore: false,
        isLoading: false,
        villageList: payload.page == 1 ? payload.villageList : state.villageList.concat(payload.villageList),
        page: payload.villageList.length > 0 ? payload.page : state.page,
        canLoadMore: payload.villageList.length > 0 ? true : false,
      });
    }
    default:
      return state
  }
}

export default VillageListReducer;