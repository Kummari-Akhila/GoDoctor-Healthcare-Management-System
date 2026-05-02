const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  permissions: [{
    type: String,
    enum: [
      'read_users', 'write_users', 'delete_users',
      'read_appointments', 'write_appointments', 'delete_appointments',
      'read_prescriptions', 'write_prescriptions', 'delete_prescriptions',
      'read_support_tickets', 'write_support_tickets', 'delete_support_tickets',
      'read_reports', 'write_reports',
      'verify_doctors', 'manage_roles'
    ]
  }],
  description: String
});

module.exports = mongoose.model('Role', roleSchema);