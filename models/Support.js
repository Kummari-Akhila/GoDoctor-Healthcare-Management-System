const mongoose = require('mongoose');

const supportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  department: {
    type: String,
    default: 'General'
  },
  shift: {
    type: String,
    enum: ['morning', 'afternoon', 'night', 'flexible'],
    default: 'flexible'
  },
  contactNumber: String,
  active: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Support', supportSchema);
