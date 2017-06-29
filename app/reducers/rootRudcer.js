import { combineReducers } from 'redux';
import Search from './searchReducer';
import MeMarkList from './MeMarkListReducer';
import MeOfferList from './MeOfferListReducer';
import ServOfferList from './ServOfferListReducer';

export default rootReducer = combineReducers({
  MeOfferList,
  MeMarkList,
  Search,
  ServOfferList,
});