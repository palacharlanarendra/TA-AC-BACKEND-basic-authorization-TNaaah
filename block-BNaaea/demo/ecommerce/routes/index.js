var express = require('express');
var router = express.Router();
var Product = require('../models/products');
var Comment = require('../models/comments');
/* GET home page. */
router.get('/', function (req, res, next) {
  Product.find({}, (err, products) => {
    if (err) return next(err);
    res.render('index', { products: products });
  });
});

module.exports = router;
