const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['shopkeeper', 'admin', 'superadmin'],
    required: true
  },
  // Shopkeeper specific fields
  shopName: {
    type: String,
    trim: true,
    required: function() {
      return this.role === 'shopkeeper';
    }
  },
  phoneNumber: {
    type: String,
    required: function() {
      return this.role === 'shopkeeper';
    },
    trim: true
  },
  // Admin/Superadmin specific fields
  username: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    required: function() {
      return this.role === 'admin' || this.role === 'superadmin';
    }
  },
  password: {
    type: String,
    required: function() {
      return this.role === 'admin' || this.role === 'superadmin';
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Method to compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
