import ENV from './../config.js'
const API_HOST = ENV.api_host

// Get all list ids and names of currently logged in user
export const get_popular= (app, category) => {
    const url = `${API_HOST}/get_most_popular/` + category;
    fetch(url)
        .then(res => {
            if (res.status === 200) {
                return res.json()
            }
        })
        .then(json =>{
            let labelArray = []
            let dataArray = []

            for(let key in json){ 
                labelArray.push(key)
                dataArray.push(json[key])
            }
            if(category === "dishes"){
                app.setState({ 
                    dish:{
                        labels: labelArray,
                        datasets: [
                        {
                          backgroundColor: 'rgba(75,192,192,1)',
                          borderColor: 'rgba(0,0,0,1)',
                          borderWidth: 2,
                          data: dataArray
                        }
                        ]
                    }
                })
            }
            else if(category === "beverages"){
                app.setState({ 
                    beverage:{
                        labels: labelArray,
                        datasets: [
                        {
                          backgroundColor: 'rgba(75,192,192,1)',
                          borderColor: 'rgba(0,0,0,1)',
                          borderWidth: 2,
                          data: dataArray
                        }
                        ]
                    }
                })
            }
            else if(category === "ingredients"){
                app.setState({ 
                    ingredient:{
                        labels: labelArray,
                        datasets: [
                        {
                          backgroundColor: 'rgba(75,192,192,1)',
                          borderColor: 'rgba(0,0,0,1)',
                          borderWidth: 2,
                          data: dataArray
                        }
                        ]
                    }
                })
            }
        })
        .catch(error => {
            console.log(error);
        });
};