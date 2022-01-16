'use strict';
const log = console.log
const env = process.env.NODE_ENV 

const USE_TEST_USER = env !== 'production' && process.env.TEST_USER_ON 
const TEST_USER_ID = '5fb8b011b864666580b4efe3' 

// Express
const express = require('express')
const app = express();
const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

const path = require('path')

// enable CORS if in development, for React local development server to connect to the web server.
const cors = require('cors')
if (env !== 'production') { app.use(cors({
    origin: "http://localhost:3000",
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
    credentials: true,})) }

// Mongo and Mongoose
const { ObjectID} = require('mongodb')
const { mongoose } = require('./db/mongoose');
const { Restaurant } = require('./models/restaurant')
const { User } = require('./models/user')
const { List } = require('./models/list')
const { Friend } = require('./models/friend')


// express-session for managing user sessions
const session = require("express-session");
const MongoStore = require('connect-mongo')
const {UPDATE} = require("mongodb/lib/bulk/common"); 
const { devNull } = require('os');


function isMongoError(error) { 
    return typeof error === 'object' && error !== null && error.name === "MongoNetworkError"
}


// middleware for mongo connection error for routes that need it
const mongoChecker = (req, res, next) => {
    if (mongoose.connection.readyState != 1) {
        log('Issue with mongoose connection')
        res.status(500).send('Internal server error')
        return;
    } else {
        next()  
    }   
}

// Middleware for authentication of resources
const authenticate = (req, res, next) => {
	if (env !== 'production' && USE_TEST_USER)
		req.session.user = TEST_USER_ID 
		
    if (req.session.user) {
        User.findById(req.session.user).then((user) => {
            if (!user) {
                return Promise.reject()
            } else {
                req.user = user
                next()
            }
        }).catch((error) => {
            res.status(401).send("Unauthorized")
        })
    } else {
        res.status(401).send("Unauthorized")
    }
}

/*** Session handling **************************************/
// Create a session and session cookie
app.use(
    session({
        secret: process.env.SESSION_SECRET || "our hardcoded secret", // make a SESSION_SECRET environment variable when deploying (for example, on heroku)
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 6000000,
            httpOnly: true
        },
        // store the sessions on the database in production
        store: env === 'production' ? MongoStore.create({
                                                mongoUrl: 'mongodb+srv://mongo:food@cluster0.roupt.mongodb.net/test?retryWrites=true&w=majority' || process.env.MONGODB_URI || 'mongodb://localhost:27017/StudentAPI'
                                 }) : null
    })
);

/* POST request to create new user upon sign up
 Example body:
{
	"name": "NewUser",
	"username": "u1",
	"password": "password"
}
*/
app.post('/users/signup', mongoChecker, async (req, res) => {
	const { usernameInput, passwordInput } = req.body

	// Create new user
	const user = new User({
		username: usernameInput,
		password: passwordInput,
		name: "",
		isAdmin: "false",
		age: 0,
		nationality: "",
		favouriteFood: "",
		favouriteCuisine: "",
		bio: ""
	})

	// Save new User to the database
	try {
		const exists = await User.findOne({ username: usernameInput })
		if (exists){
			return res.json("taken")
		}
		const result = await user.save()
		const user_id = result._id
		const FriendList = new Friend({
			owner: user_id,
			existing_friends: [],
			potential_friends: []
		})
		const result2 = await FriendList.save()
		res.send(result)
	} catch(error) {
		log(error) // log server error to the console
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error') // something wrong with mongo/server
		} else {
			res.status(400).send('Bad Request') // 400 for bad request gets sent to client. something wrong with user request
		}
	}
})

/* A route to login and create a session
Example body:
{
	"usernameInput": "vw",
	"passwordInput": "pass"
}
*/
app.post("/users/login", mongoChecker, (req, res) => {
    const username = req.body.usernameInput;
	const password = req.body.passwordInput;

    User.findByUsernamePassword(username, password)
        .then(user => {
            req.session.user = user._id;
			req.session.username = user.username;
			
			if (user.isAdmin && user.isAdmin === "true"){
				req.session.admin = "true"
				res.send({ currentUser: user._id, admin: "true" });
				return
			}
			req.session.admin = "false"
			res.send({ currentUser: user._id, admin: "false" });
        })
        .catch(error => {
            res.status(400).send()
        });
});

