
export default fetcher = {
    post: (url, data, successCallback, failCallback)=>{ 
        Promise.race([
            post_promise(url, data),
            new Promise(function (resolve, reject) {
                setTimeout(() => reject(new Error('request timeout')), 5000)
            })
        ])
        .then((value) => successCallback(value))
        .catch(error => {console.log(error); failCallback(error)});
    }
}

function post_promise(url, data) {
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
        })
    })
}
