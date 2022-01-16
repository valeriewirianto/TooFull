import React from 'react';
import './CSS/Login.css';
import { Redirect } from 'react-router'
import { signupFetch } from './actions/auth';
import { login } from './actions/session'

class Login extends React.Component {

    render(){
        const { history, app } = this.props;
        return(
            <div className="backgroundColor">
                <div className="page">
                    <Panel history={history} app={app}/>
                </div>
            </div>
        );
    }
}

class Panel extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            hasAccount: true,
        };
    }

    renderForm(){
        const { history, app } = this.props;
        return(
            this.state.hasAccount 
              ? <LoginForm history={history} app={app} handleClick={() => this.handleClick()} /> 
              : <SignUpForm handleClick={() => this.handleClick()} />
        );
    }

    handleClick(){
        this.setState({hasAccount: !this.state.hasAccount});
    }

    render(){
        return(
        <div className="panel">
            <div className="Header"></div>
            <div className="loginForm">
                    {this.renderForm()}
            </div>
        </div>
        );
    }
}

class LoginForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            usernameInput: "",
            passwordInput: "",
            loggedIn: 0,
        };

        this.handleChange = this.handleChange.bind(this);
    }
    
    handleChange(event){
        this.setState({[event.target.name]: event.target.value});
    }

    handleLogin = (app) => {
        login(this, app)
        .then(res => {
            console.log(res)
            if(!res){
                alert("Invalid username and password")
            }
        })
    }

    render(){
        const { app } = this.props
        if(this.state.loggedIn === 1) {
            return <Redirect to="/Main" />
        }else if(this.state.loggedIn === 2){
            return <Redirect to="/MainAdmin" />
        }
        return(
            <div>
                <form>
                    <input type="text" name="usernameInput" className="input" 
                    value={this.state.usernameInput} onChange={this.handleChange} 
                    placeholder="Username" />
                    <br/>

                    <input type="password" name="passwordInput" className="input" 
                    value={this.state.passwordInput} onChange={this.handleChange} 
                    placeholder="Password" />
                    <br/>

                    <input className="submitButton" type="button" value="Log In" onClick={() => this.handleLogin(app)}/>
                </form>

                <div className="backLogIn"> <SignUpBar handleClick={() => this.props.handleClick}/> </div>
            </div>
        );
    }
}

class SignUpBar extends React.Component{
    render(){
        return(
            <label className="back"> Don't have an account? 
                <button className="backLogInButtons" onClick={this.props.handleClick()}> 
                Sign Up! </button>
            </label>
        );
    }
}

class SignUpForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            usernameInput: "",
            passwordInput: "",
            confirmedpasswordInput:"",
            validFormat: true,
            validConfirmedPw: true,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event){
        this.setState({[event.target.name]: event.target.value});
    }

    handleSubmit(event){
        event.preventDefault()
        if(!this.validateAccount.call(this)) return false;
        signupFetch(this, event.target).then(res => {
            console.log(res)
            if (res === "taken"){
                alert("Username taken. Please choose a different one.")
            }
            else{
                alert("Account created!")
            }
        })
    }

    validateAccount(){
        if (!this.validateInput(this.state.usernameInput, this.state.passwordInput)){
            this.setState({validFormat: false});
        } else if (this.state.passwordInput !== this.state.confirmedpasswordInput){
            this.setState({validConfirmedPw: false});
        } else {
            this.setState({validFormat: true, validConfirmedPw: true});
            return true;
        }
        return false;
    }

    validateInput(username, pw){
        return /\w{3,80}/.test(username) && /.{3,80}/.test(pw);
    }

    render(){
        const formatPrompt = !this.state.validFormat
            ? <label> Username can only contain letters, numbers, or underscore.
                    Username and password must have at least 3 characters.
              </label> 
            : !this.state.validConfirmedPw
                ? <label> Passwords do not match. </label> : null;

        return(
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" name="usernameInput" className="input" 
                    value={this.state.usernameInput} onChange={this.handleChange} 
                    placeholder="Username" />
                    <br/>

                    <input type="password" name="passwordInput" className="input" 
                    value={this.state.passwordInput} onChange={this.handleChange} 
                    placeholder="Password" />
                    <br/>

                    <input type="password" name="confirmedpasswordInput" className="input" 
                    value={this.state.confirmedpasswordInput} onChange={this.handleChange} 
                    placeholder="Confirm Password" />
                    <br/>

                    <input className="submitButton" type="submit" value="Sign Up"/>
                </form>

                <div> {formatPrompt} </div>

                <div className="backLogIn"> <LogInBar handleClick={() => this.props.handleClick()}/> </div>
            </div>
        );
    }
}

class LogInBar extends React.Component{
    render(){
        return(
            <label className="back"> Already have an account? 
                <button className="backLogInButtons" onClick={this.props.handleClick}> 
                Log In </button>
            </label>
        );
    }
}

export default Login;