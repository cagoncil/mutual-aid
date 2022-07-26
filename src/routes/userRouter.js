const path = require('path');
const express = require('express');
const bcrypt = require('bcryptjs'); // Require bcrypt to confirm password for account deletion
const User = require('../models/userModel'); // Require user model file
const userController = require('../controllers/userController');
const router = new express.Router()

// route handler to respond with main app
router.get('/', (req, res) => {
    return res.status(200).sendFile(path.resolve(__dirname, '../../client/index.html'));
  });
  
  // User Registration
  router.post('/welcome', userController.createUser, (req, res) => {
    console.log('User creation was successful');
    // res.status(201).redirect('/dashboard');
    return res.status(201).sendFile(path.resolve(__dirname, '../../client/dashboard.html'));
  });
  
  // User Login
  router.post('/dashboard', (req, res) => {
    console.log(req.body);
    return res.status(200).sendFile(path.resolve(__dirname, '../../client/dashboard.html'));
  });
  
  router.get('/account', (req, res) => {
    return res.status(200).sendFile(path.resolve(__dirname, '../../client/dashboard.html'));
  });
  
  // catch-all route handler for 404 errors
  router.use((req, res) => {
    return res.status(404).sendFile(path.join(__dirname, '..', '..', 'client', '404.html'))
  });
  
  router.use((err, req, res, next) => { // NEEDS ALL PARAMS, IN EXACT ORDER
    // console.log('console.logged error', err, 'end of console.logged error')
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
      return res.status(400).send({ Error: errMsg });
    } else if (err.code === 11000) {
      errMsg = 'Registration failed: a user is already registered with that email.';
      return res.status(400).send({ Error: errMsg });
    }
    return res.status(500).send(err);
  });

  module.exports = router;