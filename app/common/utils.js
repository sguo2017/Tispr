import breakdown from '../sys/others/breakdown'
let Util = {
    /*
     * fetch简单封装
     * url: 请求的URL
     * successCallback: 请求成功回调
     * failCallback: 请求失败回调
     * 
     * */
    get: (url, successCallback, failCallback, exploreparams) => {
        const URL = url + '&exploreparams=' + JSON.stringify(exploreparams)                   
        fetch(URL, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            })
            .then((response) => response.text())
            .then((responseText) => {
                successCallback(JSON.parse(responseText));
            })
            .catch((err) => {
                failCallback(err);
            });
    },
    
    post: (url, data, successCallback, navigator, exploreparams) => {
        const URL = url + '&exploreparams=' + JSON.stringify(exploreparams)  
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
            navigator.push({component: breakdown});
        });
    }
}

export default Util;