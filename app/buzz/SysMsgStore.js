import {observable, computed, action, runInAction} from 'mobx'
import Constant from '../common/constants';
import UserDefaults from '../common/UserDefaults';
import Utils from '../common/utils'
import offline from '../sys/others/offline'
export default class FeedStore {
    @observable feedList = []
    @observable errorMsg = ''
    @observable page = 1
    @observable isRefreshing = false

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
                    //console.log("26:"+JSON.stringify(result))           
                    this.feedList.replace(result) 
                } else {                
                    this.feedList.splice(this.feedList.length, 0, ...result);
                }
            })
        } catch (error) {
            this.errorMsg = error
        }
    }

    @computed
    get isFetching() {
        return this.feedList.length == 0 && this.errorMsg == ''
    }

    @computed
    get isLoadMore() {
        return this.page != 1
    }

    _fetchDataFromUrl() {
       console.log(111);

       return new Promise((resolve, reject) => {
            const URL = `http://` + Constant.url.IMG_SERV_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_SYS_MSG + `${global.user.authentication_token}&page=${this.page}`;               
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