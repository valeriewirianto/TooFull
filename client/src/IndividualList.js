import "./IndividualFriendsUserSetting.css";
import {uid} from 'react-uid';
// import {Link} from "react-router-dom";
import watermelon from './Stickers/watermelon.png'
import donut from './Stickers/donut.png'
import pie from './Stickers/pie.png'
import broccoli from './Stickers/brocoli.png'
import React from "react";
import NavigationBar from './NavigationBar'
import { add_item, delete_list, get_all_items, delete_item, edit_item, update_list_description } from "./actions/myList";
class IndividualList extends React.Component{

    state = {
        ListName: "",
        Category: "",
        ListDescription: "",
        FoodRank: [],
        seen: false,
        seen2: false,
        seen3: false,
        info: {},
        stickers: [{id:0, source: watermelon}, {id: 1, source: donut}, {id:2, source: pie}, {id: 3, source: broccoli}],
        freeStickers: [],
        selectedImage : null,
        user: null
    }

    componentDidMount(props){
        const { listId, user } = this.props.location.state
        this.state.listId = listId
        this.state.user = user //if user = visitor, do not show add item, delete item, edit description, edit item, etc buttons. If user = me, show buttons
        console.log(this.state.user)
        get_all_items (this, listId)
    }

    ListDescription(){
        return(
            <div id='ListDescription'>
                <h2>List Description</h2>
                <p>{this.state.ListDescription}</p>
            </div>
        )
    }

    removeFoodRank = (Info) => {

        delete_item(this.state.listId, Info._id).then(response =>{
            let filterFoodRank = this.state.FoodRank.filter(
                (check) =>{
                    return check !== Info
                }
            )
    
            filterFoodRank.map((R, index)=> R.Rank = index + 1)
    
            this.setState(
                {
                    FoodRank: filterFoodRank
                }
            )
        })

    }

    deleteWholeList = ()=>{
        delete_list(this.state.listId).then(response =>{
            if(response === "success"){
                alert("List deleted!")
                this.props.history.push('/main')
            }
        })
    }

    OpenClose =()=>{
        this.setState({
            seen: !this.state.seen
        })
    }

    OpenClose2 =()=>{
        this.setState({
            seen2: !this.state.seen2
        })
    }

    OpenClose3 =()=>{
        this.setState({
            seen3: !this.state.seen3
        })
    }

    editItem = (PopUpState, item_id)=>{
        const foodName = PopUpState.FoodName
        const notes = PopUpState.Notes
        const rank = PopUpState.Rank

        let filterFoodRank = this.state.FoodRank.filter(
            (check) =>{
                return check.Rank !== rank
            }
        )

        const editedItem = {
            Rank: rank,
            FoodName: foodName,
            Notes: notes
        }

        edit_item(this, this.state.listId, item_id, foodName, notes)

        this.OpenClose2()


    }

    addNewItem = async (PopUpState)=>{
        const foodName = PopUpState.FoodName
        let rank = PopUpState.Rank
        
        // Basic error handling
        if (PopUpState.FoodName === "" || PopUpState.Rank === "" || PopUpState.Note === ""){
            alert("Please input a value for all fields")
            return
        }

        // Max, please check if rank is integer. Im too lazy to google it. Thanks. The below didnt work. strings ew
        // if (!Number.isInteger(PopUpState.Rank)){
        //     alert("Please input an integer as the rank")
        //     return
        // }

        if (!parseInt(PopUpState.Rank)){
            alert("Please input an integer as the rank")
            return
        }


        if (PopUpState.Rank < 1){
            alert("Please enter an integer for rank greater than 0")
            return
        }

        // rank greater than  MAX rank in current list
        if (this.state.FoodRank.length === 0){

        }
        else if(rank > this.state.FoodRank[this.state.FoodRank.length - 1].rank){
            rank = this.state.FoodRank[this.state.FoodRank.length - 1].rank + 1
        }

        const note = PopUpState.Note
        const newItem = {
            rank: rank,
            foodName: foodName,
            notes: note
        }

        // Add new item and update current FoodRank
        await add_item(this, newItem, this.state.listId)

        this.OpenClose()
    }

