const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const Appointment = require('../models/Appointment');

const router = express.Router();

// Book appointment (patient)
router.post('/', auth, authorize('patient'), async (req, res) => {
  try {
    const appointment = new Appointment({
      ...req.body,
      patient: req.user.id
    });
    await appointment.save();
    res.json(appointment);
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update appointment (reschedule/cancel)
router.put('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if user is the patient or doctor
    if (appointment.patient.toString() !== req.user.id && appointment.doctor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all appointments (admin)
router.get('/', auth, authorize('admin'), async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patient', 'name email')
      .populate('doctor', 'name specialization')
      .sort({ date: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;