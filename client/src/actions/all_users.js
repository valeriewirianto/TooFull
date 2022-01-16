import ENV from '../config.js'
const API_HOST = ENV.api_host

// Get all users
export const get_all_users= (app) => {
    const url = `${API_HOST}/get_all_users`;
    fetch(url)
        .then(res => {
            if (res.status === 200) {
                return res.json()
            }
        })
        .then(json =>{
            app.setState({AllUsers: json})
        })
        .catch(error => {
            console.log(error);
        });
};


export const delete_user = (user) => {
    const request = new Request(`${API_HOST}/delete_user/` + user._id, {
        method: "delete",
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
            
            return "success"
        })
        .catch(error => {
            console.log(error);
        });
}