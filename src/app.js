const path = require('path');
const express = require('express');
const mongoose = require('mongoose'); // Connect to MongoDB database
const cookieParser = require('cookie-parser'); // Use cookies to store the JSON web tokens on the frontend
const methodOverride = require('method-override'); // Allows HTML forms to process PATCH/DELETE requests

// load user router modules into the app
const userRouter = require('./routes/userRouter');

const port = process.env.PORT || 3000; // heroku port || localhost
const app = express();
require('dotenv').config();

// const password = process.env.PASSWORD; // mongoDB instance password
const mongoURI = process.env.MONGODB_URI;
// const mongoURI = process.env.NODE_ENV || process.env.MONGODB_URI || `mongodb+srv://cagoncil:${password}@mutualaid.nbeg1.mongodb.net/?retryWrites=true&w=majority`;
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

app.listen(port, () => {
	console.log('Server is up on port ' + port);
})