var express = require('express');
var router = express.Router();
var Admin = require('../models/admin');
/* GET admins listing. */
router.get('/', function (req, res, next) {
  console.log(req.session);
  res.render('logged');
});
router.get('/register', function (req, res, next) {
  res.render('adminRegister');
});
router.post('/register', (req, res, next) => {
  Admin.create(req.body, (err, admin) => {
    res.redirect('/admin/login');
  });
});
router.get('/login', function (req, res, next) {
  res.render('adminLogin');
});
router.get('/loginSuccess', function (req, res, next) {
  let email = req.session.email;
  Admin.findOne({ email }, (err, admin) => {
    var fullName = admin.fullName();
    res.render('adminLoginSuccess', { fullName });
  });
});
router.post('/login', (req, res, next) => {
  var { email, password } = req.body;
  console.log(email, password);
  if (!email || !password) {
    return res.redirect('/admin/login');
  }
  Admin.findOne({ email }, (err, admin) => {
    if (err) return next(err);
    if (!admin) {
      return res.redirect('/admin/login');
    }
    admin.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      console.log(result);
      if (!result) {
        console.log(password);
        return res.redirect('/admin/login');
      }
      req.session.adminId = admin.id;
      req.session.email = admin.email;
      res.redirect('/admin/loginSuccess');
    });
  });
});
module.exports = router;