    editDescription = (description) => {
        update_list_description(this.state.listId, description).then(res =>{
            this.setState(
                {
                    ListDescription: description
                }
            )
        })
        this.OpenClose3()
    }

    Header(){
        return(
            <div id='HeaderIndividualList'>
                <NavigationBar app = {this.props.app} history = {this.props.history}/>
                <h1>{this.state.ListName + "(" + this.state.Category + ")"}</h1>
                {this.state.user === "me" ? <button type="button" id='AddNewItem' onClick={this.OpenClose}> Add a new list item</button> : null}
                {/*<button type="button" className='AddNewItem' onClick={this.OpenClose}> Add a new list item</button>*/}
                {this.state.seen ? <NewRankPopup addNewItem={this.addNewItem} OpenClose={this.OpenClose} /> : null}
                {this.state.seen2 ? <EditRankPopup OpenClose={this.OpenClose2} Info= {this.state.info}
                                                   editItem={this.editItem}
                /> : null}
                {this.state.seen3 ? <EditDescription editDescription={this.editDescription} OpenClose={this.OpenClose3}
                                                     Description = {this.state.ListDescription}
                /> : null}
                <span className='EmptySpace'> </span>
                {this.state.user === "me" ? <button type="button" id='DeleteWholeList' onClick={this.deleteWholeList}> Delete the whole list </button> : null}
                {/*<button type="button" className='DeleteWholeList' onClick={this.deleteWholeList}> Delete the whole list </button>*/}
                <span className='EmptySpace'> </span>
                {this.state.user === "me" ? <button type="button" id='EditDescription' onClick={(this.OpenClose3)}> Edit Description </button> : null}
                {/*<button type="button" className='EditDescription' onClick={(this.OpenClose3)}> Edit Description </button>*/}

            </div>
        )
    }


    changeEditingRank = (Info)=> {
        this.setState(
            {
                info: Info
            }
        )
        this.OpenClose2()
    }

    TableRow(info){
        return(
            <tr key={uid(info)}>
                <td className={"RankRow"}>
                    <strong>{info.rank}</strong>
                </td>
                <td>
                    <div className={"NameRow"}>
                        <strong>{info.foodName}</strong>
                    </div>
                </td>
                <td>
                    <div className={"NoteRow"}>
                        {info.notes}
                    </div>
                </td>
                {
                    this.state.user === "me" ?
                        <td className={"EditRow"}>
                            <button type="button" className='editIndividualList'
                                    onClick={() => this.changeEditingRank(info)}
                            > edit </button>
                        </td> : null
                }
                {
                    this.state.user === "me" ?
                        <td className={"DeleteRow"}>
                            <button type="button" className='deleteIndividualList'
                                    onClick = {
                                        () => this.removeFoodRank(info)
                                    }
                            > delete </button>
                        </td> : null
                }
                {/*<td>*/}
                {/*    <button type="button" className='editIndividualList'*/}
                {/*            onClick={() => this.changeEditingRank(info)}*/}
                {/*    > edit </button>*/}
                {/*</td>*/}
                {/*<td>*/}
                {/*    <button type="button" className='deleteIndividualList'*/}
                {/*            onClick = {*/}
                {/*                () => this.removeFoodRank(info)*/}
                {/*            }*/}
                {/*    > delete </button>*/}
                {/*</td>*/}
            </tr>
        )
    }


    Table(){
        return(
            <table>
                <tbody>
                <tr>
                    <th>Rank</th>
                    <th>FoodName</th>
                    <th>Notes</th>
                    {this.state.user === "me" ?  <th>Edit</th>: null}
                    {/*<th>Edit</th>*/}
                    {this.state.user === "me" ?  <th>Delete</th>: null}
                    {/*<th>Delete</th>*/}
                </tr>
                {this.state.FoodRank.map(info => {return this.TableRow(info)})}
                </tbody>
            </table>
        )
    }




