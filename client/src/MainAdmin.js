import React from 'react';
import { Link } from 'react-router-dom';
import './CSS/Main.css'
import Chart from './Chart'
import {uid} from 'react-uid';

class MainAdmin extends React.Component{
    render(){
        return(
            <div>
                <TopHeader/>
                <MyLists/>
                <Popularity/>
            </div>
        )
    }
}

class TopHeader extends React.Component{
    render(){
        return(
            <div >
                Main Admin Page
                <Link to={'/AllUsers'}>
                    <button className="topButtons">Modify Users</button>
                </Link>
                <Link to={'/Setting'}>
                    <button className="topButtons">Update List Categories</button>
                </Link>
                <Link to={'/Search'}>
                    <button className="topButtons">Search for Similar Lists</button>
                </Link>
                <Link to={'/Friends'}>
                    <button className="topButtons">Friends</button>
                </Link>
                <Link to={'/Profile'}>
                    <button className="topButtons">Profile</button>
                </Link>
                <hr/>
            </div>
        )
    }
}

class MyLists extends React.Component{
    state = {
        userID: 14,
        lists: [
            {id: 1, name: 'Burgers'},
            {id: 2, name: 'Beverages'},
            {id: 3, name: 'Dishes'},
            {id: 4, name: 'Ingredients'}
        ],
        seen: false
    }

    componentDidMount = () => {
        /* 
            Make GET request here to obtain user's lists.
        */
    }

    addNewList = (newName, category, permissions, description) => {
        this.togglePop()
        const newList = this.state.lists.push({id: 5, name: newName})
        this.setState({
            list: newList
        })
         /*
            Make post request to insert new list information to database.
            Pass in values newName, category, permissions, description
        */
    }

    togglePop = () => {
       this.setState(
        {
        seen: !this.state.seen
        }
       );};
    
    render(){
        return(
            <div id="foodListSpan">
                <h3>My Lists</h3>
                <div className="btn" onClick={this.togglePop}>
                    <button>Not enough lists? Create a new one!</button>
                </div>
                {this.state.seen ? <NewListPopUp addNewList={this.addNewList}toggle={this.togglePop} /> : null}<br></br>
                <div id="grid-container">
                    {this.state.lists.map((list) =>{
                        return(
                            <Link to={'/IndividualList'}
                            key={uid(list)}>
                                <button className="listButtons">{list.name}</button>
                            </Link>
                        )
                    })} 
                </div>
            </div>
        )
    }
}

class Popularity extends React.Component{
    state = {
        sortBy: 'dish'
    }

    sortChanged = (event) => {
        const target = event.target
        const value = target.value
        const name = target.name

        this.setState({
            [name]: value
        })
    }

    render(){
        return(
            <div id="popularitySpan">
                <label className="prompt">Rank popularity by:</label>
                <select name="sortBy" 
                        id="popularity"
                        onChange={this.sortChanged}>
                    <option value="dish">Dish</option>
                    <option value="beverage">Beverage</option>
                    <option value="ingredient">Ingredient</option>
                </select>
                <h4>Winners at the moment:</h4>
                <Chart id="chart" 
                       option={this.state.sortBy}>
                </Chart>
            </div>
        )
    }
}

class NewListPopUp extends React.Component{
    state = {
        listName: "",
        category: "",
        permission: "",
        descript: ""
    }

    handleTextChange = (event) => {
        const target = event.target
        const value = target.value
        const name = target.name

        this.setState({
            [name]: value
        })
    }

    handleCloseClick = () => {
        this.props.toggle();
        console.log(this.state)
    };

    render(){
        const {addNewList} = this.props
        return(
            <div className="popup">    
                <form className="form">
                    <span className="closeX" onClick={this.handleCloseClick}>&times;</span><br></br>
                    <strong>Create a new list! </strong><br></br>
                    <br></br>
                    <div className="labelDiv">
                        <label className="popupLabel"><b>List Name:</b></label><br></br>
                        <label className="popupLabel"><b>Category:</b></label><br></br>
                        <label className="popupLabel"><b>Permissions(private or public):</b></label><br></br>
                        <label className="popupLabel"><b>List description:</b></label>
                    </div>
                    <div className="textDiv">
                        <input className="popupTextbox" type="text" name="listName" onChange={this.handleTextChange}></input><br/>
                        
                        <input className="popupTextbox" type="text" name="category" onChange={this.handleTextChange}></input><br/>
                        <input className="popupTextbox"  type="text" name="permission"onChange={this.handleTextChange}></input><br/>
                        <input className="popupTextbox"  type="text" name="descript" onChange={this.handleTextChange}></input><br></br><br></br>
                    </div>
                    <input className="popupButton" 
                           type="button" 
                           value="Submit"
                           onClick={() => addNewList(this.state.listName)}></input>
                </form>
            </div>
        )
    }
}


export default MainAdmin;
