const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const Order = require('../models/Order');
const Notification = require('../models/Notification');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/orders
// @desc    Create new order (Shopkeeper or Customer)
// @access  Private - Shopkeeper, Customer
router.post('/', [
  protect,
  authorize('shopkeeper', 'customer'),
  body('orderContent').notEmpty().trim()
], async (req, res) => {
  try {
    const { orderContent, notes, transactionId } = req.body;

    // Create order based on user role
    const orderData = {
      shopkeeper: req.user._id,
      shopkeeperName: req.user.name,
      phoneNumber: req.user.phoneNumber,
      orderContent,
      notes
    };

    // Add role-specific fields
    if (req.user.role === 'shopkeeper') {
      orderData.shopName = req.user.shopName;
    } else if (req.user.role === 'customer') {
      orderData.shopName = req.user.address; // Use address as identifier for customers
    }

    const order = await Order.create(orderData);

    // Check if this is an urgent order with advance payment
    const isUrgent = notes && notes.includes('[URGENT DELIVERY');
    const hasAdvance = transactionId && notes && notes.includes('Transaction:');

    if (isUrgent && hasAdvance) {
      // Extract transaction ID from notes
      const transactionMatch = notes.match(/Transaction:\s*([^\]]+)/);
      const extractedTransactionId = transactionMatch ? transactionMatch[1].trim() : transactionId;

      // Create special notification for urgent order with advance payment
      await Notification.create({
        type: 'urgent_advance_paid',
        order: order._id,
        title: '⚡ URGENT: Advance Payment Received',
        message: `${req.user.shopName} paid ₹100 advance for urgent delivery. Transaction ID: ${extractedTransactionId}`,
        recipient: 'all'
      });

      // Emit special socket event for urgent order with payment
      if (req.app.get('io')) {
        req.app.get('io').emit('urgentAdvancePaid', {
          orderId: order._id,
          shopName: order.shopName,
          shopkeeperName: order.shopkeeperName,
          transactionId: extractedTransactionId,
          amount: 100
        });
      }
    }

    // Create regular notification for admins and superadmin
    await Notification.create({
      type: 'new_order',
      order: order._id,
      title: isUrgent ? '⚡ New URGENT Order' : 'New Order Received',
      message: `New ${isUrgent ? 'URGENT ' : ''}order from ${req.user.shopName} (${req.user.name})`,
      recipient: 'all'
    });

    // Emit socket event
    if (req.app.get('io')) {
      req.app.get('io').emit('newOrder', {
        orderId: order._id,
        shopName: order.shopName,
        shopkeeperName: order.shopkeeperName,
        isUrgent: isUrgent
      });
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/orders
// @desc    Get all orders (Admin/Superadmin) or own orders (Shopkeeper/Customer)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'shopkeeper' || req.user.role === 'customer') {
      query.shopkeeper = req.user._id;
    }

    const orders = await Order.find(query)
      .populate('deliveredBy', 'name')
      .populate('completedBy', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('shopkeeper', 'name shopName phoneNumber')
      .populate('deliveredBy', 'name')
      .populate('completedBy', 'name');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check authorization
    if (req.user.role === 'shopkeeper' && order.shopkeeper._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Mark as viewed by admin/superadmin
    if (req.user.role === 'admin' || req.user.role === 'superadmin') {
      const alreadyViewed = order.viewedBy.some(
        v => v.user.toString() === req.user._id.toString()
      );
      
      if (!alreadyViewed) {
        order.viewedBy.push({ user: req.user._id });
        await order.save();
      }
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/orders/:id/deliver
// @desc    Mark order as delivered (Admin)
// @access  Private - Admin
router.put('/:id/deliver', [
  protect,
  authorize('admin')
], async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'Pending') {
      return res.status(400).json({ message: 'Order is not in pending state' });
    }

    order.status = 'Delivered';
    order.deliveredBy = req.user._id;
    order.deliveredAt = Date.now();
    
    await order.save();

    // Create notification
    await Notification.create({
      type: 'order_delivered',
      order: order._id,
      title: 'Order Delivered',
      message: `Order from ${order.shopName} has been delivered by ${req.user.name}`,
      recipient: 'superadmin'
    });

    // Emit socket event
    if (req.app.get('io')) {
      req.app.get('io').emit('orderDelivered', {
        orderId: order._id,
        shopName: order.shopName
      });
    }

    res.json({
      success: true,
      message: 'Order marked as delivered',
      order
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/orders/:id/complete
// @desc    Mark order as completed (Superadmin)
// @access  Private - Superadmin
router.put('/:id/complete', [
  protect,
  authorize('superadmin')
], async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'Delivered') {
      return res.status(400).json({ message: 'Order must be delivered before completion' });
    }

    order.status = 'Completed';
    order.completedBy = req.user._id;
    order.completedAt = Date.now();
    
    await order.save();

    // Emit socket event
    if (req.app.get('io')) {
      req.app.get('io').emit('orderCompleted', {
        orderId: order._id,
        shopName: order.shopName
      });
    }

    res.json({
      success: true,
      message: 'Order marked as completed',
      order
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/orders/:id
// @desc    Mark order as deleted (Shopkeeper - only pending orders)
// @access  Private - Shopkeeper
router.delete('/:id', [
  protect,
  authorize('shopkeeper')
], async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order belongs to the shopkeeper
    if (order.shopkeeper.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this order' });
    }

    // Only allow deletion of pending orders
    if (order.status !== 'Pending') {
      return res.status(400).json({ message: 'Only pending orders can be deleted' });
    }

    // Mark as deleted instead of removing from database
    order.status = 'Deleted';
    order.deletedBy = req.user._id;
    order.deletedAt = Date.now();
    await order.save();

    const orderInfo = {
      orderId: order._id,
      shopName: order.shopName,
      shopkeeperName: order.shopkeeperName,
      orderContent: order.orderContent
    };

    // Create notification for admins and superadmin
    await Notification.create({
      type: 'order_deleted',
      title: 'Order Deleted',
      message: `Order #${order._id.toString().slice(-6)} from ${order.shopName} (${order.shopkeeperName}) has been deleted by shopkeeper`,
      recipient: 'all'
    });

    // Emit socket event
    if (req.app.get('io')) {
      req.app.get('io').emit('orderDeleted', orderInfo);
    }

    res.json({
      success: true,
      message: 'Order deleted successfully',
      order
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/orders/stats/dashboard
// @desc    Get order statistics
// @access  Private - Admin/Superadmin
router.get('/stats/dashboard', [
  protect,
  authorize('admin', 'superadmin')
], async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });
    const completedOrders = await Order.countDocuments({ status: 'Completed' });

    res.json({
      success: true,
      stats: {
        total: totalOrders,
        pending: pendingOrders,
        delivered: deliveredOrders,
        completed: completedOrders
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
