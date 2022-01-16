const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const FriendSchema = new mongoose.Schema({
    owner: ObjectId, // the user id of the owner of this friend list
    existing_friends: [ObjectId], // a list of user id of existing friends
    potential_friends: [ObjectId] // a list of user id of potential friends
});

const Friend = mongoose.model('Friend', FriendSchema);

module.exports = {Friend};
