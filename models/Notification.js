const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['new_order', 'order_delivered', 'order_completed'],
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  recipient: {
    type: String,
    enum: ['admin', 'superadmin', 'all'],
    default: 'all'
  },
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
notificationSchema.index({ recipient: 1, isActive: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
