import React from 'react';
import { Link } from 'react-router-dom';

class Logout extends React.Component{
    render(){
        return(
            <div>Logged out!

                <Link to ='/login'> Go to Login Page</Link>
            </div>

        )

    }

}

export default Logout;