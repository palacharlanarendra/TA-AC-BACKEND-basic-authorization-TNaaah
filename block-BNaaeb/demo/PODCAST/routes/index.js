var express = require('express');
var router = express.Router();
var Admin = require('../models/adminModel');
var User = require('../models/usersModel');
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
