var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log(req.user);
  res.render('index');
});
router.get('/protected', (req, res) => {
  if (req.session && req.session.userId) {
    res.send('Protected Resource');
  } else {
    res.redirect('/users/login');
  }
});
module.exports = router;
