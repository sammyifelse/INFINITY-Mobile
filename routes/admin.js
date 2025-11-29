const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/admin/list
// @desc    Get all admins (Superadmin)
// @access  Private - Superadmin
router.get('/list', [
  protect,
  authorize('superadmin')
], async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' })
      .select('-password')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: admins.length,
      admins
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/admin/create
// @desc    Create new admin (Superadmin)
// @access  Private - Superadmin
router.post('/create', [
  protect,
  authorize('superadmin'),
  body('name').notEmpty().trim(),
  body('username').notEmpty().trim(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  try {
    const { name, username, password } = req.body;

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create admin
    const admin = await User.create({
      name,
      username,
      password,
      role: 'admin',
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      admin: {
        id: admin._id,
        name: admin.name,
        username: admin.username,
        role: admin.role,
        isActive: admin.isActive
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/admin/:id/deactivate
// @desc    Deactivate admin (Superadmin)
// @access  Private - Superadmin
router.put('/:id/deactivate', [
  protect,
  authorize('superadmin')
], async (req, res) => {
  try {
    const admin = await User.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    if (admin.role !== 'admin') {
      return res.status(400).json({ message: 'User is not an admin' });
    }

    admin.isActive = false;
    await admin.save();

    res.json({
      success: true,
      message: 'Admin deactivated successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/admin/:id/activate
// @desc    Activate admin (Superadmin)
// @access  Private - Superadmin
router.put('/:id/activate', [
  protect,
  authorize('superadmin')
], async (req, res) => {
  try {
    const admin = await User.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    if (admin.role !== 'admin') {
      return res.status(400).json({ message: 'User is not an admin' });
    }

    admin.isActive = true;
    await admin.save();

    res.json({
      success: true,
      message: 'Admin activated successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/admin/:id
// @desc    Delete admin (Superadmin)
// @access  Private - Superadmin
router.delete('/:id', [
  protect,
  authorize('superadmin')
], async (req, res) => {
  try {
    const admin = await User.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    if (admin.role !== 'admin') {
      return res.status(400).json({ message: 'User is not an admin' });
    }

    await admin.deleteOne();

    res.json({
      success: true,
      message: 'Admin deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
