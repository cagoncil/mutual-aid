const jwt = require('jsonwebtoken');
require('dotenv').config(); 
const User = require('../models/userModel.js');

const authController = {};

authController.validateUser = async (req, res, next) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    console.log('Login credentials validated! Generating auth token...');
    const token = await user.generateAuthToken();
    res.cookie('auth_token', token);
    return next();
  } catch (err) {
    if (err instanceof Error) err = err.toString();
    return next(err);
  };
};

authController.authenticateUser = async (req, res, next) => {
	try {
		const token = req.cookies.auth_token;
		const decoded = jwt.verify(token, process.env.JWT_SECRET); // ensure token hasn't expired
		const user = await User.findOne({ _id: decoded._id, 'tokens.token': token }); // grab user from database
    // console.log(user);
		if (!user) throw new Error('You must be logged in to view this page.'); // triggers catch(e) below
    // console.log('User authentication was successful');
		res.locals.token = token; // added for logout
		res.locals.user = user;
		return next(); // user authenticated correctly
	} catch (err) {
    if (err instanceof Error) err = err.toString();
		// res.status(401).send({ error: 'Please authenticate.' })
    return next(err);
		// res.redirect('/') // Redirects to homepage
	};
};

authController.logoutUser = async (req, res, next) => {
  try {
    const { user } = res.locals;
    user.tokens = [];
    await user.save();
    return next();
  } catch (err) {
    if (err instanceof Error) err = err.toString();
    return next(err);
  };  
}

module.exports = authController;