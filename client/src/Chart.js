import React from 'react';
import {Bar} from 'react-chartjs-2';
import { get_popular } from './actions/popular';


class Chart extends React.Component {
  constructor(props){  
    super(props);
  }

  state = {
    options: {
      plugins:{   
         legend: {
           display: false
                 }
      },     
    },
    dish: {
      labels: [],
      datasets: [
      {
        label: 'Top 3 Popular Dishes',
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2,
        data: []
      }
      ]
    },
    beverage: {
      labels: [],
      datasets: [
      {
        label: 'Top 3 Popular Beverages',
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2,
        data: []
      }
      ]
    },
    ingredient: {
      labels: [],
      datasets: [
      {
        label: 'Top 3 Popular Ingredients',
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2,
        data: []
      }
      ]
    }
  };
  
  componentDidMount = () => {
    /*
      Make GET request to obtain information for top three most popular foods 
      by category. Will store in this state. 
    */
      get_popular(this, "dishes")
      get_popular(this, "beverages")
      get_popular(this, "ingredients")
      
  }

  render() {
    const { option } = this.props;
    const titleEnding = (option === "dish") ? 'es' : 's'
    
    return (
      <div>
        <Bar
          data={this.state[option]}
          options={{
            scales: {
              y: {
                title: {
                  display: true,
                  text: 'Frequency Across All Lists',
                  font: {
                    size: 15
                  }
                }
                }
              }, 
            plugins: {
              title:{
                display:true,
                text:'Top 3 Most Popular ' + option.charAt(0).toUpperCase() + option.slice(1) + titleEnding + " of All Users",
                font: {
                  size: 20
                }
              },
              legend: {
                display: false,
              },
          },
          }}
        />
      </div>
    );
  }
}
export default Chart;