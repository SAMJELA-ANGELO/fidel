// controllers/orderController.js
const Order = require('../models/Order');
const { sendEmail } = require('../utils/mailService');

const Cart = require('../models/Cart');
exports.createOrder = async (req, res) => {
  try {
    // Extract order fields from req.body
    const {
      cartId,
      firstName, lastName, country, city, state, companyName, postcode, phone, email,
      orderNote, scheduledDelivery, paymentMethod, total
    } = req.body;
    // Get products from cart by cartId
    const cart = await Cart.findOne({ _id: cartId, status: 'active' });
    if (!cart || !cart.products.length) {
      return res.status(400).json({ error: 'Cart not found or empty' });
    }
    const Product = require('../models/Product');
    // Build products array with name and price from Product model
    const products = await Promise.all(
      cart.products.map(async (item) => {
        const prod = await Product.findById(item.product);
        return {
          product: item.product,
          name: prod ? prod.name : 'Unknown',
          price: prod ? prod.price : 0,
          quantity: item.quantity
        };
      })
    );
    // Calculate total from products
    const calculatedTotal = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    // Order creation logic
    const order = new Order({
      firstName, lastName, country, city, state, companyName, postcode, phone, email,
      orderNote, scheduledDelivery, paymentMethod, products, total: calculatedTotal
    });
    await order.save();
    // Generate invoice HTML (copied from editAndSendInvoice)
    let productsHtml = '';
    if (Array.isArray(products)) {
      productsHtml = products.map(p => `
        <tr>
          <td style='padding:8px;border:1px solid #eee;'>${p.name}</td>
          <td style='padding:8px;border:1px solid #eee;text-align:center;'>${p.quantity}</td>
          <td style='padding:8px;border:1px solid #eee;text-align:right;'>$${p.price}</td>
        </tr>
      `).join('');
    } else {
      productsHtml = `<tr><td colspan='3' style='padding:8px;border:1px solid #eee;text-align:center;'>No products listed</td></tr>`;
    }
    const invoiceHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #eee;border-radius:8px;overflow:hidden;">
      <div style="background:#263c1e;padding:24px;text-align:center;">
        <img src='https://res.cloudinary.com/day7o4yjq/image/upload/v1755028728/products/wmecvhltqzhhkighys3y.jpg' alt='Fidel Logo' style='height:48px;margin-bottom:12px;' />
        <h1 style='color:#fff;margin:0;font-size:2rem;'>Order Invoice</h1>
      </div>
      <div style="padding:24px;background:#fff;">
        <h2 style='color:#263c1e;'>Order Summary</h2>
        <table style='width:100%;border-collapse:collapse;margin-bottom:16px;'>
          <tr>
            <td style='padding:8px;font-weight:bold;'>Name:</td>
            <td style='padding:8px;'>${firstName} ${lastName}</td>
          </tr>
          <tr>
            <td style='padding:8px;font-weight:bold;'>Email:</td>
            <td style='padding:8px;'>${email}</td>
          </tr>
          <tr>
            <td style='padding:8px;font-weight:bold;'>Phone:</td>
            <td style='padding:8px;'>${phone}</td>
          </tr>
          <tr>
            <td style='padding:8px;font-weight:bold;'>Company:</td>
            <td style='padding:8px;'>${companyName || ''}</td>
          </tr>
        </table>
        <h3 style='color:#263c1e;'>Shipping Address</h3>
        <p style='margin:0 0 16px 0;'>${country}, ${city}, ${state}, ${postcode}</p>
        <h3 style='color:#263c1e;'>Order Note</h3>
        <p style='margin:0 0 16px 0;'>${orderNote || ''}</p>
        <h3 style='color:#263c1e;'>Scheduled Delivery</h3>
        <p style='margin:0 0 16px 0;'>${scheduledDelivery?.date || ''} ${scheduledDelivery?.note || ''}</p>
        <h3 style='color:#263c1e;'>Payment Method</h3>
        <p style='margin:0 0 16px 0;'>${paymentMethod}</p>
        <h3 style='color:#263c1e;'>Products</h3>
        <table style='width:100%;border-collapse:collapse;'>
          <thead>
            <tr style='background:#f5f5f5;'>
              <th style='padding:8px;border:1px solid #eee;'>Product</th>
              <th style='padding:8px;border:1px solid #eee;'>Quantity</th>
              <th style='padding:8px;border:1px solid #eee;'>Price</th>
            </tr>
          </thead>
          <tbody>
            ${productsHtml}
          </tbody>
        </table>
        <h2 style='color:#263c1e;text-align:right;margin-top:24px;'>Total: $${calculatedTotal}</h2>
      </div>
      <div style="background:#f5f5f5;padding:16px;text-align:center;color:#64748b;font-size:0.9rem;">
        Thank you for shopping with Fidel!
      </div>
    </div>
    `;
    // Send to admin
    await sendEmail({
      to: 'INFO@FIDELSCLOTHINGS.COM',
      subject: 'New Order Received',
      html: invoiceHtml,
      from: 'INFO@FIDELSCLOTHINGS.COM'
    });
    // Send to user
    await sendEmail({
      to: email,
      subject: 'Your Order Invoice',
      html: invoiceHtml,
      from: 'INFO@FIDELSCLOTHINGS.COM'
    });
    // Delete cart after order
    await Cart.findByIdAndDelete(cart._id);
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('products.product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrderCount = async (req, res) => {
  try {
    const count = await Order.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('products.product');
    if (!order) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.editAndSendInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const { invoiceData, toEmail } = req.body;
    // Generate invoice HTML from invoiceData
    let productsHtml = '';
    if (Array.isArray(invoiceData.products)) {
      productsHtml = invoiceData.products.map(p => `
        <tr>
          <td style='padding:8px;border:1px solid #eee;'>${p.name}</td>
          <td style='padding:8px;border:1px solid #eee;text-align:center;'>${p.quantity}</td>
          <td style='padding:8px;border:1px solid #eee;text-align:right;'>$${p.price}</td>
        </tr>
      `).join('');
    } else {
      productsHtml = `<tr><td colspan='3' style='padding:8px;border:1px solid #eee;text-align:center;'>No products listed</td></tr>`;
    }

    const invoiceHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #eee;border-radius:8px;overflow:hidden;">
      <div style="background:#263c1e;padding:24px;text-align:center;">
        <img src='https://res.cloudinary.com/day7o4yjq/image/upload/v1755028728/products/wmecvhltqzhhkighys3y.jpg' alt='Fidel Logo' style='height:48px;margin-bottom:12px;' />
        <h1 style='color:#fff;margin:0;font-size:2rem;'>Order Invoice</h1>
      </div>
      <div style="padding:24px;background:#fff;">
        <h2 style='color:#263c1e;'>Order Summary</h2>
        <table style='width:100%;border-collapse:collapse;margin-bottom:16px;'>
          <tr>
            <td style='padding:8px;font-weight:bold;'>Name:</td>
            <td style='padding:8px;'>${invoiceData.firstName} ${invoiceData.lastName}</td>
          </tr>
          <tr>
            <td style='padding:8px;font-weight:bold;'>Email:</td>
            <td style='padding:8px;'>${invoiceData.email}</td>
          </tr>
          <tr>
            <td style='padding:8px;font-weight:bold;'>Phone:</td>
            <td style='padding:8px;'>${invoiceData.phone}</td>
          </tr>
          <tr>
            <td style='padding:8px;font-weight:bold;'>Company:</td>
            <td style='padding:8px;'>${invoiceData.companyName || ''}</td>
          </tr>
        </table>
        <h3 style='color:#263c1e;'>Shipping Address</h3>
        <p style='margin:0 0 16px 0;'>${invoiceData.country}, ${invoiceData.city}, ${invoiceData.state}, ${invoiceData.postcode}</p>
        <h3 style='color:#263c1e;'>Order Note</h3>
        <p style='margin:0 0 16px 0;'>${invoiceData.orderNote || ''}</p>
        <h3 style='color:#263c1e;'>Scheduled Delivery</h3>
        <p style='margin:0 0 16px 0;'>${invoiceData.scheduledDelivery?.date || ''} ${invoiceData.scheduledDelivery?.note || ''}</p>
        <h3 style='color:#263c1e;'>Payment Method</h3>
        <p style='margin:0 0 16px 0;'>${invoiceData.paymentMethod}</p>
        <h3 style='color:#263c1e;'>Products</h3>
        <table style='width:100%;border-collapse:collapse;'>
          <thead>
            <tr style='background:#f5f5f5;'>
              <th style='padding:8px;border:1px solid #eee;'>Product</th>
              <th style='padding:8px;border:1px solid #eee;'>Quantity</th>
              <th style='padding:8px;border:1px solid #eee;'>Price</th>
            </tr>
          </thead>
          <tbody>
            ${productsHtml}
          </tbody>
        </table>
        <h2 style='color:#263c1e;text-align:right;margin-top:24px;'>Total: $${invoiceData.total}</h2>
      </div>
      <div style="background:#f5f5f5;padding:16px;text-align:center;color:#64748b;font-size:0.9rem;">
        Thank you for shopping with Fidel!
      </div>
    </div>
    `;
    await sendEmail({
      to: toEmail,
      subject: 'Order Invoice',
      html: invoiceHtml,
      from: 'INFO@FIDELSCLOTHINGS.COM'
    });
    res.json({ message: 'Invoice sent' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
