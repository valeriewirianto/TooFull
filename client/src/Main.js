import React from 'react';
import { Link } from 'react-router-dom';
import './CSS/Main.css'
import Chart from './Chart'
import {uid} from 'react-uid';
import { create_list, get_all_lists } from './actions/myList';
import NavigationBar from './NavigationBar'

class Main extends React.Component{
    contructor(props){
        //console.log(this.props.history)
        //this.props.history.push('/main')
    }
    render(){
        return(
            <div>
                <NavigationBar app = {this.props.app} history = {this.props.history}/>
                <MyLists/>
                <Popularity/>
            </div>
        )
    }
}

class MyLists extends React.Component{
    state = {
        userID: 14,
        lists: [],
        seen: false
    }

    componentDidMount = async () => {
        await get_all_lists(this)
    }

    addNewList = (listName, category, permissions, listDescription) => {
        if (listName === "" || category === "" || permissions === "" || listDescription === ""){
            alert("Please enter a value for all fields.")
            return
        }
        create_list(this, listName, category, listDescription, permissions)
        .then(response =>{
            if(response === "success"){
                this.togglePop()
                alert("New list created!")
            }
        })
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
                <h3 className="myListTitle">My Lists</h3>
                <div className="btn" onClick={this.togglePop}>
                    <button className="notEnoughListsButton">Not enough lists? Create a new one!</button>
                </div>
                {this.state.seen ? <NewListPopUp addNewList={this.addNewList}toggle={this.togglePop} /> : null}<br></br>
                <div id="grid-container">
                    {this.state.lists.map((list) =>{
                        return(
                            <Link to={{
                                pathname: '/IndividualList',
                                state:{
                                    listId: list.id,
                                    user: 'me'
                                }
                                }}
                                key={uid(list)}
                                >
                                <button className="listButtons">{list.listName}</button>
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
                <br></br> <br></br>
                <label className="prompt">Rank popularity by:</label>
                
                <select name="sortBy" 
                        id="popularity"
                        onChange={this.sortChanged}>
                    <option value="dish">Dish</option>
                    <option value="beverage">Beverage</option>
                    <option value="ingredient">Ingredient</option>
                </select>
                <br></br>
                <br></br>
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
        category: "dishes",
        permission: "private",
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
    };

    dropChanged = (event) => {
        const target = event.target
        const value = target.value
        const name = target.name

        this.setState({
            [name]: value
        })
    }


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
                        
                        <select name="category" 
                            id="dropDownCategory"
                            onChange={this.dropChanged}>
                            <option value="dishes">dishes</option>
                            <option value="ingredients">ingredients</option>
                            <option value="beverages">beverages</option>
                        </select>

                        <br></br>

                        <select name="permission" 
                            id="dropDownPermissions"
                            onChange={this.dropChanged}>
                            <option value="private">private</option> 
                            <option value="public">public</option>
                        </select>

                        <input className="popupTextbox"  type="text" name="descript" onChange={this.handleTextChange}></input><br></br><br></br>
                    </div>
                    <input className="popupButton" 
                           type="button" 
                           value="Submit"
                           onClick={() => addNewList(this.state.listName, this.state.category, this.state.permission, this.state.descript)}></input>
                </form>
            </div>
        )
    }
}


export default Main;
