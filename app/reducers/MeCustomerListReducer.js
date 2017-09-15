import * as types from '../actions/actionTypes';

const initialState = {
  customerList: [],
  isLoading: true,
  isLoadMore: false,
  page: 1,
  canLoadMore: true,
};

let MeCustomerListReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case types.ME_CUSTOMER_FETCHING_LIST: {
      return Object.assign({}, state, {
        isLoadMore: true,
      });
    }
    case types.ME_CUSTOMER_RECEIVE_LIST: {
      return Object.assign({}, state, {
        isLoadMore: false,
        isLoading: false,
        customerList: payload.page == 1 ? payload.customerList : state.customerList.concat(payload.customerList),
        page: payload.customerList.length > 0 ? payload.page : state.page,
        canLoadMore: payload.customerList.length > 0 ? true : false,
      });
    }
    default:
      return state;
  }
}
export default MeCustomerListReducer;