// A route to check if a user is logged in on the session
app.get("/users/check-session", mongoChecker, (req, res) => {
    if (env !== 'production' && USE_TEST_USER) { // test user on development environment.
        req.session.user = TEST_USER_ID;
        res.send({ currentUser: TEST_USER_ID})
        return;
	}

    if (req.session.user) {
        res.send({ currentUser: req.session.user, admin: req.session.admin });
    } else {
        res.status(401).send();
    }
});

// Log out a user, and destroy session
app.get("/users/logout", mongoChecker, (req, res) => {
    req.session.destroy(error => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.send()
        }
    });
});


// get all the users
app.get('/get_all_users', mongoChecker, authenticate, async (req, res) => {
	try {
		const users = await User.find()
		users.sort(function(a, b){return a.username.toLowerCase().localeCompare(b.username.toLowerCase())})
		res.status(200).json(users)
	}catch (error){
		res.status(500).json({message: error.message})
	}

})


//delete a user by id and their corresponding lists
app.delete('/delete_user/:id', mongoChecker, authenticate, async (req, res) => {
	const user_id = req.params.id
	try{
		const target_user = await User.findById(user_id)
		if (target_user == null){
			res.status(404).send({message: "Cannot find the user"})
		}else{
			await target_user.remove()
			const lists = await List.findByUserId(user_id)
			lists.map(list => { list.remove() })

			// delete this user on potential friend list
			const FriendObjects = await Friend.find()
			for (let i = 0; i < FriendObjects.length; i++){
				let found_e = 0
				for (let j = 0; j < FriendObjects[i].existing_friends; j++){
					if (FriendObjects[i].existing_friends[j].equals(user_id)){
						found_e = 1
						await  FriendObjects[i].existing_friends.pull(FriendObjects[i].existing_friends[j])
						await  FriendObjects[i].save()
						break
					}
				}

				let found_p = 0
				for (let j = 0; j < FriendObjects[i].potential_friends; j++){
					if (FriendObjects[i].potential_friends[j].equals(user_id)){
						found_p = 1
						await  FriendObjects[i].potential_friends.pull(FriendObjects[i].potential_friends[j])
						await  FriendObjects[i].save()
						break
					}
				}
			}
			res.status(200).send({message: "Delete a user successfully"})
		}
	}catch(error){
		res.status(500).json({message: error.message})
	}

})


/* Create new empty list
*/
app.post('/create_list',  mongoChecker, authenticate, async (req, res) => {
	const {listName, category, permissions, listDescription} = req.body

	// Create new empty List
	const list = new List({
		listName: listName,
		category: category,
		listDescription: listDescription,
		userid: req.session.user,
		username: req.session.username,
		permissions: permissions
	})

	try {
		const result = await list.save()	
		res.send(result)
	} catch(error) {
		log(error) 
		if (isMongoError(error)) { 
			res.status(500).send('Internal server error') 
		} else {
			res.status(400).send('Bad Request')
		}
	}
})

// edit list description
// id is the list id
app.post('/edit_description/:id', mongoChecker, authenticate, async(req, res) => {
	const list_id = req.params.id
	try{
		let list = await List.findById(list_id)
		if (list == null){
			res.status(404).send({message: "cannot find the list"})
		}else{

			list.listDescription = req.body.listDescription
			const updated = await list.save()
			res.status(200).send(updated)
		}
	}catch(error){
		res.status(500).json({message: error.message})
	}

})

//get all lists for particular user
app.get('/get_all_lists', mongoChecker, authenticate, async (req, res) => {
	try {
		const lists = await List.find({ userid: req.session.user})
		const modifiedLists = lists.map(list => {return {id: list._id, listName: list.listName}})
		res.status(200).json(modifiedLists)
	}catch (error){a
		res.status(500).json({message: error.message})
	}

})

