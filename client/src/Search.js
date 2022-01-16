import React from 'react';
import { Link } from 'react-router-dom';
import './CSS/Search.css'
import {uid} from 'react-uid';
import {search_by_food, search_by_name} from './actions/search'
import NavigationBar from './NavigationBar'

class Search extends React.Component{

    state = {
        list:[]
    }

    render(){
        return(
            <div>
            <NavigationBar app = {this.props.app} history = {this.props.history}/>
                <br></br><br></br>
                <strong className="searchTitle">Search For Similar Lists!</strong>
                <SearchBar app={this}/>
                <TableResults rows={this.state.list}/>
                <SearchInstructions rows={this.state.list}/>
            </div>
        )
        
    }
}

class TableResults extends React.Component{

    Row(row){
        return(
            <tr key={uid(row)}>
                <td>

                    <Link to={{
                                pathname: './IndividualList',
                                state:{
                                    listId: row.listId,
                                    user: 'visitor'
                                }
                                }}
                                >{row.listName}</Link>
                </td>
                <td>
                    <p>{row.listDescript}</p>
                </td>
                <td>
                    <Link to={{
                                pathname: './profile',
                                state:{
                                    edit: false,
                                    user: row.userId
                                }
                                }}
                                ><p>{row.username}</p>
                    </Link>

                </td>
            </tr>
        )
    }



    render(){
        const { state, rows } = this.props
        return(
            <table id = "tableDiv">
                <tbody>
                <tr>
                    <th>List Name</th>
                    <th>List Description</th>
                    <th>Username</th>
                </tr>
                {rows.map(row => {return this.Row(row)})}
                </tbody>
            </table>
        )
    }
}


class SearchBar extends React.Component{
    state = {
        searchBy: 'list',
        searchInput: ""
    }

    searchChanged = (event) => {
        const target = event.target
        const value = target.value
        const name = target.name

        this.setState({
            [name]: value
        })
    }

    submitRequest = () =>{
        const { app } = this.props

        if(this.state.searchBy === 'food'){
            search_by_food(app, this.state.searchInput)
        }
        else if(this.state.searchBy === 'list'){
            search_by_name(app, this.state.searchInput)
        }
    }

    render(){
        return(
            <form id="searchBarForm">
                <select name="searchBy" 
                        id="dropDownSearch"
                        onChange={this.searchChanged}>
                    <option value="list">List name</option>
                    <option value="food">Food name</option>
                </select>
                <input type="text" id="searchBarText" name="searchInput" onChange={this.searchChanged}></input>
                <input type="button" id="searchBarButton" value ="Search" onClick={this.submitRequest}></input>           
            </form>
        
        )
    }
}

class SearchInstructions extends React.Component{
    render(){
        return(
            <div id="searchInstructions">
                <p>In the drop down menu, select whether to search by a food item or a list.</p>
                <p>If you search by a food item, you will be given lists that have that food item in it.</p>
                <p>If you search by a list name, lists that share as many of the same items will be found.</p>
            </div>
        )
    }
}


export default Search;