// models/Cart.js
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      imageUrl: String,
      price: Number,
      productSlug: String,
      productCategory: String,
      quantity: { type: Number, default: 1 },
    },
  ],
  status: { type: String, enum: ['active', 'ordered', 'abandoned'], default: 'active' },
  total: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Cart', cartSchema);
