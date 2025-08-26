// routes/productRoutes.js
const express = require('express');
const multer = require('multer');
const productController = require('../controllers/productController');


const router = express.Router();

const upload = multer({ dest: 'uploads/' });

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 default: 5
 *                 description: Product rating (1-5)
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Product created
 *       500:
 *         description: Server error
 */


router.post('/', upload.array('images', 10), productController.createProduct);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: List of products
 *       500:
 *         description: Server error
 */
router.get('/', productController.getProducts);

/**
 * @swagger
 * /api/products/count:
 *   get:
 *     summary: Get total count of products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Product count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: number
 *       500:
 *         description: Server error
 */
router.get('/count', productController.getProductCount);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 price:
 *                   type: number
 *                 category:
 *                   type: string
 *                 rating:
 *                   type: number
 *                   minimum: 1
 *                   maximum: 5
 *                   default: 5
 *                   description: Product rating (1-5)
 *                 images:
 *                   type: array
 *                   items:
 *                     type: string
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
router.get('/:slugOrId', productController.getProduct);

/**
 * @swagger
 * /api/products/{slug}:
 *   put:
 *     summary: Update a product by slug
 *     tags: [Products]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Product slug
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Product updated
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
router.put('/:slugOrId', upload.array('images', 10), productController.updateProduct);

/**
 * @swagger
 * /api/products/{slug}:
 *   delete:
 *     summary: Delete a product by slug
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Product slug
 *     responses:
 *       200:
 *         description: Product deleted
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
router.delete('/:slugOrId', productController.deleteProduct);

/**
 * @swagger
 * /api/products/{id}/images:
 *   put:
 *     summary: Edit product images (add/remove)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               addImages: { type: array, items: { type: string } }
 *               removeImages: { type: array, items: { type: string } }
 *     responses:
 *       200:
 *         description: Images updated
 *       500:
 *         description: Error
 *
 * /api/products/{id}/rating:
 *   put:
 *     summary: Update product rating
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating: { type: number }
 *     responses:
 *       200:
 *         description: Rating updated
 *       500:
 *         description: Error
 */

module.exports = router;
