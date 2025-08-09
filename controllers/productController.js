// controllers/productController.js

const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');
const Category = require('../models/Category');

exports.createProduct = async (req, res) => {
  try {
    let images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'products',
          });
          console.log('Cloudinary upload result:', result);
          images.push(result.secure_url);
        } catch (uploadErr) {
          console.error('Cloudinary upload error:', uploadErr);
          return res.status(500).json({ error: 'Image upload failed', details: uploadErr.message });
        }
      }
    }
    let category = req.body.category;
    if (category && !category.match(/^[0-9a-fA-F]{24}$/)) {
      // Not an ObjectId, try to find by name
      const found = await Category.findOne({ name: category });
      if (!found) return res.status(400).json({ error: 'Category not found' });
      category = found._id;
    }
    const product = new Product({
      ...req.body,
      category,
      images,
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getProducts = async (req, res) => {
  try {
    const { search, category } = req.query;
    let filter = {};
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    if (category) {
      filter.category = category;
    }
    const products = await Product.find(filter).populate('category');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    let update = { ...req.body };
    if (req.files && req.files.length > 0) {
      update.images = [];
      for (const file of req.files) {
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'products',
          });
          console.log('Cloudinary upload result:', result);
          update.images.push(result.secure_url);
        } catch (uploadErr) {
          console.error('Cloudinary upload error:', uploadErr);
          return res.status(500).json({ error: 'Image upload failed', details: uploadErr.message });
        }
      }
    }
    if (update.category && !update.category.match(/^[0-9a-fA-F]{24}$/)) {
      const found = await Category.findOne({ name: update.category });
      if (!found) return res.status(400).json({ error: 'Category not found' });
      update.category = found._id;
    }
    const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