//get information for a specific list
app.get('/get_a_list/:id', mongoChecker, authenticate, async (req, res) => {
	let list
	try{
		list = await List.findById(req.params.id)
		list.items.sort(function(a, b){return a.rank-b.rank})
		if (list == null){
			res.status(404).send({message: "Cannot find the list"})
		}else{
			res.status(200).send(list)
		}
	}catch(error){
		res.status(500).json({message: error.message})
	}
})

	
//add an item to the list
/*
Request body expects:
{
	"rank": Number,
    "foodName": String,
    "notes": String
}
*/
// POST /add_item/id
// return the updated list
app.post('/add_item/:id', mongoChecker, authenticate, async (req, res) => {
	const item = {
		rank: req.body.rank,
		foodName: req.body.foodName,
		notes: req.body.notes
	}
	let list
	try{
		list = await List.findById(req.params.id)
		if (list == null){
			res.status(404).send({message: "Cannot find list"})
		}else{
			list.items.push(item)
			const updated = await list.save()
			updated.item_id = list.items[list.items.len - 1]
			res.status(200).send(updated)
		}
	}catch(error){
		res.status(500).json({message: error.message})
	}
})

//get information for a specific item
// GET /get_a_item/:id/:item_id
app.get('/get_a_item/:id/:item_id', mongoChecker, authenticate, async ( req, res) => {
	const list_id = req.params.id
	const item_id = req.params.item_id
	try{
		const list = await List.findById(list_id)
		if (list == null){
			res.status(404).send({message: "Cannot find the list"})
		}else{
			const item_list = list.items
			let found = 0
			for (let i = 0; i< item_list.length; i++){
				if (item_list[i]._id.equals(item_id)){
					found = 1
					res.status(200).send(item_list[i])
				}
			}
			if (found === 0){
				res.status(404).send({message: "Cannot find the item"})
			}
		}
	}catch(error){
		res.status(500).json({message: error.message})
	}

})


//delete an item to the list
// return the updated list
app.delete('/delete_item/:id/:item_id', mongoChecker, authenticate, async (req, res) => {
	const list_id = req.params.id
	const item_id = req.params.item_id
	try{
		const list = await List.findById(list_id)
		if (list == null){
			res.status(404).send({message: "Cannot find the list"})
		}else{
			const item_list = list.items
			let found = 0
			for (let i = 0; i< item_list.length; i++){
				if (item_list[i]._id.equals(item_id)){
					found = 1
					const deleted = item_list[i]
					await item_list.pull({_id: item_list[i]._id})
					const updated = await list.save()
					res.status(200).send(updated)

				}
			}
			if (found === 0){
				res.status(404).send({message: "Cannot find reservation"})
			}

		}
	}catch(error){
		res.status(500).json({message: error.message})
	}

})

//modify am item on the list
/*
Request body expects:
{
	"rank": Number,
    "foodName": String,
	"notes": String
}
*/
//return the updated list
app.post('/modify_item/:id/:listId', mongoChecker, authenticate, async(req, res) => {
	const list_id = req.params.id
	const item_id = req.params.listId
	try{
		const target_list = await List.findById(list_id)
		if (target_list == null){
			res.status(404).send({message: "Cannot find the list"})
		}else{
			const item_list = target_list.items
			let found = 0
			for (let i = 0; i< item_list.length; i++){
				if (item_list[i]._id.equals(item_id)){
					found = 1
					item_list[i].foodName = req.body.foodName
					item_list[i].notes = req.body.notes
					const updated = await target_list.save()
					res.status(200).send(updated)

				}
			}
			if (found === 0){
				res.status(404).send({message: "Cannot find item"})
			}

		}
	}catch(error){
		res.status(500).json({message: error.message})
	}

})


//delete a whole list
app.delete('/delete_list/:id', mongoChecker, authenticate, async (req, res) => {
	const list_id = req.params.id
	try{
		const target_list = await List.findById(list_id)
		if (target_list == null){
			res.status(404).send({message: "Cannot find the list"})
		}else{
			await target_list.remove()
			res.status(200).send({message: "Delete a list successfully"})
		}
	}catch(error){
		res.status(500).json({message: error.message})
	}

})

//------------ for friend

