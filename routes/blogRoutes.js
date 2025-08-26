const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

/**
 * @swagger
 * /api/blogs:
 *   post:
 *     summary: Create a new blog post
 *     tags: [Blogs]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               content: { type: string }
 *               images: { type: array, items: { type: string, format: binary } }
 *               author: { type: string }
 *               hashtags: { type: array, items: { type: string } }
 *     responses:
 *       201:
 *         description: Blog created
 *       500:
 *         description: Error
 *   get:
 *     summary: Get all blogs
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: List of blogs
 *       500:
 *         description: Error
 * /api/blogs/{id}:
 *   get:
 *     summary: Get blog by ID
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog data
 *       404:
 *         description: Blog not found
 *   put:
 *     summary: Update blog by ID
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               content: { type: string }
 *               images: { type: array, items: { type: string, format: binary } }
 *               author: { type: string }
 *               hashtags: { type: array, items: { type: string } }
 *     responses:
 *       200:
 *         description: Blog updated
 *       404:
 *         description: Blog not found
 *   delete:
 *     summary: Delete blog by ID
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog deleted
 *       404:
 *         description: Blog not found
 */

router.post('/', upload.array('images'), blogController.createBlog);
router.get('/', blogController.getBlogs);
router.get('/:slugOrId', blogController.getBlog);
router.put('/:slugOrId', upload.array('images'), blogController.updateBlog);
router.delete('/:slugOrId', blogController.deleteBlog);

module.exports = router;
