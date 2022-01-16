import React from 'react';
import { Link } from 'react-router-dom';

class Home extends React.Component{
    render(){
        return (
          <div className="Home">
              Home Page
      
              <br/>
              <Link to={'/login'}>
                  <button>Login</button>
              </Link>
          </div>
        );
    }
}

export default Home;
