const mongoose = require('mongoose');

const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    name: String,
    username: String,
	password: String,
	isAdmin: String,
	age: Number,
	nationality: String,
	favouriteFood: String,
	favouriteCuisine: String,
	bio: String


});

UserSchema.statics.findByUsernamePassword = function(username, password) {
	const User = this 

	return User.findOne({ username: username }).then((user) => {
		console.log(user)
		if (!user) {
			return Promise.reject() 
		}

		return new Promise((resolve, reject) => {
			bcrypt.compare(password, user.password, (err, result) => {
				if (result) {
					resolve(user)
				} else {
					reject()
				}
			}
			)
		})
	})
}


UserSchema.pre('save', function(next) {
	const user = this; 
	if (user.isModified('password')) {
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				user.password = hash
				next()
			})
		})
	} else {
		next()
	}
})

const User = mongoose.model('User', UserSchema);

module.exports = { User };
