// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: String }, // Optional for guest checkout
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
  firstName: String,
  lastName: String,
  country: String,
  city: String,
  state: String,
  companyName: String,
  postcode: String,
  phone: String,
  email: String,
  orderNote: String,
  scheduledDelivery: {
    date: String,
    note: String
  },
  paymentMethod: String,
  coupon: { type: String },
  status: { type: String, enum: ['pending', 'paid', 'shipped', 'completed', 'cancelled'], default: 'pending' },
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
