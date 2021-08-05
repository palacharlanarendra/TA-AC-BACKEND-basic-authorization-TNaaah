var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var podcastSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    artist: String,
    image: { type: String, required: true },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    category: { type: String, required: true },
  },
  { timestamps: true }
);

var Podcast = mongoose.model('Podcast', podcastSchema);

module.exports = Podcast;
