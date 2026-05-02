const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const Patient = require('../models/Patient');
const User = require('../models/User');

const router = express.Router();

// Get doctor profile
router.get('/profile', auth, authorize('doctor'), async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id }).populate('user', 'name email');
    if (!doctor) {
      // Return a skeleton if not found to avoid 404s on first-time login
      return res.json({ profileCompleted: false });
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create/Initial Save doctor profile
router.post('/profile', auth, authorize('doctor'), async (req, res) => {
  try {
    const doctorData = {
      ...req.body,
      user: req.user.id,
      profileCompleted: true
    };
    // Ensure location is trimmed or normalized if provided
    if (doctorData.location) doctorData.location = doctorData.location.trim();
    
    const doctor = await Doctor.findOneAndUpdate(
      { user: req.user.id },
      doctorData,
      { new: true, upsert: true, runValidators: true }
    );
    res.json(doctor);
  } catch (error) {
    console.error('Error saving profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update doctor profile
router.put('/profile', auth, authorize('doctor'), async (req, res) => {
  try {
    const { name, fullName, phone, gender, dob, address, ...profileData } = req.body;
    const updateData = { ...profileData, profileCompleted: true, fullName: name || fullName };
    if (updateData.location) updateData.location = updateData.location.trim();
    
    // Update User data first if relevant fields changed
    const userUpdate = {};
    if (name || fullName) userUpdate.name = name || fullName;
    if (phone) userUpdate.phone = phone;
    if (gender) userUpdate.gender = gender;
    if (dob) userUpdate.dateOfBirth = dob;
    if (address) userUpdate.address = address;
    
    if (Object.keys(userUpdate).length > 0) {
      await User.findByIdAndUpdate(req.user.id, userUpdate);
    }

    const doctor = await Doctor.findOneAndUpdate(
      { user: req.user.id },
      updateData,
      { new: true, runValidators: true, upsert: true }
    ).populate('user', 'name email phone gender dateOfBirth address');

    res.json(doctor);
  } catch (error) {
    console.error('Update doctor profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get dashboard stats
router.get('/stats', auth, authorize('doctor'), async (req, res) => {
  try {
    const totalPatients = await Appointment.distinct('patient', { doctor: req.user.id });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayVisits = await Appointment.countDocuments({
      doctor: req.user.id,
      date: { $gte: today, $lt: tomorrow }
    });

    const pendingReports = await Appointment.countDocuments({
      doctor: req.user.id,
      status: 'pending'
    });

    res.json({
      totalPatients: totalPatients.length,
      todayVisits,
      pendingReports
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get today's appointments
router.get('/appointments/today', auth, authorize('doctor'), async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointments = await Appointment.find({
      doctor: req.user.id,
      date: { $gte: today, $lt: tomorrow }
    }).populate('patient', 'name email phone');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get appointments
router.get('/appointments', auth, authorize('doctor'), async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user.id })
      .populate('patient', 'name email phone')
      .sort({ date: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update appointment status
router.put('/appointments/:id', auth, authorize('doctor'), async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, doctor: req.user.id },
      { status },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get patient appointments
router.get('/patients/:id/appointments', auth, authorize('doctor'), async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctor: req.user.id,
      patient: req.params.id
    })
      .sort({ date: -1 })
      .populate('patient', 'name email')
      .populate('doctor', 'name email');

    res.json(appointments);
  } catch (error) {
    console.error('Error fetching patient appointments:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get patient prescriptions
router.get('/patients/:id/prescriptions', auth, authorize('doctor'), async (req, res) => {
  try {
    const prescriptions = await Prescription.find({
      doctor: req.user.id,
      patient: req.params.id
    })
      .sort({ createdAt: -1 });

    res.json(prescriptions);
  } catch (error) {
    console.error('Error fetching patient prescriptions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get patient details
router.get('/patients/:id', auth, authorize('doctor'), async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.params.id }).populate('user');
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create prescription
router.post('/prescriptions', auth, authorize('doctor'), async (req, res) => {
  try {
    const prescriptionData = {
      ...req.body,
      doctor: req.user.id
    };

    if (!prescriptionData.appointment) {
      delete prescriptionData.appointment;
    }

    const prescription = new Prescription(prescriptionData);
    await prescription.save();
    res.json(prescription);
  } catch (error) {
    console.error('Error creating prescription:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get prescriptions
router.get('/prescriptions', auth, authorize('doctor'), async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ doctor: req.user.id })
      .populate('patient', 'name email')
      .sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get patients linked to doctor (who booked appointments)
router.get('/patients', auth, authorize('doctor'), async (req, res) => {
  try {
    const doctorId = req.user.id; // User ID of the doctor

    // 1. Get unique patient IDs from appointments for this doctor
    const patientIds = await Appointment.distinct('patient', { doctor: doctorId });

    // 2. Fetch patient records for those users and populate the user profile
    const patients = await Patient.find({ user: { $in: patientIds } })
      .populate('user', 'name email phone gender');

    res.json(patients);
  } catch (error) {
    console.error('Error fetching doctor patients:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get doctor schedule
router.get('/schedule', auth, authorize('doctor'), async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    // Format response to match frontend expectations
    res.json({
      workingHours: {
        start: doctor.startTime || '09:00',
        end: doctor.endTime || '17:00'
      },
      daysAvailable: doctor.workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      isActive: doctor.isActive !== undefined ? doctor.isActive : true,
      timeSlots: [] // Placeholder if needed
    });
  } catch (error) {
    console.error('Error fetching schedule:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update doctor schedule
router.post('/schedule', auth, authorize('doctor'), async (req, res) => {
  try {
    const { workingHours, daysAvailable, isActive } = req.body;
    
    const doctor = await Doctor.findOneAndUpdate(
      { user: req.user.id },
      {
        startTime: workingHours.start,
        endTime: workingHours.end,
        workingDays: daysAvailable,
        isActive: isActive
      },
      { new: true, upsert: true }
    );
    
    res.json({
      workingHours: {
        start: doctor.startTime,
        end: doctor.endTime
      },
      daysAvailable: doctor.workingDays,
      isActive: doctor.isActive,
      timeSlots: []
    });
  } catch (error) {
    console.error('Error updating schedule:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;