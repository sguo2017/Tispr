import breakdown from '../sys/others/breakdown'
import offline from '../sys/others/offline'
import Constant from './constants'
let Util = {
    /*
     * fetch简单封装
     * url: 请求的URL
     * successCallback: 请求成功回调
     * failCallback: 请求失败回调
     * 
     * */
    get: (url, successCallback, failCallback, exploreparams) => {
        let URL = url;
        if(exploreparams){
            URL = URL + '&exploreparams=' + JSON.stringify(exploreparams)   
        }          
        fetch(URL, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            })
            .then((response) => response.text())
            .then((responseText) => {
                let result = JSON.parse(responseText)
                if(result.status == Constant.error_type.USER_IS_NIL){
                    console.log("token失效了")
                    global.user = {};
                    global.user.addressComponent = {}
                    failCallback();
                }else{
                    successCallback(result);
                }  
            })
            .catch((err) => {
                if(failCallback) failCallback(err);
                //navigator.push({component: breakdown});
               
            });
    },
    
    post: (url, data, successCallback, navigator, exploreparams) => {
        let URL = url;
        if(exploreparams){
            URL = URL + '&exploreparams=' + JSON.stringify(exploreparams)   
        }  
        fetch(URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then((response) => response.text())
        .then((responseText) => {
            successCallback(JSON.parse(responseText));
        })
        .catch((err) => {
            if(err.message == 'Network request failed'){
                navigator.push({component: offline})
            }else{
                navigator.push({component: breakdown})
            }
        });
    },
    patch: (url, data, successCallback, navigator, exploreparams) => {
        let URL = url;
        if(exploreparams){
            URL = URL + '&exploreparams=' + JSON.stringify(exploreparams)   
        }  
        fetch(URL, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then((response) => response.text())
        .then((responseText) => {
            successCallback(JSON.parse(responseText));
        })
        .catch((err) => {
            navigator.push({component: breakdown});
        });
    },
    noToken: (navigator) => {
        navigator.push({component: offline});
    }
}

export default Util;