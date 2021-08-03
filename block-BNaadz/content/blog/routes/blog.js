var express = require('express');
var router = express.Router();
var Blog = require('../models/blogs');
var Comment = require('../models/comments');
/* GET users listing. */

var auth = require('../middlewares/auth');

router.get('/', function (req, res, next) {
  Blog.find({}, (err, blogs) => {
    if (err) return next(err);
    res.render('blogsPage', { blogs: blogs });
  });
});
router.get('/new', auth.loggedInUser, function (req, res) {
  res.render('blogsForm');
});

router.get('/:slug', function (req, res, next) {
  var slug = req.params.slug;
  Blog.find({ slug: slug })
    .populate('comments')
    .populate('author', 'firstname email')
    .exec((err, blog) => {
      // console.log(err, blog);
      if (err) return next(err);
      res.render('singleUser', { blog: blog });
    });
});

router.use(auth.loggedInUser);
router.get('/:slug/edit', function (req, res, next) {
  var slug = req.params.slug;
  Blog.find({ slug }, (err, article) => {
    if (req.user._id == article[0].author) {
      Blog.find({ slug }, (err, blog) => {
        if (err) return next(err);
        res.render('blogNewForm', { blog: blog });
      });
    } else {
      res.render('notowner');
    }
  });
});
router.get('/:slug/delete', function (req, res, next) {
  var slug = req.params.slug;
  Blog.find({ slug }, (err, blog) => {
    if (req.user._id == blog[0].author) {
      Blog.remove({ slug }, (err, blog) => {
        if (err) return next(err);
        Comment.deleteMany({ blogId: blog.id }, (err, info) => {
          res.redirect('/blog');
        });
      });
    } else {
      res.render('notowner');
    }
  });
});

router.post('/', (req, res, next) => {
  req.body.author = req.user._id;
  Blog.create(req.body, (err, createArticle) => {
    if (err) return next(err);
    res.redirect('/blog');
  });
});
router.post('/:slug', (req, res, next) => {
  var slug = req.params.slug;
  Blog.findOneAndUpdate(slug, req.body, (err, updateBlog) => {
    if (err) return next(err);
    res.redirect('/blog/' + slug);
  });
});
router.post('/:slug/comments', (req, res, next) => {
  console.log(req.params);
  var slug = req.params.slug;
  req.body.blogId = slug;
  req.body.commentor = req.user._id;
  Comment.create(req.body, (err, comment) => {
    Blog.findOneAndUpdate(
      slug,
      { $push: { comments: comment._id } },
      (err, updatedBlog) => {
        console.log(err, updatedBlog);
        if (err) return next(err);
        res.redirect('/blog/' + slug);
      }
    );
  });
});
router.get('/opinion/:slug/likes', (req, res, next) => {
  var slug = req.params.slug;
  console.log(req.params);
  Blog.findOneAndUpdate(slug, { $inc: { likes: 1 } }, (err, blog) => {
    console.log(err, blog);
    if (err) return next(err);
    res.redirect('/blog/' + slug);
  });
});
router.get('/opinion/:slug/dislikes', (req, res, next) => {
  var slug = req.params.slug;
  Blog.findOneAndUpdate(slug, { $inc: { dislikes: 1 } }, (err, blog) => {
    console.log(err, blog);
    if (err) return next(err);
    res.redirect('/blog/' + slug);
  });
});
module.exports = router;
