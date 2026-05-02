const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fullName: String,
  gender: String,
  dob: Date,
  profilePhoto: String,
  specialization: {
    type: String,
    default: ''
  },
  qualifications: [String],
  experience: Number,
  licenseNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  hospitalName: String,
  location: {
    type: String,
    default: ''
  },
  phone: String,
  address: String,
  workingDays: [String],
  startTime: String,
  endTime: String,
  consultationFee: Number,
  bio: String,
  profileCompleted: {
    type: Boolean,
    default: false
  },
  availability: [{
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    startTime: String,
    endTime: String
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
});

module.exports = mongoose.model('Doctor', doctorSchema);