const path = require('path');
const express = require('express');
const router = new express.Router();

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

// Prefers to route user to dashboard if authenticated, else re-routes user to homepage
router.get('/', authController.authenticateUser, (req, res) => {
  return res.status(200).sendFile(path.resolve(__dirname, '../../client/dashboard.html'));
});

// ===== CREATE =====
// User registration
router.post('/register', userController.createUser, authController.validateUser, (req, res) => {
  return res.redirect('/');
});

// User login
router.post('/login', authController.validateUser, (req, res) => {
  return res.redirect('/');
});

// Log out user
router.post('/logout', authController.authenticateUser, authController.logoutUser, (req, res) => {
  return res.redirect('/');
});

// ===== READ =====
router.get('/profile', authController.authenticateUser, (req, res) => {
  const { user } = res.locals;
  return res.status(200).json({ user });
});

// Go to the account page to edit settings
router.get('/account', authController.authenticateUser, (req, res) => {
  return res.status(200).sendFile(path.resolve(__dirname, '../../client/account.html'));
});

// Go to the nearby clinics map page
router.get('/clinics', authController.authenticateUser, (req, res) => {
  return res.status(200).sendFile(path.resolve(__dirname, '../../client/clinics.html'));
});

// Go to the state laws map page
router.get('/statelaws', authController.authenticateUser, (req, res) => {
  return res.status(200).sendFile(path.resolve(__dirname, '../../client/statelaws.html'));
});

// Go to the community support page
router.get('/help', authController.authenticateUser, (req, res) => {
  return res.status(200).sendFile(path.resolve(__dirname, '../../client/help.html'));
});

// ===== UPDATE =====
router.patch('/profile', authController.authenticateUser, userController.updateUser, (req, res) => {
  return res.redirect('/account');
});

// ===== DELETE =====
router.delete('/profile', authController.authenticateUser, userController.deleteUser, (req, res) => {
  return res.redirect('/');
});

/* This is a route handler for the error page. */
router.get('/error', (req, res) => {
  return res.status(200).sendFile(path.resolve(__dirname, '../../client/error.html'));
});

// catch-all route handler for 404 errors
router.use((req, res) => {
  return res.status(404).sendFile(path.join(__dirname, '..', '..', 'client', '404.html'));
});

router.use((err, req, res, next) => {
  if (
    err === 'Error: You must be logged in to view this page.' ||
    err === 'JsonWebTokenError: jwt must be provided' ||
    err === 'JsonWebTokenError: invalid signature'
  ) {
    return res.status(200).sendFile(path.resolve(__dirname, '../../client/index.html'));
  }

  console.log(`Global error handler caught error: ${err}`);

  let errMsg = err;
  if (err.errors) {
    if (
      err.errors.hasOwnProperty('password') &&
      err.errors.hasOwnProperty('name')
    ) {
      // console.log('err.errors has both name and password properties');
      errMsg =
        'Registration failed: the name and password fields cannot be empty.';
    } else if (
      err.errors.hasOwnProperty('password') &&
      err.errors.password.kind === 'minlength'
    ) {
      // console.log("err.errors.hasOwnProperty('password')", err.errors.hasOwnProperty('password'));
      errMsg =
        'Registration failed: your password must be at least 8 characters long.';
    } else if (err.errors.hasOwnProperty('password')) {
      // console.log("err.errors.hasOwnProperty('password')", err.errors.hasOwnProperty('password'));
      errMsg = `Registration failed: ${err.errors.password.message}`;
    } else if (err.errors.hasOwnProperty('name')) {
      // console.log("err.errors.hasOwnProperty('name')", err.errors.hasOwnProperty('name'));
      errMsg = `Registration failed: ${err.errors.name.message}`;
    } else if (
      err.errors.hasOwnProperty('email') &&
      err.name === 'ValidatorError'
    ) {
      errMsg = `Registration failed: The email you entered is invalid. Please try a different email.`;
    } else if (err.errors.hasOwnProperty('email')) {
      errMsg = `Registration failed: ${err.errors.email.message}`;
    }
    return res.status(400).send({ err });
  } else if (err.code === 11000) {
    errMsg = 'Registration failed: a user is already registered with that email.';
    return res.status(400).redirect('/error?' + JSON.stringify(errMsg));
  } else {
    return res.status(500).redirect('/error?' + JSON.stringify(err));
  }
});

module.exports = router;
