var express = require('express');
var router = express.Router();
var Admin = require('../models/adminModel');
var User = require('../models/usersModel');
var Podcast = require('../models/podcastModel');
var Userpodcast = require('../models/unverifiedPodcastModel');
/* GET users listing. */
router.get('/some/:id', function (req, res, next) {
  var id = req.params.id;
  Userpodcast.findById(id, (err, userPod) => {
    let { title, description, artist, image, likes, dislikes, category } =
      userPod;
    Userpodcast.findByIdAndDelete(id, (err, userPod) => {
      Podcast.create(
        { title, description, artist, image, likes, dislikes, category },
        (err, pods) => {
          if (err) return next(err);
          res.redirect('/admin/loginSuccess');
        }
      );
    });
  });
});
router.get('/register', function (req, res, next) {
  res.render('userRegister');
});
router.post('/register', (req, res, next) => {
  User.create(req.body, (err, user) => {
    res.redirect('/users/login');
  });
});
router.get('/login', function (req, res, next) {
  res.render('index');
});
router.get('/loginSuccess', function (req, res, next) {
  var email = req.user.email;
  User.findOne({ email }, (err, user) => {
    var name = req.user;
    Podcast.find({}, (err, pods) => {
      if (err) return next(err);
      var filteredPods = pods.filter((pod) => {
        if (
          req.user.membership == pod.category &&
          req.user.membership == 'free'
        ) {
          return pod;
        }
        if (
          (pod.category == 'vip' || pod.category == 'free') &&
          req.user.membership == 'vip'
        ) {
          return pod;
        }
        if (
          (pod.category == 'vip' ||
            pod.category == 'free' ||
            pod.category == 'premium') &&
          req.user.membership == 'premium'
        ) {
          return pod;
        }
      });
      res.render('userLoginSuccess', { pods: filteredPods, name: name });
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
      // req.session.email = user.email;
      res.redirect('/users/loginSuccess');
    });
  });
});
router.get('/logout', function (req, res, next) {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/');
});

router.get('/userEntryForm', function (req, res, next) {
  res.render('userpodcastEntryForm');
});

router.post('/newUserEntry', (req, res, next) => {
  Userpodcast.create(req.body, (err, pods) => {
    res.redirect('/users/loginSuccess');
  });
});
module.exports = router;
