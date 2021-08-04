var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Product = require('../models/products');
/* GET users listing. */
router.get('/', function (req, res, next) {
  console.log(req.session);
  res.render('logged');
});
router.get('/register', function (req, res, next) {
  res.render('register');
});
router.post('/register', (req, res, next) => {
  User.create(req.body, (err, user) => {
    res.redirect('/users/login');
  });
});
router.get('/login', function (req, res, next) {
  res.render('login');
});
router.get('/loginSuccess', function (req, res, next) {
  let email = req.session.email;
  Product.find({}, (err, products) => {
    if (err) return next(err);
    User.findOne({ email }, (err, user) => {
      var fullName = user.firstname;
      res.render('loginSuccess', { fullName: fullName, products: products });
    });
  });
});
router.post('/login', (req, res, next) => {
  var { email, password } = req.body;
  console.log(email, password);
  if (!email || !password) {
    return res.redirect('/users/login');
  }
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      return res.redirect('/users/login');
    }
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      console.log(result);
      if (!result) {
        console.log(password);
        return res.redirect('/users/login');
      }
      req.session.userId = user.id;
      req.session.email = user.email;
      res.redirect('/users/loginSuccess');
    });
  });
});
router.get('/logout', function (req, res, next) {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/');
});
router.get('/all', function (req, res, next) {
  User.find({}).exec((err, users) => {
    var userNames = users.filter((user) => {
      return user.firstname;
    });
    res.render('usersProductPage', { userNames });
  });
});
module.exports = router;