// add a friend list
// return the updated list
app.post('/create_friendList', mongoChecker, authenticate, async (req, res) => {
	const FriendList = new Friend({
		owner: req.body.user_id,
		existing_friends: [],
		potential_friends: []
	})
	try{
		const newFriendList = await FriendList.save()
		res.status(200).json(newFriendList)
	}catch(error){
		res.status(500).json({message: error.message})
	}
})



//get a specific friend List by id of friend object
app.get('/get_a_friend_by_friendID/:id', mongoChecker, authenticate, async (req, res) => {
	let friend
	try{
		friend = await Friend.findById(req.params.id)
		if (friend == null){
			res.status(404).send({message: "Cannot find the list"})
		}else{
			res.status(200).send(friend)
		}
	}catch(error){
		res.status(500).json({message: error.message})
	}
})



//get a specific friend List by id of user who owns the friend list
app.get('/get_a_friend', mongoChecker, authenticate, async (req, res) => {
	let friend
	try{
		friend = await Friend.findOne({owner: req.session.user})
		if (friend == null){
			res.status(404).send({message: "Cannot find the list"})
		}else{
			const existing_friends_id = friend.existing_friends
			const potential_friend_id = friend.potential_friends
			let existing_friends = []
			let potential_friends = []
			for (let i = 0; i < existing_friends_id.length; i++){
				const friend = await User.findById(existing_friends_id[i])
				existing_friends.push(friend.username)
			}
			for (let i = 0; i < potential_friend_id.length; i++){
				const friend =  await User.findById(potential_friend_id[i])
				potential_friends.push(friend.username)
			}
			res.status(200).send({
				"existing_friends": existing_friends,
				"potential_friends": potential_friends,
				"existing_friends_id": existing_friends_id,
				"potential_friends_id": potential_friend_id
			})
		}
	}catch(error){
		res.status(500).json({message: error.message})
	}
})


// send a friend request == add the id of the user(id2) sending the request to the potential friends list of the
// user who are going to accept/reject the friend
app.post('/add_potential_friend', mongoChecker, authenticate, async (req, res) => {
	try{
		const id2 = req.session.user
		const id1_user = await User.findOne({username: req.body.username })

		if (id1_user === null){
			res.status(404).send({message: "NOUSER"})
			return
		}
		const id1 = id1_user._id

		const Receiving_Friend_Object = await Friend.findOne({ owner: id1 })

		const Sending_Friend_Object = await Friend.findOne({ owner: id2 })

		const potentials = Sending_Friend_Object.potential_friends

		for(let i = 0; i < potentials.length; i++){
			if(potentials[i].equals(id1)){
				res.status(404).send({message: "USERONLIST"})
				return
			}
		}

		const exists = Sending_Friend_Object.existing_friends
		for(let i = 0; i < exists.length; i++){
			if(exists[i].equals(id1)){
				res.status(404).send({message: "USERONLIST"})
				return
			}
		}

		const potential_received = Receiving_Friend_Object.potential_friends
		for(let i = 0; i < potential_received.length; i++){
			if(potential_received[i].equals(id2)){
				res.status(404).send({message: "DOUBLE"})
				return
			}
		}

		if( !mongoose.Types.ObjectId.isValid(id2) ) {
			console.log("????")
		}
		Receiving_Friend_Object.potential_friends.push(id2)
		const updated = await Receiving_Friend_Object.save()
		updated.exist = "ncbdsciusdncodsco"

		res.status(200).send({message: "SUCCESS"})

	}catch(error){
		res.status(500).json({message: error.message})
	}
})

