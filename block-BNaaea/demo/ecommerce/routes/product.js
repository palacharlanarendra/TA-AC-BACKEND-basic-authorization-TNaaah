var express = require('express');
var router = express.Router();
var Product = require('../models/products');
var Comment = require('../models/comments');
var User = require('../models/user');
var auth = require('../middlewares/auth');
/* GET users listing. */
router.get('/:id', function (req, res, next) {
  var id = req.params.id;
  Product.findById(id)
    .populate('comments')
    .exec((err, product) => {
      if (err) return next(err);
      res.render('singleUser', { product: product });
    });
});
router.get('/logout', function (req, res, next) {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/product');
});
router.post('/:id/comments', (req, res, next) => {
  var id = req.params.id;
  req.body.productId = id;
  Comment.create(req.body, (err, comment) => {
    Product.findByIdAndUpdate(
      id,
      { $push: { comments: comment._id } },
      (err, updatedproduct) => {
        // console.log(err, comment)
        if (err) return next(err);
        res.redirect('/product/' + id);
      }
    );
  });
});
router.get('/:id/likes', (req, res, next) => {
  var id = req.params.id;
  Product.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, product) => {
    // console.log(err, product);
    if (err) return next(err);
    res.redirect('/product/' + id);
  });
});
router.get('/:id/dislikes', (req, res, next) => {
  var id = req.params.id;
  Product.findByIdAndUpdate(id, { $inc: { likes: -1 } }, (err, product) => {
    // console.log(err, product);
    if (err) return next(err);
    res.redirect('/product/' + id);
  });
});
router.get('/products/adminOptions', function (req, res, next) {
  Product.find({}, (err, products) => {
    if (err) return next(err);
    var categories = products.reduce((acc, elem) => {
      if (elem.category) {
        var array = elem.category[0].split(',');
        array.filter((elem) => {
          acc.push(elem);
        });
      }
      return acc;
    }, []);
    User.find({}, (err, users) => {
      if (err) return next(err);
      res.render('adminProductsPage', {
        products: products,
        categories: categories,
        users: users,
      });
    });
  });
});
router.get('/', function (req, res, next) {
  Product.find({}, (err, products) => {
    if (err) return next(err);
    var categories = products.reduce((acc, elem) => {
      if (elem.category) {
        var array = elem.category[0].split(',');
        array.filter((elem) => {
          acc.push(elem);
        });
      }
      return acc;
    }, []);
    res.render('productsPage', { products: products, categories: categories });
  });
});
router.get('/:category', function (req, res, next) {
  var category = req.params.category;
  Product.find({}).exec((err, products) => {
    if (err) return next(err);
    var filteredProducts = products.filter((elem) => {
      if (elem.category[0].split(',').includes(category)) {
        return elem;
      }
    });

    res.render('index', { products: filteredProducts });
  });
});

router.get('/userOptions', function (req, res, next) {
  Product.find({}, (err, products) => {
    if (err) return next(err);
    res.render('usersProductsPage', { products: products });
  });
});
router.use(auth.loggedInUser);
router.use(auth.loggedInAdmin);
router.get('/new', auth.loggedInAdmin, function (req, res) {
  res.render('productsForm');
});

router.get('/:id/edit', function (req, res, next) {
  var id = req.params.id;
  Product.findById(id, (err, product) => {
    if (err) return next(err);
    res.render('productNewForm', { product: product });
  });
});
router.get('/:id/delete', function (req, res, next) {
  var id = req.params.id;
  Product.findByIdAndDelete(id, (err, product) => {
    if (err) return next(err);
    Comment.deleteMany({ productId: product.id }, (err, info) => {
      res.redirect('/product');
    });
  });
});
var cart = [];
router.get('/:id/addToCart', function (req, res, next) {
  var id = req.params.id;
  Product.findById(id, (err, product) => {
    if (err) return next(err);
    cart.push(product);
    res.render('cart', { cart: cart });
  });
});

router.post('/adminOptions', (req, res, next) => {
  Product.create(req.body, (err, createArticle) => {
    createArticle.category = req.body.category.split(',');
    // console.log(req.body, createArticle);
    if (err) return next(err);
    res.redirect('/product');
  });
});
router.post('/:id/updateForm', (req, res, next) => {
  var id = req.params.id;
  Product.findByIdAndUpdate(id, req.body, (err, updateproduct) => {
    if (err) return next(err);
    res.redirect('/product/' + id);
  });
});

module.exports = router;
