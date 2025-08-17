const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  images: [{ type: String }], // URLs or file paths
  author: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  hashtags: [{ type: String }] // Optional hashtags
});

module.exports = mongoose.model('Blog', BlogSchema);
