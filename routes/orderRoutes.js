// routes/orderRoutes.js
const express = require('express');
const orderController = require('../controllers/orderController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cartId: { type: string, description: "Cart ID (_id) for cart lookup (required)" }
 *               firstName: { type: string, description: "Customer first name" }
 *               lastName: { type: string, description: "Customer last name" }
 *               country: { type: string }
 *               city: { type: string }
 *               state: { type: string }
 *               companyName: { type: string }
 *               postcode: { type: string }
 *               phone: { type: string }
 *               email: { type: string, description: "Customer email address (used for invoice)" }
 *               orderNote: { type: string }
 *               scheduledDelivery: {
 *                 type: object,
 *                 properties: {
 *                   date: { type: string },
 *                   note: { type: string }
 *                 }
 *               }
 *               paymentMethod: { type: string }
 *               total: { type: number, description: "Order total amount" }
 *     responses:
 *       201:
 *         description: Order created
 *       400:
 *         description: Cart not found or empty
 *       500:
 *         description: Error
 *
 * /api/orders/{id}/invoice:
 *   put:
 *     summary: Admin edit and resend invoice
 *     tags: [Orders]
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
 *               invoiceData: { type: object }
 *               toEmail: { type: string, description: "Recipient email address for invoice" }
 *     responses:
 *       200:
 *         description: Invoice sent
 *       500:
 *         description: Error
 */
router.post('/', orderController.createOrder);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: List of orders
 *       500:
 *         description: Server error
 */
router.get('/', orderController.getOrders);

/**
 * @swagger
 * /api/orders/count:
 *   get:
 *     summary: Get total count of orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Order count
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
router.get('/count', orderController.getOrderCount);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order found
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
router.get('/:id', orderController.getOrder);

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Update an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
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
 *               status:
 *                 type: string
 *               total:
 *                 type: number
 *     responses:
 *       200:
 *         description: Order updated
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
router.put('/:id', orderController.updateOrder);

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Delete an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order deleted
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', orderController.deleteOrder);

/**
 * @swagger
 * /api/orders/{id}/invoice:
 *   put:
 *     summary: Edit and resend invoice for an order (Admin)
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
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
 *               status:
 *                 type: string
 *               total:
 *                 type: number
 *               billingAddress:
 *                 type: object
 *                 properties:
 *                   fullName:
 *                     type: string
 *                   addressLine1:
 *                     type: string
 *                   addressLine2:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   postalCode:
 *                     type: string
 *                   country:
 *                     type: string
 *     responses:
 *       200:
 *         description: Invoice edited and resent
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
router.put('/:id/invoice', orderController.editAndSendInvoice);

/**
 * @swagger
 * /api/email/test:
 *   post:
 *     summary: Send a test email using Mailjet
 *     tags: [Email]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               toEmail: { type: string, description: "Recipient email address" }
 *               subject: { type: string, description: "Email subject" }
 *               text: { type: string, description: "Plain text body" }
 *               html: { type: string, description: "HTML body (optional)" }
 *     responses:
 *       200:
 *         description: Email sent successfully
 *       500:
 *         description: Error sending email
 */

// Test email endpoint
router.post('/email/test', async (req, res) => {
	const { toEmail, subject, text, html } = req.body;
	try {
		await mailService.sendMail({
			to: toEmail,
			subject,
			text,
			html,
		});
		res.status(200).json({ message: 'Email sent successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
