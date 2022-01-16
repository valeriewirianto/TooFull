import ENV from './../config.js'
const API_HOST = ENV.api_host

// Get all list ids and names of currently logged in user
export const get_all_lists= (app) => {
    const url = `${API_HOST}/get_all_lists`;
    fetch(url)
        .then(res => {
            if (res.status === 200) {
                return res.json()
            }
        })
        .then(json =>{
            app.setState({lists: json})
        })
        .catch(error => {
            app.setState({lists: []})
            console.log(error);
        });
};

// Post a new list of the current user to the DB
export const create_list = (appList, listName, category, listDescription, permissions) => {
    const request = new Request(`${API_HOST}/create_list`, {
        method: "post",
        body: JSON.stringify({"listName": listName,
        "category": category,
        "listDescription": listDescription,
        "permissions": permissions
        }),
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
            const newList = appList.state.lists.push({"id": json._id, "listName": json.listName})
            appList.setState({
                list: newList
            })
            return "success"
        })
        .catch(error => {
            console.log(error);
        });
}

export const get_all_items = (app, listId) => {
    const url = `${API_HOST}/get_a_list/` +  listId;
    fetch(url)
        .then(res => {
            if (res.status === 200) {
                return res.json()
            }
        })
        .then(json =>{
            app.setState({
                ListName: json.listName,
                ListDescription: json.listDescription,
                Category: json.category,
                FoodRank: json.items
            })
        })
        .catch(error => {
            console.log(error);
        });
}

// adds a new item to a list, does not update ranks of other items
export const add_item = (app, popUpState, listId) => {
    const url = `${API_HOST}/add_item/` + listId;

    const request = new Request(url, {
        method: "post",
        body: JSON.stringify({
            "rank": popUpState.rank,
            "foodName": popUpState.foodName,
            "notes": popUpState.notes
        }),
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
              app.setState({
              FoodRank: json.items.sort(function(a, b){return a.rank-b.rank})
        })
        return "success"
    })
    .catch(error => {
        console.log(error);
    });
}


// modify multiple items in a list, used for when an item is added and ranks of other items must be modified
export const modify_multiple_items = (app, newItemList, listId) => {
    const url = `${API_HOST}/modify_item/` + listId;
    console.log(url)
    console.log(newItemList)

    let newList;

    newItemList.map(item => {
        console.log(item._id)
            const request = new Request(url, {
                method: "post",
                body: JSON.stringify({
                    "rank": item.rank,
                    "foodName": item.foodName,
                    "notes": item.notes,
                    "item_id": item._id
                }),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            });
        
            fetch(request)
            .then(res => {
                if (res.status === 200) {
                     return res.json();
                }
            })
            .then(json => {
                console.log(json.items)
                newList = json.items
                // app.setState({
                //     FoodRank: newList
                // })
            })
            .catch(error => {
                console.log(error);
            });

    })
}

export const delete_list = (listId) => {
    const request = new Request(`${API_HOST}/delete_list/` + listId, {
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

export const update_list_description = (listId, newDescription) => {
    const request = new Request(`${API_HOST}/edit_description/` + listId, {
        method: "post",
        body: JSON.stringify({ listDescription: newDescription}),
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

export const delete_item = (listId, itemId) => {
    const request = new Request(`${API_HOST}/delete_item/` + listId + '/' + itemId, {
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

export const edit_item = (app, listId, itemId, newName, newDescription) => {
    const request = new Request(`${API_HOST}/modify_item/` + listId + '/' + itemId, {
        method: "post",
        body: JSON.stringify({ foodName: newName, notes: newDescription}),
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
            app.setState({FoodRank: json.items})
            return "success"
        })
        .catch(error => {
            console.log(error);
        });
}