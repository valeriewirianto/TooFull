import ENV from './../config.js'
const API_HOST = ENV.api_host

// Get all list ids and names of currently logged in user
export const search_by_food= (app, food) => {
    console.log(app)
    const url = `${API_HOST}/get_lists_food/` + food;
    fetch(url)
        .then(res => {
            if (res.status === 200) {
                return res.json()
            }
        })
        .then(json =>{
            console.log(json)
            app.setState({list: json})
        })
        .catch(error => {
            console.log(error);
        });
};

export const search_by_name= (app, name) => {
    console.log(app)
    const url = `${API_HOST}/get_lists_name/` + name;
    fetch(url)
        .then(res => {
            if (res.status === 200) {
                return res.json()
            }
        })
        .then(json =>{
            app.setState({list: json})
        })
        .catch(error => {
            console.log(error);
        });
};