    // deleteFreeSticker(id){
    //     console.log("Deleteing")
    //     const freeStickers = this.state.freeStickers
    //     let filtered = freeStickers.filter(fs => fs.id.toString() !== id)
    //     console.log(filtered)
    //     this.setState({
    //         freeStickers: filtered
    //     })
    // }
    //
    //
    //
    // click = (event)=>{
    //     const target = event.target
    //     const type = target.type
    //     const className = target.className
    //
    //     if(className === 'freeSticker'){
    //         const targetID = target.id
    //         this.deleteFreeSticker(targetID)
    //     }
    //
    //     if (type !== 'button' && this.state.selectedImage != null && className !== 'sticker'){
    //         let x = event.clientX
    //         let y = event.clientY
    //         const length = this.state.freeStickers.length
    //         let ID = 0
    //         if (length !== 0){
    //             ID = this.state.freeStickers[length - 1].id + 1
    //         }
    //         const freeSticker = {
    //             id: ID,
    //             location: [x, y],
    //             source: this.state.selectedImage
    //         }
    //         let existingFreeStickers = this.state.freeStickers
    //         existingFreeStickers.push(freeSticker)
    //         this.setState({
    //             freeStickers: existingFreeStickers,
    //             selectedImage: null
    //
    //         })
    //
    //     }
    // }
    //
    // freeSticker(fs) {
    //     const id = fs.id
    //     const stringID = id.toString()
    //     const source = fs.source
    //     const x = fs.location[0]
    //     const y = fs.location[1]
    //     let left = (x - 25)+ 'px';
    //     let top = (y - 25) + 'px';
    //     let sticker = document.createElement("IMG");
    //     sticker.src =source
    //     sticker.alt = "iamge not found"
    //     sticker.key = uid(fs)
    //     sticker.id = stringID
    //     sticker.className = 'freeSticker'
    //     sticker.style.left = left
    //     sticker.style.top = top
    //     sticker.style.position = "absolute"
    //
    //     return (
    //         ReactHtmlParser(sticker.outerHTML)
    //     )
    //
    // }
    //
    // FreeStickers(){
    //     const freeStickers = this.state.freeStickers
    //     return(
    //             <div>
    //                 { freeStickers.map(fs => this.freeSticker(fs))}
    //             </div>
    //
    //
    //             )
    // }
    //
    // selectImage= (event)=> {
    //     event.preventDefault()
    //     console.log("I am selecting a sticker")
    //     const target = event.target
    //     const source = target.src
    //     console.log(source)
    //     this.setState({
    //         selectedImage: source
    //     })
    //
    //
    // }
    //
    // sticker(s){
    //
    //     return(
    //         <div className='stickerDiv' key={uid(s)}>
    //             <img src={this.state.stickers[s.id].source } alt='No image'  className='sticker'
    //                  onClick={this.selectImage}/>
    //             <span className='EmptySpace'> </span>
    //         </div>
    //
    //     )
    // }
    //
    //
    //
    //
    //
    // StickerList(){
    //     return(
    //         <div className='stickerList'>
    //             {this.state.stickers.map(s => this.sticker(s))}
    //
    //         </div>
    //
    //     )
    // }
    //
    //
    //
    // StickerPanel(){
    //     return(
    //         <div className='StickerPanel'>
    //             <h2> Choose Your Stickers</h2>
    //             <p> Choose by clicking the image and the position that the sticker should go and deleting by clicking again</p>
    //             {this.StickerList()}
    //             <p>Stickers can only go to the header, List Description, item table and sticker panel</p>
    //         </div>
    //     )
    // }



    render() {
        return(
            <div onClick={this.click}>
                {/*<Link to={'/Main'}>*/}
                {/*    <div><button className='back'>Back</button></div>*/}
                {/*</Link>*/}
                {this.Header()}
                <br/>

                {this.Table()}
                {this.ListDescription()}
                {/*{this.StickerPanel()}*/}
                {/*{this.FreeStickers()}*/}

            </div>
        )
    }
}

class NewRankPopup extends React.Component{
    state = {
        FoodName: "",
        Rank: "",
        Note: ""
    }

    handleChange = (event) => {
        const target = event.target
        const value = target.value
        const name = target.name

        this.setState({
            [name]: value
        })
    }

    FoodNameForm(){
        return(
            <form className="FoodNameForm">
                <label>
                    <strong>Food Name:  </strong>
                    <input type="text" name="FoodName" value = {this.state.FoodName}
                           onChange={this.handleChange} className="FoodNameInputBox"
                    />
                </label>
            </form>
        )
    }

