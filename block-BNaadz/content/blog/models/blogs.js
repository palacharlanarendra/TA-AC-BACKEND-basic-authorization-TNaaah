var mongoose = require('mongoose');
var slugger = require('slugger');
var Schema = mongoose.Schema;

var blogSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    author: String,
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    slug: String,
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

blogSchema.pre('save', function (next) {
  if (this.title) {
    var modified = slugger(this.title, { replacement: '-' });
    this.slug = modified;
    next();
  } else {
    next();
  }
});

var Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
