// environment configutations
import ENV from './../config.js'
const API_HOST = ENV.api_host

// Send a request to check if a user is logged in through the session cookie
export const checkSession = (app) => {
    const url = `${API_HOST}/users/check-session`;

    if (!ENV.use_frontend_test_user) {
        fetch(url)
        .then(res => {
            if (res.status === 200) {
                return res.json();
            }
        })
        .then(json => {
            if (json && json.currentUser) {
                app.setState({ currentUser: json.currentUser, admin: json.admin});
            }
        })
        .catch(error => {
            console.log(error);
        });
    } else {
        app.setState({ currentUser: ENV.user });
    }
    
};

// A function to send a POST request with the user to be logged in
export const login = (loginComp, app) => {
    const request = new Request(`${API_HOST}/users/login`, {
        method: "post",
        body: JSON.stringify(loginComp.state),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    });

    return fetch(request)
        .then(res => {
            console.log(res)
            if (res.status === 200) {
                return res.json();
            }
        })
        .then(json => {
            if (json && json.currentUser) {
                app.setState({ currentUser: json.currentUser, admin: json.admin });
                loginComp.setState({ loggedIn: 1 })
                return "success"
            }
        })
        .catch(error => {
            console.log(error)
        });
};



// Log out user and destroy session
export const logoutUser = (app) => {
    const url = `${API_HOST}/users/logout`;
        return fetch(url)
        .then(res => {
            app.setState({
                currentUser: null,
                admin: "false"
            })
        })
        .catch(error => {
            console.log(error);
        });
    
    
};