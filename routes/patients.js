const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const Patient = require('../models/Patient');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');

const router = express.Router();

// Get patient profile
router.get('/profile', auth, authorize('patient'), async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user.id }).populate('user');
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update patient profile
router.put('/profile', auth, authorize('patient'), async (req, res) => {
  try {
    const { name, fullName, phone, gender, dob, address, ...profileData } = req.body;

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

    // Update Patient profile data
    const patient = await Patient.findOneAndUpdate(
      { user: req.user.id },
      { ...profileData, address, fullName: name || fullName },
      { new: true, upsert: true }
    ).populate('user', 'name email phone gender dateOfBirth address');

    res.json(patient);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search doctors by location and specialization
router.get('/doctors', auth, authorize('patient'), async (req, res) => {
  try {
    const { specialization, location } = req.query;
    
    console.log('DEBUG: Doctor Search Request:', { location, specialization });
    
    // RELAXED FILTER: First, find ALL doctors who have a user account
    const allDoctors = await Doctor.find().populate('user', 'name email role');
    console.log(`DEBUG: Total doctors in database: ${allDoctors.length}`);

    const results = allDoctors.filter(doc => {
      if (!doc.user) return false;

      // Location match (Partial & Case-Insensitive)
      if (location) {
        const searchStr = location.toLowerCase().trim();
        const docLocation = (doc.location || "").toLowerCase();
        const docAddress = (doc.address || "").toLowerCase();
        const docHospital = (doc.hospitalName || "").toLowerCase();
        
        // Check if the search string is found in ANY location-related field
        if (!docLocation.includes(searchStr) && 
            !docAddress.includes(searchStr) && 
            !docHospital.includes(searchStr)) {
          return false;
        }
      }

      // Specialization match
      if (specialization) {
        const specSearch = specialization.toLowerCase().trim();
        const docSpec = (doc.specialization || "").toLowerCase();
        if (!docSpec.includes(specSearch)) return false;
      }

      return true;
    }).map(doc => ({
      _id: doc._id,
      user: {
        _id: doc.user._id,
        name: doc.user.name,
        email: doc.user.email
      },
      specialization: doc.specialization || 'General',
      fullName: doc.fullName || doc.user.name,
      location: doc.location,
      profileCompleted: doc.profileCompleted,
      startTime: doc.startTime,
      endTime: doc.endTime,
      workingDays: doc.workingDays
    }));
    
    console.log(`DEBUG: Returning ${results.length} doctors after filtering`);
    res.json(results);
  } catch (error) {
    console.error('SERVER ERROR: Fetching doctors failed:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

// Get appointments
router.get('/appointments', auth, authorize('patient'), async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id })
      .populate('doctor', 'name email')
      .sort({ date: -1 });

    const appointmentsWithSpecialization = await Promise.all(appointments.map(async (apt) => {
      const doctorProfile = await Doctor.findOne({ user: apt.doctor._id });
      return {
        ...apt.toObject(),
        doctor: {
          ...apt.doctor.toObject(),
          specialization: doctorProfile ? doctorProfile.specialization : 'Medical Professional'
        }
      };
    }));

    res.json(appointmentsWithSpecialization);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get prescriptions
router.get('/prescriptions', auth, authorize('patient'), async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.user.id })
      .populate('doctor', 'name email')
      .sort({ createdAt: -1 });

    const prescriptionsWithSpecialization = await Promise.all(prescriptions.map(async (pres) => {
      const doctorProfile = await Doctor.findOne({ user: pres.doctor._id });
      return {
        ...pres.toObject(),
        doctor: {
          ...pres.doctor.toObject(),
          specialization: doctorProfile ? doctorProfile.specialization : 'Medical Professional'
        }
      };
    }));

    res.json(prescriptionsWithSpecialization);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;