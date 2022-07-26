const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator'); // use validator for complex validations like email, SSN, etc.
const bcrypt = require('bcryptjs');

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
});


// Hash the plain text password before saving
	// with 'save' as the first param, mongoose will execute this callback prior to calling save()
userSchema.pre('save', async function (next) {
	const user = this // user to be saved
	if (user.isModified('password')) { // Hash password if it's been created or modified by the user
		user.password = await bcrypt.hash(user.password, 8); // 2nd arg = # of hashing rounds to perform
		console.log('Password was successfully hashed');
	}
	next(); // needed to save the user
});
  
module.exports = mongoose.model('User', userSchema);