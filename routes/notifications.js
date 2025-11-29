const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/notifications
// @desc    Get notifications for admin/superadmin
// @access  Private - Admin/Superadmin
router.get('/', [
  protect,
  authorize('admin', 'superadmin')
], async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    const notifications = await Notification.find({
      isActive: true,
      $or: [
        { recipient: 'all' },
        { recipient: req.user.role }
      ]
    })
    .populate('order', 'shopkeeperName shopName status')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

    // Get unread count
    const unreadCount = notifications.filter(n => 
      !n.readBy.some(r => r.user.toString() === req.user._id.toString())
    ).length;

    res.json({
      success: true,
      count: notifications.length,
      unreadCount,
      notifications
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private - Admin/Superadmin
router.put('/:id/read', [
  protect,
  authorize('admin', 'superadmin')
], async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Check if already read
    const alreadyRead = notification.readBy.some(
      r => r.user.toString() === req.user._id.toString()
    );

    if (!alreadyRead) {
      notification.readBy.push({ user: req.user._id });
      await notification.save();
    }

    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private - Admin/Superadmin
router.put('/read-all', [
  protect,
  authorize('admin', 'superadmin')
], async (req, res) => {
  try {
    const notifications = await Notification.find({
      isActive: true,
      $or: [
        { recipient: 'all' },
        { recipient: req.user.role }
      ]
    });

    for (let notification of notifications) {
      const alreadyRead = notification.readBy.some(
        r => r.user.toString() === req.user._id.toString()
      );

      if (!alreadyRead) {
        notification.readBy.push({ user: req.user._id });
        await notification.save();
      }
    }

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
