// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  weight: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{ type: String }],
  flavours: [{ type: String }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  createdAt: { type: Date, default: Date.now },
  rating: { type: Number, min: 1, max: 5, default: 5 }
});

module.exports = mongoose.model('Product', productSchema);
