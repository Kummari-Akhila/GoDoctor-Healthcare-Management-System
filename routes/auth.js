const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Support = require('../models/Support');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['patient', 'doctor', 'support'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    if (role === 'patient') {
      const patient = new Patient({
        user: user._id,
        medicalHistory: [],
        allergies: [],
        bloodType: '',
        emergencyContact: {
          name: '',
          phone: '',
          relationship: ''
        },
        insurance: {
          provider: '',
          policyNumber: '',
          groupNumber: ''
        }
      });
      await patient.save();
    } else if (role === 'doctor') {
      const doctor = new Doctor({
        user: user._id,
        specialization: '',
        licenseNumber: undefined,
        experience: 0,
        qualifications: [],
        hospital: '',
        consultationFee: 0,
        availability: [],
        rating: 0,
        isVerified: false
      });
      await doctor.save();
    } else if (role === 'support') {
      const support = new Support({
        user: user._id,
        department: 'General',
        shift: 'flexible',
        contactNumber: '',
        active: true
      });
      await support.save();
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name, email, role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', [
  body('email').isEmail(),
  body('password').exists()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;