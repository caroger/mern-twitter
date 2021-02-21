const mongoose = require('mongoose');
const passport = require('passport');
const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const users = require('./routes/api/users');
const tweets = require('./routes/api/tweets');
// for post man
const db = require('./config/keys').mongoURI;

// looking for ports in production env
const port = process.env.PORT || 5000;

// connect to db
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log('Connected to MangoDB successfully'))
  .catch((err) => console.log(err));

// enable POSTMAN testing
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

app.use(passport.initialize());
require('./config/passport')(passport);

app.listen(port, () => console.log(`Server is running on port ${port}`));
app.use('/api/users', users);
app.use('/api/tweets', tweets);
