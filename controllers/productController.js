// controllers/productController.js

const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');
const Category = require('../models/Category');
const slugify = require('slugify');
const mongoose = require('mongoose');

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
    let { flavours, ...otherData } = req.body;
    if (typeof flavours === 'string') {
      try {
        flavours = JSON.parse(flavours);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid format for flavours' });
      }
    }

    const slug = slugify(otherData.name, { lower: true, strict: true });

    const product = new Product({
      ...otherData,
      slug,
      category,
      images,
      flavours,
      weight: req.body.weight,
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
      // If category is not ObjectId, look up by partial name (case-insensitive)
      if (!category.match(/^[0-9a-fA-F]{24}$/)) {
        const foundCategories = await Category.find({ name: { $regex: category, $options: 'i' } });
        if (foundCategories.length > 0) {
          filter.category = { $in: foundCategories.map(cat => cat._id) };
        } else {
          // No matching category, return empty
          return res.json([]);
        }
      } else {
        filter.category = category;
      }
    }
    const products = await Product.find(filter).populate('category');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProductCount = async (req, res) => {
  try {
    const count = await Product.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const { slugOrId } = req.params;
    const isObjectId = mongoose.Types.ObjectId.isValid(slugOrId);

    const query = isObjectId ? { _id: slugOrId } : { slug: slugOrId };
    const product = await Product.findOne(query).populate('category');

    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { slugOrId } = req.params;
    let update = { ...req.body };
    if (update.name) {
      update.slug = slugify(update.name, { lower: true, strict: true });
    }

    const isObjectId = mongoose.Types.ObjectId.isValid(slugOrId);
    const query = isObjectId ? { _id: slugOrId } : { slug: slugOrId };

  let existingProduct = await Product.findOneAndUpdate(query, update, { new: true });

    if (!existingProduct) return res.status(404).json({ error: 'Not found' });
    // Handle image removal
    if (update.imagesToKeep) {
      existingProduct.images = existingProduct.images.filter(img => update.imagesToKeep.includes(img));
    }
    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'products',
          });
          existingProduct.images.push(result.secure_url);
        } catch (uploadErr) {
          console.error('Cloudinary upload error:', uploadErr);
          return res.status(500).json({ error: 'Image upload failed', details: uploadErr.message });
        }
      }
    }
    // Update other fields
    if (update.category && !update.category.match(/^[0-9a-fA-F]{24}$/)) {
      const found = await Category.findOne({ name: update.category });
      if (!found) return res.status(400).json({ error: 'Category not found' });
      update.category = found._id;
    }
    Object.assign(existingProduct, update);
    if (update.weight !== undefined) {
      existingProduct.weight = update.weight;
    }
    await existingProduct.save();
    res.json(existingProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { slugOrId } = req.params;
    const isObjectId = mongoose.Types.ObjectId.isValid(slugOrId);

    const query = isObjectId ? { _id: slugOrId } : { slug: slugOrId };
    const product = await Product.findOneAndDelete(query);

    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};