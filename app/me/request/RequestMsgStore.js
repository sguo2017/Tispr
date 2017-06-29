import {observable, computed, action, runInAction} from 'mobx'
import Constant from '../../common/constants';

export default class FeedStore {
    @observable feedList = [];
    @observable errorMsg = '';
    @observable page = 1;
    @observable isRefreshing = false;
    @observable noResult = false;

    constructor(categoryId, userId) {
        this.categoryId = categoryId;
        this.userId = userId;
        this.fetchFeedList();
    }

    @action
    fetchFeedList = async () => {
        try {
            if (this.isRefreshing) this.page = 1;
            const result = await this._fetchDataFromUrl();
            runInAction(() => {
                this.isRefreshing = false;
                this.errorMsg = '';
                if (this.page == 1) {                     
                    //console.log("26:"+JSON.stringify(result))           
                    this.feedList.replace(result);
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
            this.errorMsg = error;
        }
    }

    @computed
    get isFetching() {
        return this.feedList.length == 0 && this.errorMsg == '' && !this.noResult;
    }

    @computed
    get isLoadMore() {
        return this.page != 1 && !this.noResult;
    }

    _fetchDataFromUrl() {
        return new Promise((resolve, reject) => {
            let URL = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_SERV_OFFER_INDEX + global.user.authentication_token + `&page=${this.page}&user_id=${this.userId}&qry_type=${Constant.serv_qry_type.REQUEST}`;
            fetch(URL, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }).then(response => {
                if (response.status == 200) return response.json();
                return null
            }).then(responseData => {
                if (responseData) {
                    resolve(JSON.parse(responseData.feeds))
                } else {
                    reject('请求出错！')
                }
            }).catch(error => {
                console.log(`Fetch evaluating list error: ${error}`);
                reject('网络出错！')
            })
        })
    }
}