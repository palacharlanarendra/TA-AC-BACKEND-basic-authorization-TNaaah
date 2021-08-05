var express = require('express');
var router = express.Router();
var Admin = require('../models/adminModel');
var User = require('../models/usersModel');
var Podcast = require('../models/podcastModel');
var auth = require('../middlewares/auth');
router.get('/newEntry', (req, res, next) => {
  console.log('hit');
  res.render('podcastEntryForm');
});
router.post('/newEntry', (req, res, next) => {
  Podcast.create(req.body, (err, pod) => {
    res.redirect('/admin/loginSuccess');
  });
});

module.exports = router;
