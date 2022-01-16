import React from 'react';
import { Route, Switch, BrowserRouter} from 'react-router-dom'
import './App.css';
import Home from './Home'
import Login from './Login'
import Signup from './Signup'
import IndividualList from "./IndividualList"
import Friends from './Friends'
import AllUsers from "./AllUsers";
import Setting from "./Setting";
import Main from "./Main"
import Search from "./Search"
import Profile from "./profile"
import Logout from "./Logout"

import { checkSession } from "./actions/session";

class App extends React.Component{

  componentDidMount() {
    checkSession(this); // sees if a user is logged in
  }
  
  // global state passed down includes the current logged in user and if they are an admin
  state = {
    currentUser: null,
    admin: 'false'
  }

  render(){
    const { currentUser, admin } = this.state;
    return (
      <BrowserRouter>
        <Switch>
    
            <Route
                    exact path={["/setting"] /* any of these URLs are accepted. */ }
                    render={ props => (
                        <div className="app">
                            { /* Different componenets rendered depending on if someone is logged in. */}
                            {!currentUser ? <Login {...props} app={this} /> : <Setting {...props} app={this} />}
                        </div>                   // ... spread operator - provides all of the props in the props object
                            
                    )}
            />

            <Route
                    exact path={["/logout"] /* any of these URLs are accepted. */ }
                    render={ props => (
                        <div className="app">
                            <Logout {...props} app={this} /> 
                        </div>                   
                            
                    )}
            />
            <Route
                    exact path={["/friends"] /* any of these URLs are accepted. */ }
                    render={ props => (
                        <div className="app">
                            { /* Different componenets rendered depending on if someone is logged in. */}
                            {!currentUser ? <Login {...props} app={this} /> : <Friends {...props} app={this} />}
                        </div>                   // ... spread operator - provides all of the props in the props object
                            
                    )}
            />

            <Route
                    exact path={["/main", '/login', '/mainAdmin', '/'] /* any of these URLs are accepted. */ }
                    render={ props => (
                        <div className="app">
                            {!currentUser ? <Login {...props} app={this} /> : <Main {...props} app={this}/>}
                        </div>                   
                            
                    )}
            />

            <Route
                    exact path={["/individualList"] /* any of these URLs are accepted. */ }
                    render={ props => (
                        <div className="app">
                            { /* Different componenets rendered depending on if someone is logged in. */}
                            {!currentUser ? <Login {...props} app={this} /> : <IndividualList {...props} app={this} />}
                        </div>                   // ... spread operator - provides all of the props in the props object
                            
                    )}
            />
            <Route
                    exact path={["/allUsers"] /* any of these URLs are accepted. */ }
                    render={ props => (
                        <div className="app">
                            { /* Different componenets rendered depending on if someone is logged in. */}
                            {(!currentUser || ! admin) ? <Login {...props} app={this} /> : <AllUsers {...props} app={this} />}
                        </div>                   // ... spread operator - provides all of the props in the props object
                            
                    )}
            />

            <Route
                    exact path={["/search"] /* any of these URLs are accepted. */ }
                    render={ props => (
                        <div className="app">
                            { /* Different componenets rendered depending on if someone is logged in. */}
                            {!currentUser ? <Login {...props} app={this} /> : <Search {...props} app={this} />}
                        </div>                   // ... spread operator - provides all of the props in the props object
                            
                    )}
            />
            <Route
                    exact path={["/profile"] /* any of these URLs are accepted. */ }
                    render={ props => (
                        <div className="app">
                            { /* Different componenets rendered depending on if someone is logged in. */}
                            {!currentUser ? <Login {...props} app={this} /> : <Profile {...props} app={this} />}
                        </div>                   // ... spread operator - provides all of the props in the props object
                            
                    )}
            />        
        </Switch>
      </BrowserRouter>
    )
  }
}

export default App;
