const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const Prescription = require('../models/Prescription');

const router = express.Router();

// Get prescriptions (admin)
router.get('/', auth, authorize('admin'), async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate('patient', 'name email')
      .populate('doctor', 'name specialization')
      .sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get prescription by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patient', 'name email')
      .populate('doctor', 'name specialization');

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    // Check if user has access
    if (prescription.patient.toString() !== req.user.id && prescription.doctor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(prescription);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;