// accept a friend
// return the updated Friend Object of the user receiving the request
app.post('/add_existing_friend', mongoChecker, authenticate, async (req, res) => {
	const id1 = req.session.user
	const id2_user = await User.findOne({username: req.body.username })
	const id2 = id2_user._id

	try{
		// make sure id1 and id2 are both valid user id == they are in the user schema
		if (User.findById(id1) === null){
			res.status(404).send({message: "Cannot find the user receiving the request"})
			return
		}
		if (User.findById(id2) === null){
			res.status(404).send({message: "Cannot find the user sending the request"})
			return
		}


		const Sending_Friend_Object = await Friend.findOne({ owner: id2 })
		if (Sending_Friend_Object == null){
			res.status(404).send({message: "Cannot find the Friend object of the user sending the request"})
			return
		}
		Sending_Friend_Object.existing_friends.push(id1)
		await Sending_Friend_Object.save()

		const Receiving_Friend_Object = await Friend.findOne({ owner: id1 })
		if (Receiving_Friend_Object == null){
			res.status(404).send({message: "Cannot find the Friend object of the user sending the request"})
			return
		}
		if( !mongoose.Types.ObjectId.isValid(id2) ) {
			console.log("????")
		}
		Receiving_Friend_Object.existing_friends.push(id2)
		Receiving_Friend_Object.potential_friends.pull(id2)
		const friend = await Receiving_Friend_Object.save()
		const existing_friends_id = friend.existing_friends
		const potential_friend_id = friend.potential_friends
		let existing_friends = []
		let potential_friends = []
		for (let i = 0; i < existing_friends_id.length; i++){
			const friend = await User.findById(existing_friends_id[i])
			existing_friends.push(friend.username)
		}
		for (let i = 0; i < potential_friend_id.length; i++){
			const friend =  await User.findById(potential_friend_id[i])
			potential_friends.push(friend.username)
		}
		res.status(200).send({
			"existing_friends": existing_friends,
			"potential_friends": potential_friends,
			"existing_friends_id": existing_friends_id,
			"potential_friends_id": potential_friend_id
		})

	}catch(error){
		res.status(500).json({message: error.message})
	}
})


// delete an existing friend
// id1: the user that is deleting others
// id2: the one being deleted
app.delete('/delete_existing_friend', mongoChecker, authenticate, async (req, res) => {
	const id1 = req.session.user
	const id2_user = await User.findOne({username: req.body.username })
	const id2 = id2_user._id
	try{
		// make sure id1 and id2 are both valid user id == they are in the user schema
		if (User.findById(id1) === null){
			res.status(404).send({message: "Cannot find the user receiving the request"})
			return
		}
		if (User.findById(id2) === null){
			res.status(404).send({message: "Cannot find the user sending the request"})
			return
		}



		const Sending_Friend_Object = await Friend.findOne({ owner: id2 })
		if (Sending_Friend_Object == null){
			res.status(404).send({message: "Cannot find the Friend object of the user sending the request"})
			return
		}
		Sending_Friend_Object.existing_friends.pull(id1)
		await Sending_Friend_Object.save()


		const Receiving_Friend_Object = await Friend.findOne({ owner: id1 })
		if (Receiving_Friend_Object == null){
			res.status(404).send({message: "Cannot find the Friend object of the user sending the request"})
			return
		}
		if( !mongoose.Types.ObjectId.isValid(id2) ) {
			console.log("????")
		}
		Receiving_Friend_Object.existing_friends.pull(id2)
		const friend = await Receiving_Friend_Object.save()
		const existing_friends_id = friend.existing_friends
		const potential_friend_id = friend.potential_friends
		let existing_friends = []
		let potential_friends = []
		for (let i = 0; i < existing_friends_id.length; i++){
			const friend = await User.findById(existing_friends_id[i])
			existing_friends.push(friend.username)
		}
		for (let i = 0; i < potential_friend_id.length; i++){
			const friend =  await User.findById(potential_friend_id[i])
			potential_friends.push(friend.username)
		}
		res.status(200).send({
			"existing_friends": existing_friends,
			"potential_friends": potential_friends,
			"existing_friends_id": existing_friends_id,
			"potential_friends_id": potential_friend_id
		})

	}catch(error){
		res.status(500).json({message: error.message})
	}

})