    RankForm(){
        return(
            <form className="RankForm">
                <label>
                    <strong>{"Rank:                      "}</strong>
                    <input type="text" name="Rank" value = {this.state.rank} className="RankInputBox"
                           onChange={this.handleChange}
                    />
                </label>
            </form>
        )
    }
    NoteForm(){
        return(
            <form className="NoteForm">
                <label>
                    <strong>Note:  </strong>
                    <br/>
                    <textarea  name="Note" value = {this.state.Note} className="NoteInputBox"
                               onChange={this.handleChange} rows="5" cols="10" wrap="soft">
                    </textarea>
                </label>
            </form>
        )
    }

    Header(){
        return(
            <div className="PopUpWindowHeader">
                <h2>Add a new Item to the list</h2>
            </div>

        )
    }



    render(){
        return(
            <div className="PopUpWindow">
                {this.Header()}
                <br />
                {this.FoodNameForm()}
                <br />
                {this.RankForm()}
                <br />
                {this.NoteForm()}
                <br />
                <div className="ButtonArray">
                    <button type="button" onClick={()=>this.props.addNewItem(this.state)}>submit</button>
                    <span className='EmptySpace'> </span>
                    <button type="button" onClick={this.props.OpenClose}> Cancel </button>
                </div>

            </div>
    )
    }
}

class EditRankPopup extends React.Component{
    state = {
        FoodName: this.props.Info.FoodName,
        Notes: this.props.Info.Notes,
        Rank: this.props.Info.Rank
    }
    handleChange = (event) => {
        const target = event.target
        const value = target.value
        const name = target.name

        this.setState({
            [name]: value
        })
    }

    Header(){
        return(
            <div className="PopUpWindowHeader">
                <h2>Edit this item</h2>
            </div>

        )
    }

    NoteForm(){
        return(
            <form className="NoteForm">
                <label>
                    <strong>Note:  </strong>
                    <br/>
                    <textarea name="Notes" value = {this.state.Notes} className="NoteInputBox"
                                          onChange={this.handleChange} rows="5" cols="10" wrap="soft">
                    </textarea>
                </label>
            </form>
        )
    }

    FoodNameForm(){
        return(
            <form className="FoodNameForm">
                <label>
                    <strong>Food Name:  </strong>
                    <input type="text" name="FoodName" value = {this.state.FoodName}
                           onChange={this.handleChange} className="FoodNameInputBox"
                    />
                </label>
            </form>
        )
    }

    render(){
        return(
            <div className="PopUpWindow">
                {this.Header()}
                <br />
                {this.FoodNameForm()}
                <br />
                {this.NoteForm()}
                <br />
                <div className="ButtonArray">
                    <button type="button" onClick={()=>this.props.editItem(this.state, this.props.Info._id)}>submit</button>
                    <span className='EmptySpace'> </span>
                    <button type="button" onClick={this.props.OpenClose}> Cancel </button>
                </div>
            </div>
        )
    }
}

class EditDescription extends React.Component{
    state = {
        Description: this.props.Description
    }

    handleChange = (event) => {
        const target = event.target
        const value = target.value
        const name = target.name

        this.setState({
            [name]: value
        })
    }

    Header(){
        return(
            <div className="PopUpWindowHeader">
                <h2>Edit List Description</h2>
            </div>
        )
    }

    DescriptionForm(){
        return(
            <form className="DescriptionForm">
                <label>
                    <strong>New description:  </strong>
                    <br/>
                    <br/>
                    <textarea name="Description" value = {this.state.description}
                              onChange={this.handleChange} className="DescriptionInputBox" rows="5" cols="10" wrap="soft"> </textarea>
                </label>
            </form>
        )
    }

    render() {
        return(
            <div className="PopUpWindow">
                {this.Header()}
                <br />
                {this.DescriptionForm()}
                <br />
                <div className="ButtonArray">
                    <button type="button" onClick={()=>this.props.editDescription(this.state.Description)}>submit</button>
                    <span className='EmptySpace'> </span>
                    <button type="button" onClick={this.props.OpenClose}> Cancel </button>
                </div>
            </div>
        )
    }

}


export default IndividualList;