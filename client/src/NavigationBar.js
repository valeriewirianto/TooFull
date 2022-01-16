import React from 'react';
import { Link } from 'react-router-dom';
import { logoutUser } from './actions/session';
import './CSS/NavigationBar.css'

class NavigationBar extends React.Component{

    constructor(props){
        super(props)
    }

    handleLogOut = (app) => {
        if(window.confirm("Are you sure you want to log out?")){
            this.props.history.push('/login')
            logoutUser(app)
        }
    }
    
    render(){
        const { app } = this.props

        return(
            <div className="navigationPanel">
                <h2>TooFull</h2>
                <Link to={'/Main'}>
                    <button className="topButtons">Main Page</button>
                </Link>
                { app.state.admin === "false" ? null : <span>
                        <Link to={'/AllUsers'}>
                            <button className="topButtons">Update User List</button>
                        </Link> 
                        </span>}
                
                <Link to={'/Search'}>
                    <button className="topButtons">Search for Similar Lists</button>
                </Link>
                <Link to={'/Friends'}>
                    <button className="topButtons">Friends</button>
                </Link>
                <Link to={{
                                pathname: './profile',
                                state:{
                                    edit: true,
                                    user: app.state.currentUser
                                }
                                }}
                                ><button className="topButtons">Profile</button></Link>
                <button className="topButtons" type = "button" onClick = {() => this.handleLogOut(app)}> Log out</button>
                
            </div>
        )
    }
}

export default NavigationBar;