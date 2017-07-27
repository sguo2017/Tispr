export default fetchers = {
    post:(url, body = {}, successCallback) => {
        return _fetch(fetch_promise(url, body = {}, successCallback), 60000);
    }
}

function _fetch(fetch_promise, timeout) {
    var abort_fn = null;
    var abort_promise = new Promise((resolve, reject) => {
        abort_fn = function() {
            reject('abort promise');
        };
    });
    var abortable_promise = Promise.race([
        fetch_promise,
        abort_promise
    ]);
    setTimeout(function(){
        abort_fn();
    }, timeout);

    return abortable_promise;
}

function fetch_promise(url, data, successCallback) {
    return new Promise((resolve, reject) => {
        fetch(url,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
            },
            body: JSON.stringify(data)
        }).then((response) => {    
            return response.json();        
        }).then((jsonData) => {
            resolve(jsonData);
        }).catch((err) => {
            reject(err);//这里可以使用resolve(err),将错误信息传回去
            if (err.message === 'Network request failed'){
                console.log('网络出错');
            } else if (err === 'abort promise'){
                console.log('请求超时');
            }
        })
    })
}