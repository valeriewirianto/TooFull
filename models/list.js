const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');



const ItemSchema = new mongoose.Schema({
    rank: Number,
    foodName: String,
    notes: String
});

// Reservations will be embedded in the Restaurant model
const ListSchema = new mongoose.Schema({
    listName: String,
    category: String,
    listDescription: String,
    userid: ObjectId,
    username: String,
    permissions: String,
    items: [ItemSchema]
});

ListSchema.statics.findByUserId= function(userid) {
	const List = this 

	return List.find({ userid: userid }).then((list) => {
		if (!list) {
			return Promise.reject()  // a rejected promise
        }
        return list
	})
}



const List = mongoose.model('List', ListSchema);

module.exports = {List};
