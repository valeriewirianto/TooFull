import React from 'react';
import './IndividualFriendsUserSetting.css'
import {uid} from "react-uid";
import {Link} from "react-router-dom";
import NavigationBar from './NavigationBar';
import { delete_user, get_all_users } from './actions/all_users';
class AllUsers extends React.Component{
    state = {
        AllUsers: []
    }

    componentDidMount(){
        get_all_users(this)

    }

    deleteUser = (user) => {
        if (window.confirm('Are you sure you want to permanently delete user ' + user.username + "?")) {
        } 
        else {
            return
        }
        delete_user(user).then(res => {
            const filterUsers= this.state.AllUsers.filter(
                (check) =>{
                    return check._id !== user._id
                }
            )
            this.setState(
                {
                    AllUsers: filterUsers
                }
            )
        })
    }

    AllUsersRow(user){
        return(
            <tr key={uid(user)}>
                <td>
                    <Link to={{
                                pathname: './profile',
                                state:{
                                    edit: false,
                                    user: user._id
                                }
                              }}>
                            <button type = "button" className="UsernameButton">{user.username}</button>
                    </Link>
                </td>
                <td>
                    <button type="button" className='DeleteFriend'
                            onClick = {
                                () => this.deleteUser(user)
                            }
                    > delete </button>
                </td>
            </tr>
        )
    }


    AllUsersTable(){
        return (
            <table id='AllUsersTable'>
                <tbody>
                <tr>
                    <th>username</th>
                    <th>Delete</th>
                </tr>
                {this.state.AllUsers.map(user => {return this.AllUsersRow(user)})}
                </tbody>
            </table>
        )
    }

    AllUsersPanel1(){
        return(
            <div id='AllUsersPanel1'>
                <h1> All the users:</h1>
                {this.AllUsersTable()}
            </div>
        )
    }

    AllUsersPanel2(){
        return(
            <div id="AllUsersPanel2">
                <p>
                    <strong>Dear Admin</strong>
                    <br />
                    Deleting a user is not good.
                    <br />
                    Think about the decision you make carefully before doing it.
                    <br />
                    We have warned you!
                </p>
            </div>
        )
    }

    render() {
        return (
            <div>
                <NavigationBar app = {this.props.app} history = {this.props.history}/>
                {/*<Link to={'/Main'}>*/}
                {/*    <div><button className='back'>Back</button></div>*/}
                {/*</Link>*/}
                {this.AllUsersPanel1()}
                {this.AllUsersPanel2()}
            </div>
        );
    }
}
export default AllUsers