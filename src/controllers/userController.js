const jwt = require('jsonwebtoken'); // for authenticateUser
require('dotenv').config(); // for authenticateUser
const User = require('../models/userModel.js');

const userController = {};

userController.createUser = async (req, res, next) => {
  // console.log('Incoming user creation request:', req.body);
  try {
		const newUser = await User.create(req.body);
    await newUser.save();
		const token = await newUser.generateAuthToken();
    console.log('auth_token:', token);
		res.cookie('auth_token', token);
		return next();
  } catch (err) {
		return next(err);
  };  
};

userController.validateUser = async (req, res, next) => {
  console.log('Incoming user login request:', req.body);
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    console.log('Login credentials validated! Generating auth token...');
    const token = await user.generateAuthToken();
    // console.log('auth_token:', token);
    res.cookie('auth_token', token);
    return next();
  } catch (err) {
    if (err instanceof Error) err = err.toString();
    return next(err);
  };
};

userController.authenticateUser = async (req, res, next) => {
  // console.log('authenticating the following user:', req.body);
	try {
		const token = req.cookies.auth_token;
		const decoded = jwt.verify(token, process.env.JWT_SECRET); // ensure token hasn't expired
		const user = await User.findOne({ _id: decoded._id, 'tokens.token': token }); // grab user from database

		if (!user) throw new Error('You must be logged in to view this page.'); // triggers catch(e) below
    console.log('User authentication was successful');

		req.token = token; // added for logout
		req.user = user;
		next(); // user authenticated correctly
	} catch (err) {
    if (err instanceof Error) err = err.toString();
		// res.status(401).send({ error: 'Please authenticate.' })
    next(err);
		// res.redirect('/') // Redirects to homepage
	};
};

module.exports = userController;