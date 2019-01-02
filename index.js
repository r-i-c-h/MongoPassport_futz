const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 5000;

require('./config/passport')(passport);

/* Database Connection */
const getMongo = require('./config/keys');

const db = getMongo('rich');
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

/* EJS */
app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false })); // body-parser
app.use(
  session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use(express.static('public'));
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));

app.listen(PORT, console.log(`Server up on port ${PORT}`));
