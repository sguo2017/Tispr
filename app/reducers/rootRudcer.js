/**
 * Created by ljunb on 16/5/25.
 * 根reducer
 */
import { combineReducers } from 'redux';
import FoodsList from './foodsListReducer';
import FoodCompare from './foodCompareReducer';
import FoodInfo from './foodInfoReducer';
import Search from './searchReducer';
import feedHome from './feed/feedHomeListReducer';
import feedDelicacy from './feed/feedDelicacyListReducer';
import feedEvaluating from './feed/feedEvaluatingListReducer';
import feedKnowledge from './feed/feedKnowledgeListReducer';
import MeMarkList from './MeMarkListReducer'

export default rootReducer = combineReducers({
    MeMarkList,
    FoodsList,
    FoodCompare,
    FoodInfo,
    Search,
    feedHome,
    feedDelicacy,
    feedEvaluating,
    feedKnowledge
})