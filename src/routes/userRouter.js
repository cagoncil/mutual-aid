const path = require('path');
const express = require('express');
const router = new express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/userModel'); // Require user model file
const userController = require('../controllers/userController');

// Prefers to route user to dashboard if authenticated, else re-routes user to homepage
router.get('/', userController.authenticateUser, (req, res) => {
  return res.status(200).sendFile(path.resolve(__dirname, '../../client/dashboard.html'));
});

// ===== CREATE =====
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
  const { user } = res.locals;
  user.tokens = [];
  console.log('user obj before save:', user);
  await user.save();
  console.log('user obj after save:', user);
  return res.redirect('/');
});

// ===== READ =====
// Get user data from API in route /profile
router.get('/profile', userController.authenticateUser, (req, res) => {
  const { user } = res.locals;
	return res.send({  user });
});

// Go to the account page to edit settings
router.get('/account', userController.authenticateUser, (req, res) => {
  return res.status(200).sendFile(path.resolve(__dirname, '../../client/account.html'));
});

// Go to the nearby clinics map page
router.get('/clinics', userController.authenticateUser, (req, res) => {
  return res.status(200).sendFile(path.resolve(__dirname, '../../client/clinics.html'));
});

// Go to the state laws map page
router.get('/statelaws', userController.authenticateUser, (req, res) => {
  return res.status(200).sendFile(path.resolve(__dirname, '../../client/statelaws.html'));
});

// Go to the community support page
router.get('/help', userController.authenticateUser, (req, res) => {
  return res.status(200).sendFile(path.resolve(__dirname, '../../client/help.html'));
});

// ===== UPDATE =====
router.patch('/profile', userController.authenticateUser, async (req, res, next) => {
  console.log('Processing user update request...');

	const updates = Object.keys(req.body);
  const updatedItem = updates[0];
	const allowedUpdates = ['name', 'email', 'password', 'oldPassword'];

	const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
	if (!isValidOperation) return next({ error: 'Invalid update.' });

	try {
    const { user } = res.locals;
		if (updatedItem === 'email') {
      // Update email
			const authenticated = await bcrypt.compare(req.body.password, user.password);
			if (authenticated) user.email = req.body.email; // update the email if the password matches
			else throw new Error('The password you entered was invalid. The email was not successfully updated.');
		} else if (updatedItem === 'oldPassword') {
      // Update password
			const authenticated = await bcrypt.compare(req.body.oldPassword, user.password);
      const matchingInputs = req.body.password[0] === req.body.password[1];
      // update "password" if the current (old) password matches AND the inputs for the new password match
			if (authenticated && matchingInputs) user.password = req.body.password[0]; 
			else throw new Error('Your password could not be updated. The current password you entered was invalid or you did not correctly confirm the same new password.');
		} else { // Update other fields that aren't data-sensitive/don't require password validation
			updates.forEach((update) => user[update] = req.body[update]);
		};
		await user.save();
		return res.redirect('/account');
	} catch (err) {
    if (err instanceof Error) err = err.toString();
    return next(err);
	};
});

// ===== DELETE =====
router.delete('/profile', userController.authenticateUser, async (req, res, next) => {
  const { user } = res.locals;
	const authenticated = await bcrypt.compare(req.body.password, user.password);
	try {
		if (authenticated) { // If password is valid
			await user.remove();
			res.redirect('/');
		}
    else throw new Error('Password entered was invalid. Account deletion was unsuccessful.');
	} catch (err) {
    if (err instanceof Error) err = err.toString();
		return next(err);
	};

});


router.get('/error', (req, res) => {
  return res.status(200).sendFile(path.resolve(__dirname, '../../client/error.html'));
})







// catch-all route handler for 404 errors
router.use((req, res) => {
  return res.status(404).sendFile(path.join(__dirname, '..', '..', 'client', '404.html'))
});

router.use((err, req, res, next) => { // NEEDS ALL PARAMS, IN EXACT ORDER
  if (err === 'Error: You must be logged in to view this page.' || err === 'JsonWebTokenError: jwt must be provided') {
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
    } else if (err.errors.hasOwnProperty('email') && err.name === 'ValidatorError') {
      errMsg = `Registration failed: The email you entered is invalid. Please try a different email.`;
    } else if (err.errors.hasOwnProperty('email')) {
      errMsg = `Registration failed: ${err.errors.email.message}`;
    }
    return res.status(400).send({ err });  
  } else if (err.code === 11000) {
    errMsg = 'Registration failed: a user is already registered with that email.';
    // return res.status(400).send({ Error: errMsg });
    return res.status(400).redirect('/error?' + JSON.stringify(errMsg));
  }
  if (err === 'Error: You must be logged in to view this page.') return res.redirect('/');
  // return res.status(500).send(err);
  return res.status(500).redirect('/error?' + JSON.stringify(err));
});

module.exports = router;