import ENV from './../config.js'
const API_HOST = ENV.api_host

// get profile information by user id
export const get_user_profile_info = (app, userid) => {
    const url = `${API_HOST}/get_user_info/` +  userid;
    fetch(url)
        .then(res => {
            if (res.status === 200) {
                return res.json()
            }
        })
        .then(json =>{
            app.setState({ info: json })
        })
        .catch(error => {
            console.log(error);
        });
}

// change profile information by user id
export const change_profile_info= (app, newInfo, userid) => {
    const request = new Request(`${API_HOST}/change_user_info/` + userid, {
        method: "post",
        body: JSON.stringify(newInfo),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    });

    return fetch(request)
        .then(res => {
            if (res.status === 200) {
                return res.json();
            }
        })
        .then(json => {
            app.setState({ info: json})
            return "success"
        })
        .catch(error => {
            console.log(error);
        });
}