const User = require('../models/userModel.js');

const userController = {};

userController.createUser = async (req, res, next) => {
  console.log(req.body);
  
	// const existingUser = await User.findOne({ email: user.email });
	// if (existingUser) {
	// 	console.log('true, user exists');
	// 	return next("That email is already registered with us.");
	// }
  try {
		const newUser = await User.create(req.body);
    await newUser.save();
		// const token = await user.generateAuthToken();
		// res.cookie('auth_token', token);
		return next();
  } catch (err) {
		return next(err)
  }  
};

module.exports = userController;