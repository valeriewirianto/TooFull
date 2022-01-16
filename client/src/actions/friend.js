import ENV from './../config.js'
const API_HOST = ENV.api_host

//send a friend request
export const send_friend_request = (app, username) => {
    const request = new Request(`${API_HOST}/add_potential_friend`, {
        method: "post",
        body: JSON.stringify({
            "username": username,
        }),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    });
    return fetch(request)
        .then(res => {
            if (res.status === 404) {
                return res.json();
            }
            if (res.status === 200) {
                return res.json();
            }
        })
        .then(json => {
            if (json){
                return json.message
            }
        })
        .catch(error => {
            console.log(error);
        });


}

export const add_existing_friend =  (app,username) => {
    const request = new Request(`${API_HOST}/add_existing_friend`, {
        method: "post",
        body: JSON.stringify({
            "username": username,
        }),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    });

    fetch(request)
        .then(res => {
            if (res.status === 200) {
                return res.json()
            }
        })
        .then(json =>{
            app.setState({ExistingFriendsList : json.existing_friends})
            app.setState({PotentialFriendsList : json.potential_friends})
            app.setState({ExistingFriendsList_id : json.existing_friends_id})
            app.setState({PotentialFriendsList_id : json.potential_friends_id})
        })
        .catch(error => {
            console.log(error);
        });
}

export const delete_existing_friend =  (app,username) => {
    const request = new Request(`${API_HOST}/delete_existing_friend`, {
        method: "delete",
        body: JSON.stringify({
            "username": username,
        }),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    });

    fetch(request)
        .then(res => {
            if (res.status === 200) {
                return res.json()
            }
        })
        .then(json =>{
            app.setState({ExistingFriendsList : json.existing_friends})
            app.setState({PotentialFriendsList : json.potential_friends})
            app.setState({ExistingFriendsList_id : json.existing_friends_id})
            app.setState({PotentialFriendsList_id : json.potential_friends_id})
        })
        .catch(error => {
            console.log(error);
        });
}

export const delete_potential_friend =  (app,username) => {
    const request = new Request(`${API_HOST}/delete_potential_friend`, {
        method: "delete",
        body: JSON.stringify({
            "username": username,
        }),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    });

    fetch(request)
        .then(res => {
            if (res.status === 200) {
                return res.json()
            }
        })
        .then(json =>{
            app.setState({ExistingFriendsList : json.existing_friends})
            app.setState({PotentialFriendsList : json.potential_friends})
            app.setState({ExistingFriendsList_id : json.existing_friends_id})
            app.setState({PotentialFriendsList_id : json.potential_friends_id})
        })
        .catch(error => {
            console.log(error);
        });
}

export const get_friend_list = (app)=>{
    const url = `${API_HOST}/get_a_friend`
    fetch(url)
        .then(res => {
            if (res.status === 200) {
                return res.json()
            }
        })
        .then(json =>{
            app.setState({ExistingFriendsList : json.existing_friends})
            app.setState({PotentialFriendsList : json.potential_friends})
            app.setState({ExistingFriendsList_id : json.existing_friends_id})
            app.setState({PotentialFriendsList_id : json.potential_friends_id})
        })
        .catch(error => {
            console.log(error);
        });

}

export const get_all_username = (app)=>{
    const url = `${API_HOST}/get_all_users`;
    fetch(url)
        .then(res => {
            if (res.status === 200) {
                return res.json()
            }
        })
        .then(json =>{
            app.setState({all_username: json})
        })
        .catch(error => {
            console.log(error);
        });

}



//delete existing friend


//accept potential friend

//reject potential friend



