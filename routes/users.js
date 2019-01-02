/* eslint-disable prettier/prettier */
const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');

const router = express.Router();

const User = require('../models/User');

/*** User Registration ***/
router.get('/register', (req, res) => res.render('register'));
// Register Handler
router.post('/register', (req, res) => {
  let errors = [];
  const { name, email, password, password2 } = req.body;
  // Mini Validation for all fields
  if (!name || !email || !password || !password2) {
    let errMsg = 'You forgot something. Please fill in all fields';
    errors.push({ msg: errMsg });
  }
  if (password !== password2) {
    let errMsg = 'Your passwords do not match';
    errors.push({ msg: errMsg });
  }
  if (password.length < 2) {
    errors.push({ msg: 'Password should be at least 2 chars' });
  }
  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email is already registered!' });
        res.render('register', { errors });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash( newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.error(err) );
          });
        });
      }
    });
  }
});

router.get('/login', (req, res) => res.render('login'));
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('sucess_msg','You have been logged out');
  res.redirect('/users/login');
});
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});


module.exports = router;