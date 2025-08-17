// routes/cartRoutes.js
const express = require('express');
const cartController = require('../controllers/cartController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Carts
 *   description: Cart management
 */

/**
 * @swagger
 * /api/carts:
 *   post:
 *     summary: Create a new cart
 *     tags: [Carts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                     quantity:
 *                       type: number
 *     responses:
 *       201:
 *         description: Cart created
 *       500:
 *         description: Server error
 */
router.post('/', cartController.createOrUpdateCart);

/**
 * @swagger
 * /api/carts:
 *   get:
 *     summary: Get all carts
 *     tags: [Carts]
 *     responses:
 *       200:
 *         description: List of carts
 *       500:
 *         description: Server error
 */
router.get('/', cartController.getCarts);

/**
 * @swagger
 * /api/carts/{id}:
 *   get:
 *     summary: Get a cart by ID
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart ID
 *     responses:
 *       200:
 *         description: Cart found
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
router.get('/:id', cartController.getCart);

/**
 * @swagger
 * /api/carts/{id}:
 *   put:
 *     summary: Update a cart by ID
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                     quantity:
 *                       type: number
 *     responses:
 *       200:
 *         description: Cart updated
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
router.put('/:id', cartController.updateCart);

/**
 * @swagger
 * /api/carts/{id}:
 *   delete:
 *     summary: Delete a cart by ID
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart ID
 *     responses:
 *       200:
 *         description: Cart deleted
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', cartController.deleteCart);

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Create or update cart for session
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionId: { type: string }
 *               products: { type: array, items: { type: object, properties: { productId: { type: string }, quantity: { type: number } } } }
 *     responses:
 *       200:
 *         description: Cart updated/created
 *       500:
 *         description: Error
 *   get:
 *     summary: Get cart by sessionId
 *     tags: [Cart]
 *     parameters:
 *       - in: query
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cart data
 *       404:
 *         description: Cart not found
 */

module.exports = router;
