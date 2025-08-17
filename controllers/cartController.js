// controllers/cartController.js
const Cart = require('../models/Cart');

exports.createOrUpdateCart = async (req, res) => {
  try {
    const { sessionId, products } = req.body;
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });
    let cart = await Cart.findOne({ sessionId, status: 'active' });
    if (cart) {
      // Update cart: merge products
      products.forEach(newItem => {
        const idx = cart.products.findIndex(p => String(p.product) === String(newItem.product));
        if (idx > -1) {
          cart.products[idx].quantity += newItem.quantity || 1;
        } else {
          cart.products.push(newItem);
        }
      });
      cart.updatedAt = Date.now();
      await cart.save();
      return res.json(cart);
    } else {
      // Create new cart
      cart = new Cart({ sessionId, products });
      await cart.save();
      return res.status(201).json(cart);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCarts = async (req, res) => {
  try {
    const carts = await Cart.find().populate('products.product');
    res.json(carts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id).populate('products.product');
    if (!cart) return res.status(404).json({ error: 'Not found' });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const cart = await Cart.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cart) return res.status(404).json({ error: 'Not found' });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCart = async (req, res) => {
  try {
    const cart = await Cart.findByIdAndDelete(req.params.id);
    if (!cart) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
