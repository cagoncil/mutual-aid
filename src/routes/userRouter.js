const path = require('path');
const express = require('express');
const router = new express.Router();
const User = require('../models/userModel'); // Require user model file
const userController = require('../controllers/userController');

// Prefers to route user to dashboard if authenticated, else re-routes user to homepage
router.get('/', userController.authenticateUser, (req, res) => {
  return res.status(200).sendFile(path.resolve(__dirname, '../../client/dashboard.html'));
});

// User registration
router.post('/register', userController.createUser, (req, res) => {
  console.log('User creation was successful');
  return res.redirect('/');
});

// User login
router.post('/login', userController.validateUser, (req, res) => {
  return res.redirect('/');
});

// Log out user
router.post('/logout', userController.authenticateUser, async (req, res) => {
  // console.log('req.user obj:', req.user);
  req.user.tokens = [];
  await req.user.save();
  // console.log('req.user obj after save:', req.user);
  return res.redirect('/');
  // Terminates user's session - seems unnecessary for now, but here just in case
    // req.session = null // deletes the cookie
    // req.session.destroy() // ends session after redirected to index.html
});

// Get user data
router.get('/profile', userController.authenticateUser, (req, res) => {
	return res.send({  user: req.user }) // req.user.email, req.user._id
});

router.get('/account', userController.authenticateUser, (req, res) => {
  return res.status(200).sendFile(path.resolve(__dirname, '../../client/account.html'));
});

// catch-all route handler for 404 errors
router.use((req, res) => {
  return res.status(404).sendFile(path.join(__dirname, '..', '..', 'client', '404.html'))
});

router.use((err, req, res, next) => { // NEEDS ALL PARAMS, IN EXACT ORDER
  if (err === 'Error: You must be logged in to view this page.') {
    return res.status(200).sendFile(path.resolve(__dirname, '../../client/index.html'));
  }
  
  console.log(`Global error handler caught error: ${err}`);
  
  let errMsg = err;
  if (err.errors !== undefined) {
    if (err.errors.hasOwnProperty('password') && err.errors.hasOwnProperty('name')) {
      // console.log('err.errors has both name and password properties');
      errMsg = 'Registration failed: the name and password fields cannot be empty.';
    } else if (err.errors.hasOwnProperty('password') && err.errors.password.kind === 'minlength') {
      // console.log("err.errors.hasOwnProperty('password')", err.errors.hasOwnProperty('password'));
      errMsg = 'Registration failed: your password must be at least 8 characters long.';
    } else if (err.errors.hasOwnProperty('password')) {
      // console.log("err.errors.hasOwnProperty('password')", err.errors.hasOwnProperty('password'));
      errMsg = `Registration failed: ${err.errors.password.message}`;
    } else if (err.errors.hasOwnProperty('name')) {
      // console.log("err.errors.hasOwnProperty('name')", err.errors.hasOwnProperty('name'));
      errMsg = `Registration failed: ${err.errors.name.message}`;
    } else if (err.errors.hasOwnProperty('email') && err.errors.email.message === 'Email is invalid.') {
      errMsg = `Registration failed: ${err}`;
    } else if (err.errors.hasOwnProperty('email')) {
      errMsg = `Registration failed: ${err.errors.email.message}`;
    }
    return res.status(400).send({ Error: err });  
  } else if (err.code === 11000) {
    errMsg = 'Registration failed: a user is already registered with that email.';
    return res.status(400).send({ Error: errMsg });
  }
  // if (err === 'Error: You must be logged in to view this page.') return res.redirect('/');
  return res.status(500).send(err);
});

module.exports = router;