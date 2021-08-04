var express = require('express');
const Product = require('../models/products');
var router = express.Router();
var Comment = require('../models/comments');
/* GET home page. */
router.get('/:id/edit', function (req, res, next) {
  var id = req.params.id;
  Comment.findById(id, (err, comment) => {
    if (err) return next(err);
    res.render('commentNewForm', { comment: comment });
  });
});
router.post('/:id', (req, res, next) => {
  var id = req.params.id;
  Comment.findByIdAndUpdate(id, req.body, (err, updatedComment) => {
    if (err) return next(err);
    res.redirect('/product/' + updatedComment.productId);
  });
});
router.get('/:id/delete', function (req, res, next) {
  var id = req.params.id;
  Comment.findByIdAndRemove(id, (err, comment) => {
    if (err) return next(err);
    Product.findByIdAndUpdate(
      comment.productId,
      { $pull: { comments: comment._id } },
      (err, product) => {
        res.redirect('/product/' + comment.productId);
      }
    );
  });
});
router.get('/:id/likes', (req, res, next) => {
  var id = req.params.id;
  Comment.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, comment) => {
    if (err) return next(err);
    res.redirect('/product/' + comment.productId);
  });
});
router.get('/:id/dislikes', (req, res, next) => {
  var id = req.params.id;
  Comment.findByIdAndUpdate(id, { $inc: { dislikes: 1 } }, (err, comment) => {
    if (err) return next(err);
    res.redirect('/product/' + comment.productId);
  });
});
module.exports = router;
