const path = require('path');
const express = require('express');
// const router = express.Router();
const mongoose = require('mongoose'); // Connect to MongoDB database
const cookieParser = require('cookie-parser'); // Use cookies to store the JSON web tokens on the frontend
const methodOverride = require('method-override'); // Allows HTML forms to process PATCH/DELETE requests

// Load user model, user controller, and user router modules into the app
// const User = require('./models/userModel');
// const userController = require('./controllers/userController');
const userRouter = require('./routes/userRouter');

const port = process.env.PORT || 3000; // heroku port || localhost
const app = express();
require('dotenv').config();

const password = process.env.PASSWORD;
const mongoURI = process.env.NODE_ENV || process.env.MONGODB_URI || `mongodb+srv://cagoncil:${password}@mutualaid.nbeg1.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once('open', () => {
  console.log('Connected to Database');
});


// handle parsing request body
app.use(express.json());  // Recognizes incoming req.object from a POST request as a JSON object
app.use(express.urlencoded({ extended: false }));  // Parses data sent via forms from the frontend
app.use(cookieParser()); // Parses cookies sent with the forms from the frontend
app.use(methodOverride('_method')); // Allows HTML forms to process PATCH/DELETE requests
app.use('/client', express.static(path.join(__dirname, '..', 'client'))); // Serves static files (images, css, js...) on the frontend

app.use(userRouter);

// Delete soon!
// // route handler to respond with main app
// app.get('/', (req, res) => {
//   return res.status(200).sendFile(path.resolve(__dirname, '../client/index.html'));
// });

// // User Registration
// app.post('/welcome', userController.createUser, (req, res) => {
//   console.log('User creation successful');
//   // res.status(201).redirect('/dashboard');
//   return res.status(201).sendFile(path.resolve(__dirname, '../client/dashboard.html'));
// });

// // User Login
// app.post('/dashboard', (req, res) => {
//   console.log(req.body);
//   return res.status(200).sendFile(path.resolve(__dirname, '../client/dashboard.html'));
// });

// app.get('/account', (req, res) => {
//   return res.status(200).sendFile(path.resolve(__dirname, '../client/dashboard.html'));
// });

// // catch-all route handler for 404 errors
// app.use((req, res) => {
//   return res.status(404).sendFile(path.join(__dirname, '..', 'client', '404.html'))
// });

// app.use((err, req, res, next) => { // NEEDS ALL PARAMS, IN EXACT ORDER
//   console.log('console.logged error', err, 'end of console.logged error')
//   if (err.errors !== undefined) {
//     if (err.errors.hasOwnProperty('password') && err.errors.hasOwnProperty('name')) {
//       // console.log('err.errors has both name and password properties');
//       errMsg = 'Registration failed: the name and password fields cannot be empty.';
//     } else if (err.errors.hasOwnProperty('password') && err.errors.password.kind === 'minlength') {
//       // console.log("err.errors.hasOwnProperty('password')", err.errors.hasOwnProperty('password'));
//       errMsg = 'Registration failed: your password must be at least 8 characters long.';
//     } else if (err.errors.hasOwnProperty('password')) {
//       // console.log("err.errors.hasOwnProperty('password')", err.errors.hasOwnProperty('password'));
//       errMsg = `Registration failed: ${err.errors.password.message}`;
//     } else if (err.errors.hasOwnProperty('name')) {
//       // console.log("err.errors.hasOwnProperty('name')", err.errors.hasOwnProperty('name'));
//       errMsg = `Registration failed: ${err.errors.name.message}`;
//     } else if (err.errors.hasOwnProperty('email') && err.errors.email.message === 'Email is invalid.') {
//       errMsg = `Registration failed: ${err}`;
//     } else if (err.errors.hasOwnProperty('email')) {
//       errMsg = `Registration failed: ${err.errors.email.message}`;
//     }
//     return res.status(400).send({ Error: errMsg });
//   } else if (err.code === 11000) {
//     errMsg = 'Registration failed: a user is already registered with that email.';
//     return res.status(400).send({ Error: errMsg });
//   }
//   return res.status(500).send(err);
// });

app.listen(port, () => {
	console.log('Server is up on port ' + port)
})