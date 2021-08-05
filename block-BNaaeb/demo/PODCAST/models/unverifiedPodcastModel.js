var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var unverifiedpodcastSchema = new Schema(
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

var Unverifiedpodcast = mongoose.model(
  'Unverifiedpodcast',
  unverifiedpodcastSchema
);

module.exports = Unverifiedpodcast;
