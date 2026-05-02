const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  medicalHistory: [{
    condition: String,
    diagnosisDate: Date,
    notes: String
  }],
  allergies: [String],
  bloodType: String,
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  insurance: {
    provider: String,
    policyNumber: String,
    groupNumber: String
  }
});

module.exports = mongoose.model('Patient', patientSchema);