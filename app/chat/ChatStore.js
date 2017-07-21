import {observable, computed, action, runInAction} from 'mobx'
import Constant from '../common/constants';
import UserDefaults from '../common/UserDefaults';
import Utils from '../common/utils'
export default class ChatStore {
    @observable feedList = []
    @observable errorMsg = ''
    @observable page = 1
    @observable isRefreshing = false
    @observable noResult = false
    constructor(categoryId) {
        this.categoryId = categoryId
        this.fetchFeedList()
    }

    @action
    fetchFeedList = async () => {
        try {
            if (this.isRefreshing) this.page = 1  
            const result = await this._fetchDataFromUrl()
            runInAction(() => {
                this.isRefreshing = false
                this.errorMsg = ''
                if (this.page == 1) {                     
                    this.feedList.replace(result)
                    if(result=='')
                        this.noResult = true;
                } else {                   
                    this.feedList.splice(this.feedList.length, 0, ...result);
                    if(result == ''){
                        this.noResult = true;
                    }
                }
            })
        } catch (error) {
            this.errorMsg = error
        }
    }

    @computed
    get isFetching() {
        return this.feedList.length == 0 && this.errorMsg == '' && !this.noResult
    }

    @computed
    get isLoadMore() {
        return this.page != 1 && !this.noResult
    }

    _fetchDataFromUrl() {
        return new Promise((resolve, reject) => {
            const URL = `http://` + Constant.url.IMG_SERV_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_ORDER_LIST + `${global.user.authentication_token}&scence=${Constant.order_qry_type.PERSONAL}&page=${this.page}`;            
            Utils.get(
                URL, 
                (response) => {
                    resolve(JSON.parse(response.feeds))
                },
                (error) => {
                    reject()
                }
            );           
        })
    }
}