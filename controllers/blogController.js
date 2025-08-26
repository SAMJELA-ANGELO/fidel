const Blog = require('../models/Blog');
const cloudinary = require('../config/cloudinary');
const slugify = require('slugify');
const mongoose = require('mongoose');

exports.createBlog = async (req, res) => {
  try {
    const { title, content, author, hashtags } = req.body;
    const slug = slugify(title, { lower: true, strict: true });

    let images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'blogs',
          });
          images.push(result.secure_url);
        } catch (uploadErr) {
          console.error('Cloudinary upload error:', uploadErr);
          return res.status(500).json({ error: 'Image upload failed', details: uploadErr.message });
        }
      }
    }
    const blog = new Blog({ title, slug, content, author, images, hashtags });
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBlog = async (req, res) => {
  try {
    const { slugOrId } = req.params;
    const isObjectId = mongoose.Types.ObjectId.isValid(slugOrId);

    const query = isObjectId ? { _id: slugOrId } : { slug: slugOrId };
    const blog = await Blog.findOne(query);

    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { slugOrId } = req.params;
    const { title, content, author, hashtags } = req.body;
    const updateData = { title, content, author, hashtags, updatedAt: Date.now() };

    if (title) {
      updateData.slug = slugify(title, { lower: true, strict: true });
    }

    if (req.files && req.files.length > 0) {
      let images = [];
      for (const file of req.files) {
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'blogs',
          });
          images.push(result.secure_url);
        } catch (uploadErr) {
          console.error('Cloudinary upload error:', uploadErr);
          return res.status(500).json({ error: 'Image upload failed', details: uploadErr.message });
        }
      }
      updateData.images = images;
    }

    const isObjectId = mongoose.Types.ObjectId.isValid(slugOrId);
    const query = isObjectId ? { _id: slugOrId } : { slug: slugOrId };

    const blog = await Blog.findOneAndUpdate(query, updateData, { new: true });

    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const { slugOrId } = req.params;
    const isObjectId = mongoose.Types.ObjectId.isValid(slugOrId);

    const query = isObjectId ? { _id: slugOrId } : { slug: slugOrId };
    const blog = await Blog.findOneAndDelete(query);

    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json({ message: 'Blog deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};