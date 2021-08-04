var mongoose = require('mongoose');
var slugger = require('slugger');
var Schema = mongoose.Schema;

var productSchema = new Schema(
  {
    name: { type: String, required: true },
    quantity: String,
    price: Number,
    likes: Number,
    category: [String],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    image: String,
  },
  { timestamps: true }
);

productSchema.pre('save', function (next) {
  if (this.title) {
    var modified = slugger(this.title, { replacement: '-' });
    this.slug = modified;
    next();
  } else {
    next();
  }
});

var Product = mongoose.model('Product', productSchema);

module.exports = Product;
