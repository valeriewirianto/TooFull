import React from 'react';
import './IndividualFriendsUserSetting.css'
import {uid} from "react-uid";
// import {Link} from "react-router-dom";
import NavigationBar from './NavigationBar'
class Setting extends React.Component{
    state={
        ListCategories: ["Ingredients", "Dishes", "Categories"],
        IdentityCategories: ["Cook"],
        List: "",
        Identity: ""
    }

    deleteItem = (name) => {
        const filterItems= this.state.ListCategories.filter(
            (check) =>{
                return check !== name
            }
        )
        this.setState(
            {
                ListCategories: filterItems
            }
        )
    }


    ListItem(name){
        return(
            <li  key={uid(name)} >
                <button type="button" className='DeleteCategory'
                        onClick = {
                            () => this.deleteItem(name)
                        }
                > X </button>
                {"      "}
                {name}
            </li>
        )
    }

    ListCategory(){
        return(
            <ul>
                {this.state.ListCategories.map(name=>{return this.ListItem(name)})}
            </ul>
        )
    }





    deleteIdentityItem = (name) => {
        const filterItems= this.state.IdentityCategories.filter(
            (check) =>{
                return check !== name
            }
        )
        this.setState(
            {
                IdentityCategories: filterItems
            }
        )
    }

    IdentityItem(name){
        return(
            <li  key={uid(name)} >
                <button type="button" className='DeleteCategory'
                        onClick = {
                            () => this.deleteIdentityItem(name)
                        }
                > X </button>
                {"      "}
                {name}
            </li>
        )
    }
    IdentityCategory(){
        return(
            <ul>
                {this.state.IdentityCategories.map(name=>{return this.IdentityItem(name)})}
            </ul>
        )
    }

    SettingPanel1(){
        return(
            <div id="SettingPanel1">
                <h1> List Category</h1>
                {this.ListCategory()}
            </div>
        )

    }

    SettingPanel2(){
        return(
            <div id="SettingPanel2">
                <h1> Identity Category</h1>
                {this.IdentityCategory()}
            </div>
        )
    }



    handleChange = (event) => {
        const target = event.target
        const value = target.value
        const name = target.name
        this.setState(
            {
                [name]: value
            }
        )
    }



    AddList = (event)=>{
        event.preventDefault()
        const newList= this.state.List
        let old = this.state.ListCategories
        old.push(newList)
        this.setState({
            ListCategories: old
        })
    }

    AddListForm(){
        return(
            <form>
                <label>
                    <strong> Add a new list category  </strong>
                    <input type="text" name="List" value = {this.state.List}
                           onChange={this.handleChange}/>
                </label>
                <input type="submit" value="Add"
                       className="AddNewCategoryButton"
                       onClick={this.AddList}
                />
            </form>
        )
    }

    AddIdentity = (event)=>{
        event.preventDefault()
        const newIdentity = this.state.Identity
        let IdentityList = this.state.IdentityCategories
        IdentityList.push(newIdentity)
        this.setState({
            IdentityCategories: IdentityList
        })
    }



    AddIdentityForm(){
        return(
            <form>
                <label>
                    <strong> Add a new identity category  </strong>
                    <input type="text" name="Identity" value = {this.state.Identity}
                           onChange={this.handleChange}
                    />
                </label>
                <input type="submit" value="Add"
                       onClick={this.AddIdentity}
                       className="AddNewCategoryButton"/>
            </form>
        )
    }

    SettingPanel3(){
        return(
            <div id="SettingPanel3">
                <h1>Add a New Category</h1>
                {this.AddListForm()}
                <br />
                {this.AddIdentityForm()}
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
                <hr/>
                {this.SettingPanel1()}
                {this.SettingPanel2()}
                {this.SettingPanel3()}

            </div>
        )
    }
}
export default Setting