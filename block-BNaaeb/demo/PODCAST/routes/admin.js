var express = require('express');
var router = express.Router();
var Admin = require('../models/adminModel');
var User = require('../models/usersModel');
var auth = require('../middlewares/auth');
var Podcast = require('../models/podcastModel');
var Userpodcast = require('../models/unverifiedPodcastModel');
/* GET admins listing. */

router.get('/register', function (req, res, next) {
  res.render('adminRegister');
});
router.post('/register', (req, res, next) => {
  console.log(req.body);
  Admin.create(req.body, (err, admin) => {
    res.redirect('/admin/login');
  });
});
router.get('/login', function (req, res, next) {
  res.render('index');
});
router.get('/loginSuccess', function (req, res, next) {
  var email = req.admin.email;
  Admin.findOne({ email }, (err, admin) => {
    var name = req.admin;
    Podcast.find({}, (err, pods) => {
      if (err) return next(err);
      Userpodcast.find({}, (err, unverifiedPods) => {
        if (err) return next(err);
        res.render('adminLoginSuccess', {
          name: name,
          pods: pods,
          unverifiedPods: unverifiedPods,
        });
      });
    });
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
router.get('/logout', function (req, res, next) {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/');
});
module.exports = router;
