import { combineReducers } from 'redux';
import MeMarkList from './MeMarkListReducer';
import MeOfferList from './MeOfferListReducer';
import ServOfferList from './ServOfferListReducer';
import UserList from './UserListReducer';
import MeFriendList from './MeFriendListReducer';

export default rootReducer = combineReducers({
  MeOfferList,
  MeMarkList,
  ServOfferList,
  UserList,
  MeFriendList,
});