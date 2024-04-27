const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const cors = require('cors'); // Make sure to install this package

const app = express();

app.use(cors()); // Use CORS middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(session({
  secret: 'your secret key',
  resave: false,
  saveUninitialized: false,
}));

mongoose.connect('mongodb+srv://shashank.jppsfbf.mongodb.net/" --apiVersion 1 --username zacky')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
  const username = req.session.username;
  if (username) {
    res.send(`Welcome to your dashboard, ${username}!`);
  } else {
    res.send('Please log in.');
  }
});

app.post('/signup', async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    res.status(400).send('Passwords do not match.');
    return;
  }

  const user = await User.findOne({ email: email });
  if (user) {
    res.status(400).send('Email already registered.');
    return;
  }

  const newUser = new User({ firstName, lastName, email, password });
  await newUser.save();
  res.send('Signup successful!');
});

app.post('/login', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  const user = await User.findOne({ username: username });
  if (!user || user.password !== password) {
    res.send('Invalid username or password.');
  } else {
    req.session.username = username;
    res.send('Login successful!');
  }
});

app.listen(5000, () => console.log('Server started on port 5000'));
