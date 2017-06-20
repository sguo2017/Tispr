/**
 * Created by ljunb on 16/5/25.
 * 根reducer
 */
import { combineReducers } from 'redux';
import Search from './searchReducer';
import feedHome from './feed/feedHomeListReducer';
import feedDelicacy from './feed/feedDelicacyListReducer';
import feedEvaluating from './feed/feedEvaluatingListReducer';
import feedKnowledge from './feed/feedKnowledgeListReducer';
import MeMarkList from './MeMarkListReducer';
import MeOfferList from './MeOfferListReducer'

export default rootReducer = combineReducers({
    MeOfferList,
    MeMarkList,
    Search,
    feedHome,
    feedDelicacy,
    feedEvaluating,
    feedKnowledge
})