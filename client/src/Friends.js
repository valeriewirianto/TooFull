import React from 'react';
import './IndividualFriendsUserSetting.css'
import {uid} from "react-uid";
import {Link} from "react-router-dom";
import {
    add_existing_friend,
    delete_existing_friend,
    delete_potential_friend, get_all_username,
    get_friend_list,
    send_friend_request
} from "./actions/friend";
import NavigationBar from './NavigationBar'


class Friends extends React.Component{
    state = {
        all_username: [],
        match_username: [],
        ExistingFriendsList: [],
        PotentialFriendsList: [],
        ExistingFriendsList_id: [],
        PotentialFriendsList_id: [],
        usernameInput: "",
        user: null,
        friendObject: null,
        username_exist : "User exist"
    }

    componentDidMount(props){
        get_friend_list(this)
        get_all_username(this)
    }
    

    handleChange(event){
        this.setState({[event.target.name]: event.target.value});
    }

    handleSubmit(event){
        alert("Sending the request");
        send_friend_request(this, this.state.usernameInput).then(response =>{
            if(response === "NOUSER"){
                alert("NO SUCH USER!")
            }else if (response === "USERONLIST"){
                alert("The user is either is waiting fror you accept their request or has already been on your friend list ")
            }else if(response === "DOUBLE"){
                alert("You have already sent before! Wait!")
            }else{
                alert("sent!!!")
            }
        })
    }

    deleteFriend = (username) => {
       delete_existing_friend(this, username)
    }

    ExistingFriendsRow(username, userid){
        return(
            <tr key={uid(username)}>
                <td>
                    <Link to={{
                                pathname: './profile',
                                state:{
                                    edit: false,
                                    user: userid
                                }
                              }}>
                            <button type = "button" className="UsernameButton">{username}</button>
                    </Link>

                </td>
                <td>
                    <button type="button" className='DeleteFriend'
                            onClick = {
                                () => this.deleteFriend(username)
                            }
                    > delete
                    </button>
                </td>
            </tr>
        )
    }



    ExistingFriends() {
        return (
            <table id='ExistingFriends'>
                <tbody>
                <tr>
                    <th>username</th>
                    <th>Delete</th>
                </tr>
                {this.state.ExistingFriendsList.map((username, index) => {return this.ExistingFriendsRow(username, this.state.ExistingFriendsList_id[index])})}
                </tbody>
            </table>
        )
    }
    Panel1(){
        return(
            <div id="FriendsPanel1">
                <h1>My Friends List</h1>
                {this.ExistingFriends()}
            </div>
        )
    }

    rejectFriend = (username) => {
       delete_potential_friend(this, username)
    }

    acceptFriend = (username) => {
        add_existing_friend(this,username)
    }

    PotentialFriendsRow(username, userid){
        return(
            <tr key={uid(username)}>
                <td>
                    <Link to={{
                                pathname: './profile',
                                state:{
                                    edit: false,
                                    user: userid
                                }
                              }}>
                            <button type = "button" className="UsernameButton">{username}</button>
                    </Link>

                </td>
                <td>
                    <button type="button" className='AcceptFriend'
                            onClick={
                                () => this.acceptFriend(username)
                            }
                    > Accept! </button>
                </td>
                <td>
                    <button type="button" className='RejectFriend'
                            onClick={
                                () => this.rejectFriend(username)
                            }
                    > NO! </button>
                </td>
            </tr>
        )
    }


    PotentialFriends(){
        return (
            <table id="PotentialFriends">
                <tbody>
                <tr>
                    <th>username</th>
                    <th>Accept</th>
                    <th>Reject</th>
                </tr>
                {this.state.PotentialFriendsList.map((username, index) => {return this.PotentialFriendsRow(username, this.state.PotentialFriendsList_id[index])})}
                </tbody>
            </table>
        )
    }


    Panel2(){
        return(
            <div id="FriendsPanel2">
                <h1>Who want to be my friends</h1>
                {this.PotentialFriends()}
            </div>
        )
    }



    SendRequestForm(){
        return(
            <div>
                <label><strong>Choose Username:
                    <input list="username" name="usernameInput" onChange={this.handleChange.bind(this)}/> </strong></label>
                <datalist id={"username"} >
                    {this.state.all_username.map(username=>{return <option value={username.username}/>})}
                </datalist>
            </div>
        )
    }

    Panel3(){
        return(
            <div id="FriendsPanel3">
                <h1>Send a Friends Request</h1>
                {this.SendRequestForm()}
                <br/>
                <button  onClick={this.handleSubmit.bind(this)} id={"SENDBUTTON"}>Send the request!</button>
                <br/>
            </div>
        )
    }

    render(){
        return(
            <div>
                <NavigationBar app = {this.props.app} history = {this.props.history}/>
                {/*<Link to={'/Main'}>*/}
                {/*    <div><button className='back'>Back</button></div>*/}
                {/*</Link>*/}
                
                {this.Panel1()}
                {this.Panel2()}
                {this.Panel3()}
            </div>
        )
    }

}
export default Friends;