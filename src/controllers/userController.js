const bcrypt = require('bcryptjs');
const User = require('../models/userModel.js');


const userController = {};

userController.createUser = async (req, res, next) => {
  // console.log('Incoming user creation request:', req.body);
  try {
    const newUser = await User.create(req.body);
    const token = await newUser.generateAuthToken();
    console.log('auth_token:', token);
    res.cookie('auth_token', token);
    return next();
  } catch (err) {
    if (err instanceof Error) err = err.toString();
    return next(err);
  };  
};

userController.updateUser = async (req, res, next) => {

  const updates = Object.keys(req.body);
  const updatedItem = updates[0];
  const allowedUpdates = ['name', 'email', 'password', 'oldPassword'];

  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) return next({ error: 'Invalid update.' });

  try {
    const { user } = res.locals;
    if (updatedItem === 'email') {
      // Update email
      const authenticated = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (authenticated) user.email = req.body.email;
      // update the email if the password matches
      else {
        throw new Error(
          'The password you entered was invalid. The email was not successfully updated.'
        );
      }
    } else if (updatedItem === 'oldPassword') {
      // Update password
      const authenticated = await bcrypt.compare(
        req.body.oldPassword,
        user.password
      );
      const matchingInputs = req.body.password[0] === req.body.password[1];
      
      // update "password" if the current (old) password matches AND the inputs for the new password match
      if (authenticated && matchingInputs) user.password = req.body.password[0];
      else {
        throw new Error(
          'Your password could not be updated. The current password you entered was invalid or you did not correctly confirm the same new password.'
        );
      }
    } else {
      // Update other fields that aren't data-sensitive/don't require password validation
      updates.forEach(update => (user[update] = req.body[update]));
    }
    await user.save();
    return next();
  } catch (err) {
    if (err instanceof Error) err = err.toString();
    return next(err);
  }
}

userController.deleteUser = async (req, res, next) => {
  const { user } = res.locals;
  const authenticated = await bcrypt.compare(
    req.body.password,
    user.password
  );
  try {
    if (authenticated) {
      await user.remove();
      return next();
    } else {
      throw new Error(
        'Password entered was invalid. Account deletion was unsuccessful.'
      );
    }
  } catch (err) {
    if (err instanceof Error) err = err.toString();
    return next(err);
  }
}

module.exports = userController;