//const domain = "http://192.168.0.146:5000/"
// environment configutations
import ENV from './../config.js'
const API_HOST = ENV.api_host

export const signupFetch = (signupInfo, app) => {
    const request = new Request(`${API_HOST}/users/signup`, {
        method: "post",
        body: JSON.stringify(signupInfo.state),
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
        .catch(error => {
            console.log(error);
        });
};
