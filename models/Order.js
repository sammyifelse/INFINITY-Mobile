const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  shopkeeper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shopkeeperName: {
    type: String,
    required: true
  },
  shopName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  orderContent: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Delivered', 'Completed', 'Cancelled', 'Deleted'],
    default: 'Pending'
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  deletedAt: {
    type: Date
  },
  deliveredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  deliveredAt: {
    type: Date
  },
  completedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  completedAt: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  },
  viewedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    viewedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for faster queries
orderSchema.index({ shopkeeper: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model('Order', orderSchema);
