const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// @route   POST /api/auth/shopkeeper/login
// @desc    Shopkeeper login/registration
// @access  Public
router.post('/shopkeeper/login', [
  body('name').notEmpty().trim(),
  body('shopName').notEmpty().trim(),
  body('phoneNumber').notEmpty().trim()
], async (req, res) => {
  try {
    const { name, shopName, phoneNumber } = req.body;

    // Find existing shopkeeper by phone number
    let user = await User.findOne({ phoneNumber, role: 'shopkeeper' });

    if (user) {
      // Update last login
      user.lastLogin = Date.now();
      await user.save();
    } else {
      // Create new shopkeeper
      user = await User.create({
        name,
        shopName,
        phoneNumber,
        role: 'shopkeeper'
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        shopName: user.shopName,
        phoneNumber: user.phoneNumber,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/auth/admin/login
// @desc    Admin login
// @access  Public
router.post('/admin/login', [
  body('username').notEmpty().trim(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find admin
    const user = await User.findOne({ username, role: 'admin', isActive: true });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/auth/superadmin/login
// @desc    Superadmin login
// @access  Public
router.post('/superadmin/login', [
  body('username').notEmpty().trim(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find superadmin
    const user = await User.findOne({ username, role: 'superadmin', isActive: true });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/auth/customer/login
// @desc    Customer login/registration
// @access  Public
router.post('/customer/login', [
  body('name').notEmpty().trim(),
  body('address').notEmpty().trim(),
  body('phoneNumber').notEmpty().trim()
], async (req, res) => {
  try {
    const { name, address, phoneNumber } = req.body;

    // Find existing customer by phone number
    let user = await User.findOne({ phoneNumber, role: 'customer' });

    if (user) {
      // Update customer details
      user.name = name;
      user.address = address;
      user.lastLogin = Date.now();
      await user.save();
    } else {
      // Create new customer
      user = await User.create({
        name,
        address,
        phoneNumber,
        role: 'customer'
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        address: user.address,
        phoneNumber: user.phoneNumber,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
