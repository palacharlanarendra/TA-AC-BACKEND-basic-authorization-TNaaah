var express = require('express');
const Blog = require('../models/blogs');
var router = express.Router();
var Comment = require('../models/comments');
/* GET home page. */
router.get('/:id/edit', function (req, res, next) {
  var id = req.params.id;
  Comment.findById(id, (err, comment) => {
    if (err) return next(err);
    if (req.user._id == comment.commentor) {
      res.render('commentNewForm', { comment: comment });
    } else {
      res.render('notowner');
    }
  });
});
router.post('/:id', (req, res, next) => {
  var id = req.params.id;
  Comment.findByIdAndUpdate(id, req.body, (err, updatedComment) => {
    if (err) return next(err);
    res.redirect('/blog/' + updatedComment.blogId);
  });
});
router.get('/:id/delete', function (req, res, next) {
  var id = req.params.id;
  Comment.findByIdAndRemove(id, (err, comment) => {
    if (err) return next(err);
    if (req.user._id == comment.commentor) {
      if (err) return next(err);
      Blog.findByIdAndUpdate(
        comment.blogId,
        { $pull: { comments: comment._id } },
        (err, blog) => {
          res.redirect('/blog/' + comment.blogId);
        }
      );
    } else {
      res.render('notowner');
    }
  });
});
router.get('/:id/likes', (req, res, next) => {
  var id = req.params.id;
  Comment.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, comment) => {
    if (err) return next(err);
    res.redirect('/blog/' + comment.blogId);
  });
});
router.get('/:id/dislikes', (req, res, next) => {
  var id = req.params.id;
  Comment.findByIdAndUpdate(id, { $inc: { dislikes: 1 } }, (err, comment) => {
    if (err) return next(err);
    res.redirect('/blog/' + comment.blogId);
  });
});
module.exports = router;
