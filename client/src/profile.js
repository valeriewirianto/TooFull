import React from 'react';
import './CSS/Profile.css';
import avatar from "./Resources/Profile_avatar_placeholder.png";
import mo1 from "./Resources/mo1.jpg";
import mo2 from "./Resources/mo2.jpg";
import NavigationBar from './NavigationBar'
import { change_profile_info, get_user_profile_info } from './actions/profile';

class Profile extends React.Component{
    render(){
        return(
            <div>
                <NavigationBar app = {this.props.app} history = {this.props.history}/>
                <ProfileHeader/>
                <Body edit = {this.props.location.state.edit} userid = {this.props.location.state.user}/>
            </div>
        );
    }
}

class Body extends React.Component{
    render(){
        return(
            <div>
                <img className="avatar" src={avatar}  alt=""></img>
                <ProfileSidebar edit = {this.props.edit} userid = {this.props.userid}/>
                <Posts />
            </div>
        );
    }
}

class Posts extends React.Component{
    constructor(props){
        super(props);
        this.state={
            moments: [{comment: "Feast time!", picture: mo1}, 
                {comment: "Ingredients for Thanksgiving meal!", picture: mo2}],

            newComment: "",
            newPicture: mo1,
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event){
        this.setState({[event.target.name]: event.target.value});
    }

    handlePost(){
        this.setState(prevState => {
            let moments = prevState.moments.slice();
            moments.unshift({comment: this.state.newComment, picture: mo1});              
            return { moments};
          })
    }

    render(){
        return(
            <div>
                <TimeLine moments={this.state.moments} />
                <CreatePost comment={this.state.newComment} handleChange={this.handleChange} 
                    handlePost={() => this.handlePost()}/>
            </div>
        );
    }
}

class ProfileHeader extends React.Component{
    render(){
        return(
            <div className="header">
                <ProfileSearchBar />
            </div>
        );
    }
}

class ProfileSearchBar extends React.Component{
    render(){
        return(
            <form>
                <input type="text" className="searchProfile"
                    placeholder="     Search user profile" />
            </form>
        );
    }
}

class ProfileSidebar extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            info: {
                    username: "",
                    name: "",
                    age: "",
                    nationality: "",
                    favouriteFood: "",
                    favouriteCuisine: "",
                    bio: ""
                },
            edit: false,
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){
        get_user_profile_info(this, this.props.userid)
    }

    handleClick(){
        this.setState({edit: !this.state.edit});
        change_profile_info(this, this.state.info, this.props.userid).then(res => {
            if (res === "success"){
                alert("Successfully updated profile information!")
            }
            else {
                alert("There was an issue updating profile information. Please try again.")
            }
        })
    }

    handleChange(event){
        this.setState(prevState => {
            let info = Object.assign({}, prevState.info);
            info[event.target.name] = event.target.value;              
            return { info }; 
          })
    }

    renderProfileDetails(){
        return(
            <span>
            {!this.props.edit
                ? <ProfileDetailText info={this.state.info} handleClick={() => this.handleClick()} /> 

                : <span><ProfileDetailForm info={this.state.info} handleClick={() => this.handleClick()} handleChange={this.handleChange} />
                 </span>}
            
            </span>

               
        );
    }

    render(){
        return(
            <div className="profileSidebar">
                    {this.renderProfileDetails()}
            </div>
        );
    }
}

class ProfileDetailText extends React.Component{
    render(){
        return(
            <div>
                <ul>
                    <ProfileDetail name="Username" value={this.props.info.username} />
                    <ProfileDetail name="Name" value={this.props.info.name} />
                    <ProfileDetail name="Age" value={this.props.info.age} />
                    <ProfileDetail name="Nationality" value={this.props.info.nationality} />
                    <ProfileDetail name="Favourite Food" value={this.props.info.favouriteFood} />
                    <ProfileDetail name="Favourite Cuisine" value={this.props.info.favouriteCuisine} />
                    
                    <li className="detail">
                        <p className="bioName"> About Me: </p> 
                        <p className="bioContent"> {this.props.info.bio} </p>
                    </li>
                </ul>
            </div>
        );
    }
}

class ProfileDetail extends React.Component{
    render(){
        return(
            <li className="detail">
                <p className="detailName"> {this.props.name}: </p> 
                <p className="detailContent"> {this.props.value} </p>
            </li>
        );
    }
}

class ProfileDetailForm extends React.Component{

    render(){
        return(
            <form>
                    <ProfileDetail name="Username" value={this.props.info.username} />

                    <div className="detailInput">
                        <p className="detailName"> Name: </p>
                        <input type="text" name="name" className="profileDetailInput"
                        value={this.props.info.name} onChange={this.props.handleChange} />
                        <br/>
                    </div>
                    <br/>

                    <div className="detailInput">
                        <p className="detailName"> Age: </p>
                        <br/>
                        <input type="text" name="age" className="profileDetailInput"
                        value={this.props.info.age} onChange={this.props.handleChange} />
                        
                    </div>

                    <div className="detailInput">
                        <p className="detailName"> Nationality: </p>
                        <input type="text" name="nationality" className="profileDetailInput"
                        value={this.props.info.nationality} onChange={this.props.handleChange} />
                        <br/>
                    </div>

                    <div className="detailInput">
                        <p className="detailName"> Favourite Food: </p>
                        <input type="text" name="favouriteFood" className="profileDetailInput"
                        value={this.props.info.favouriteFood} onChange={this.props.handleChange}/>
                        <br/>
                    </div>

                    <div className="detailInput">
                        <p className="detailName"> Favourite Cuisine: </p>
                        <input type="text" name="favouriteCuisine" className="profileDetailInput"
                        value={this.props.info.favouriteCuisine} onChange={this.props.handleChange} />
                        <br/>
                    </div>

                    <div className="detailInput">
                        <p className="bioName"> About Me: </p> 
                        <textarea name="bio" cols="25" rows="5" className="profileDetailInput" 
                            value={this.props.info.bio} onChange={this.props.handleChange}></textarea>
                        
                    </div>

                    <input className="profileDetailsubmitButton" type="button" value="Update" 
                        onClick={()=>this.props.handleClick()}/>
                </form>
        );
    }
}

class TimeLine extends React.Component{
    render(){
        const moments = this.props.moments.map(moment => {
            return(
                <li className="momentsItem">
                    <Moment caption={moment.comment} picture={moment.picture} />
                </li>
            );
        });

        return(
            <div className="foodMoments">
                <div className="momentsHeader">
                    <h4> My Food Moments </h4>
                </div>
                
                <ul className="momentsList">{moments}</ul>
            </div>
        );
    }
}

class Moment extends React.Component{
    render(){
        return(
            <div className="moment">
                <p className="caption"> {this.props.caption} </p>
                <img className="momentPicture" src={this.props.picture} alt="" />
            </div>
        );
    }
}

class CreatePost extends React.Component{
    render(){
        return(
            <div className="createPost">
                <form>
                    <label> Create New Post: </label>
                    <br/>
                    <label> Comment: </label>
                    <input type="text" name="newComment"
                    value={this.props.comment} onChange={this.props.handleChange} />
                    <br/>
                    <label for="img">Select image:</label>
                    <input type="file" id="img" name="img" accept="image/*" />

                    <input className="postsubmitButton" type="button" value="Post" 
                        onClick={this.props.handlePost}/>
                </form>
            </div>
        );
    }
}


export default Profile;