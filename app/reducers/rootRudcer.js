/**
 * 根reducer
 */
import { combineReducers } from 'redux';
import Search from './searchReducer';
import MeMarkList from './MeMarkListReducer';
import MeOfferList from './MeOfferListReducer'

export default rootReducer = combineReducers({
    MeOfferList,
    MeMarkList,
    Search
})