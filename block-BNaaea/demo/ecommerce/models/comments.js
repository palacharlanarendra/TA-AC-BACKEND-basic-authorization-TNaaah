var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema(
  {
    content: { type: String, required: true },
    blogId: { type: Schema.Types.ObjectId, ref: 'Blog', required: true },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