// delete a potential friend == same as reject a friend request
app.delete('/delete_potential_friend', mongoChecker, authenticate, async (req, res) => {
	const id1 = req.session.user
	const id2_user = await User.findOne({username: req.body.username })
	const id2 = id2_user._id
	try{
		// make sure id1 and id2 are both valid user id == they are in the user schema
		if (User.findById(id1) === null){
			res.status(404).send({message: "Cannot find the user receiving the request"})
			return
		}
		if (User.findById(id2) === null){
			res.status(404).send({message: "Cannot find the user sending the request"})
			return
		}
		const Receiving_Friend_Object = await Friend.findOne({ owner: id1 })
		if (Receiving_Friend_Object == null){
			res.status(404).send({message: "Cannot find the Friend object of the user sending the request"})
			return
		}
		if( !mongoose.Types.ObjectId.isValid(id2) ) {
			console.log("????")
		}
		Receiving_Friend_Object.potential_friends.pull(id2)
		const friend = await Receiving_Friend_Object.save()
		const existing_friends_id = friend.existing_friends
		const potential_friend_id = friend.potential_friends
		let existing_friends = []
		let potential_friends = []
		for (let i = 0; i < existing_friends_id.length; i++){
			const friend = await User.findById(existing_friends_id[i])
			existing_friends.push(friend.username)
		}
		for (let i = 0; i < potential_friend_id.length; i++){
			const friend =  await User.findById(potential_friend_id[i])
			potential_friends.push(friend.username)
		}
		res.status(200).send({
			"existing_friends": existing_friends,
			"potential_friends": potential_friends,
			"existing_friends_id": existing_friends_id,
			"potential_friends_id": potential_friend_id
		})

	}catch(error){
		res.status(500).json({message: error.message})
	}

})


// Search endpoints
//Get all lists with that food item in it
app.get('/get_lists_food/:food', mongoChecker, authenticate, async (req, res) => {
	try{
		const lists = await List.find( { permissions: "public", items: { $elemMatch: {foodName: req.params.food.toString() } } } )
		if (lists=== []){
			res.status(404).send({message: "no lists"})
		}else{
			let listsForTable = []
			lists.map(list => {
				const listId = list._id;
				const listName = list.listName;
				const listDescript = list.listDescription;
				const username = list.username;
				const userId = list.userid;
				listsForTable.push({listId: listId, listName: listName, listDescript: listDescript, username: username, userId: userId})     })
			res.status(200).send(listsForTable)
		}
	}catch(error){
		res.status(500).json({message: error.message})
	}
})

// Search endpoints
//Get all lists with that food item in it
app.get('/get_lists_name/:name', mongoChecker, authenticate, async (req, res) => {
	try{
		const lists = await List.find({userid: req.session.user,  listName:req.params.name})
		if (lists.length === 0){
			res.status(200).send([])
		}else{
			const target_list = lists[0] // this should be a list object
			let target_items = []
			for (let i = 0; i < target_list.items.length; i++){
				target_items.push(target_list.items[i].foodName)
			}

			const all_lists = await List.find({permissions: "public"})
			let similar_lists = []
			for (let i = 0; i < all_lists.length; i++){
				const items = all_lists[i].items
				let count = 0
				for (let j = 0; j < items.length; j++){
					if(target_items.includes(items[j].foodName)){
						count += 1
					}

				}
				if (count >= 5){
					similar_lists.push(all_lists[i])
				}
			}
			let listsForTable = []
			similar_lists.map(list => {
				const listId = list._id;
				const listName = list.listName;
				const listDescript = list.listDescription;
				const username = list.username;
				const userId = list.userid;
				listsForTable.push({listId: listId, listName: listName, listDescript: listDescript, username: username, userId: userId})     })
			res.status(200).send(listsForTable)
		}
	}catch(error){
		res.status(500).json({message: error.message})
	}
})


// Popularity foods endpoints
app.get('/get_most_popular/:category', mongoChecker, authenticate, async (req, res) => {
	try{
		const lists = await List.find({ category: req.params.category})
		if (lists=== []){
			res.status(404).send({message: "no popular items"})
		}else{
			const allItems = []
	
			lists.map(list => {
				list.items.map(item => {
					allItems.push(item.foodName)
				})
			})

			const frequency = {}

			for (const i of allItems) {
				frequency[i] = frequency[i] ? frequency[i] + 1 : 1;
			}

			
			let sortedArray = [];
			for (let item in frequency) {
				sortedArray.push([item, frequency[item]]);
			}

			sortedArray.sort(function(a, b) {
				return b[1] - a[1];
			});


			const returnedSortedArray = sortedArray.slice(0, 3)

			let topThree = {}
			for (let item of returnedSortedArray){
				topThree[item[0]] = item[1]
			}
			res.status(200).send(topThree)
			
		}
	}catch(error){
		res.status(500).json({message: error.message})
	}
})


