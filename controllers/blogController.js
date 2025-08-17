const Blog = require('../models/Blog');

exports.createBlog = async (req, res) => {
  try {
    const { title, content, author, hashtags } = req.body;
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.path);
    }
    const blog = new Blog({ title, content, author, images, hashtags });
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
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { title, content, author, hashtags } = req.body;
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.path);
    }
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content, author, images, hashtags, updatedAt: Date.now() },
      { new: true }
    );
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json({ message: 'Blog deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
