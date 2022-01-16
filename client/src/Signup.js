import React from 'react';

class Signup extends React.Component {

    state = {   
        username:"",
        password:"",
        repeat_password:"",
        email:""
    }

    handleInputChange = (event) => {
        const target = event.target
        const value = target.value
        const name = target.name

        this.setState({
            [name]: value
        })
    }

    render(){
        return (
        <div className="Signup">
           Sign up Page 
           <br/>
           <label>Enter a username:</label>
           <input value={ this.state.username } 
                onChange={ this.handleInputChange }
                id ="username" 
                type="text" 
                name="username" 
                placeholder="username"/>
        </div>
      )
    }
}

export default Signup;