/* -------- Below are endpoints for the profile page ------ */
// Get information of a user by id (name, age, nationality, favorite food, davorite cuisine, about me)
app.get('/get_user_info/:id', mongoChecker, authenticate, async (req, res) => {
	
	const { id } = req.params
	try{
		const user = await User.findOne( { _id: id })
		if (!user){
			res.status(404).send({ message: "user not found" })
		}
		else{
			res.status(200).send(user)
		}
	}catch(error){
		res.status(500).json({message: error.message})
	}
})

app.post('/change_user_info/:id', mongoChecker, authenticate, async (req, res) => {
	const { id } = req.params
	try {
		const user = await User.findOne( { _id: id })
		if (!user){
			res.status(404).send({ message: "user not found" })
		}
		else{
			user.name = req.body.name
			user.age = req.body.age
			user.nationality = req.body.nationality
			user.favouriteFood = req.body.favouriteFood
			user.favouriteCuisine = req.body.favouriteCuisine
			user.bio = req.body.bio
			user.save()
			res.status(200).send(user)
		}
		
	} catch (error) {
		
	}
})
//
// /// For the post
// // The code are from Mark posted on Piazza
// mongoose.set('useFindAndModify', false); // for some deprecation issues
// const { Image, Post } = require("./models/post");
// const multipart = require('connect-multiparty');
// const multipartMiddleware = multipart();
// const cloudinary = require('cloudinary');
// cloudinary.config({
// 	cloud_name: 'dmyle9elq',
// 	api_key: '753119981335235',
// 	api_secret: 'f2we8R1kyZgn_fQ-il67wtaSAqk'
// });
//
// /*** Image API Routes below ************************************/
//
// // a POST route to *create* an image
// app.post("/images", multipartMiddleware, (req, res) => {
//
// 	// Use uploader.upload API to upload image to cloudinary server.
// 	cloudinary.uploader.upload(
// 		req.files.image.path, // req.files contains uploaded files
// 		function (result) {
//
// 			// Create a new image using the Image mongoose model
// 			var img = new Image({
// 				image_id: result.public_id, // image id on cloudinary server
// 				image_url: result.url, // image url on cloudinary server
// 				created_at: new Date(),
// 			});
//
// 			// Save image to the database
// 			img.save().then(
// 				saveRes => {
// 					res.send(saveRes);
// 				},
// 				error => {
// 					res.status(400).send(error); // 400 for bad request
// 				}
// 			);
// 		});
// });
//
// // a GET route to get all images
// app.get("/images", (req, res) => {
// 	Image.find().then(
// 		images => {
// 			res.send({ images }); // can wrap in object if want to add more properties
// 		},
// 		error => {
// 			res.status(500).send(error); // server error
// 		}
// 	);
// });
//
// /// a DELETE route to remove an image by its id.
// app.delete("/images/:imageId", (req, res) => {
// 	const imageId = req.params.imageId;
//
// 	// Delete an image by its id (NOT the database ID, but its id on the cloudinary server)
// 	// on the cloudinary server
// 	cloudinary.uploader.destroy(imageId, function (result) {
//
// 		// Delete the image from the database
// 		Image.findOneAndRemove({ image_id: imageId })
// 			.then(img => {
// 				if (!img) {
// 					res.status(404).send();
// 				} else {
// 					res.send(img);
// 				}
// 			})
// 			.catch(error => {
// 				res.status(500).send(); // server error, could not delete.
// 			});
// 	});
// });





app.use(express.static(path.join(__dirname, "/client/build")));

// All routes other than above will go to index.html
app.get("*", (req, res) => {
     const goodPageRoutes = ["/", "/login", "/main", "/logout", "/search", "/individualList", "/friends", "/allUsers", "/setting", "/mainAdmin", "/profile"];
    if (!goodPageRoutes.includes(req.url)) {
        res.status(404);
    }

    // send index.html
    res.sendFile(path.join(__dirname, "/client/build/index.html"));
});

////////// DO NOT CHANGE THE CODE OR PORT NUMBER BELOW
const port = process.env.PORT || 5000
app.listen(port, () => {
	log(`Listening on port ${port}...`)
});
