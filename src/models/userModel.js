const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator'); // use validator for complex validations like email, SSN, etc.
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // for authenticateUser

const userSchema = new Schema({
    name: {
		type: String,
		required: true,
		trim: true
	},
	email: {
		type: String,
		unique: true, // users cannot register unique email more than once
		required: true,
		trim: true,
		lowercase: true,
		validate(value) {
			if (!validator.isEmail(value)) {
				throw new Error('The email you entered is invalid. Please try a different email.')
			}
		}
	},
	password: {
		type: String,
		required: true,
		trim: true,
		minlength: 8,
		validate(value) {
		if (value.toLowerCase().includes('password')) {
				throw new Error(`Cannot use the word 'password' within your password.`);
			}
		}
	},
	tokens: [{
		token: {
			type: String,
			required: true
		}
	}]
});

// Hash the plain text password before saving
	// with 'save' as the first param, mongoose will execute this callback prior to calling save()
userSchema.pre('save', async function (next) {
	const user = this // user to be saved
	if (user.isModified('password')) { // Hash password if it's been created or modified by the user
		user.password = await bcrypt.hash(user.password, 10); // 2nd arg = # of hashing rounds to perform
		console.log('Password was successfully hashed');
	}
	next(); // needed to save the user
});

// Generate JSON Web Token to authenticate user
userSchema.methods.generateAuthToken = async function() {
	const user = this; // 'this' is a specific instance of a user
	const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
	user.tokens = user.tokens.concat({ token });
	await user.save();
	return token;
}

// Locate user within user database for validation purposes
userSchema.statics.findByCredentials = async (email, password) => {
	// find user by email and throw error if email does not exist in the database
	const user = await User.findOne({ email });
	if (!user) throw new Error('Invalid credentials. Unable to login.');
	// verify password using bcrypt's compare function and throw error if password is incorrect
	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) throw new Error('Invalid credentials. Unable to login.');
	return user; // return user only if email and password are both correct
}
  
const User = mongoose.model('User', userSchema);

module.exports = User;