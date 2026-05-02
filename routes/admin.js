const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Support = require('../models/Support');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const SupportTicket = require('../models/SupportTicket');

const router = express.Router();

// Get all users with optional role filter
router.get('/users', auth, authorize('admin'), async (req, res) => {
  try {
    const { role } = req.query;
    const query = role ? { role } : {};
    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user permanently with cascaded deletion
router.delete('/users/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { role } = user;

    // Delete related data based on role
    if (role === 'doctor') {
      await Doctor.findOneAndDelete({ user: user._id });
      await Appointment.deleteMany({ doctor: user._id });
      await Prescription.deleteMany({ doctor: user._id });
    } else if (role === 'patient') {
      await Patient.findOneAndDelete({ user: user._id });
      await Appointment.deleteMany({ patient: user._id });
      await Prescription.deleteMany({ patient: user._id });
    } else if (role === 'support') {
      await Support.findOneAndDelete({ user: user._id });
      // Support might have tickets assigned, we could delete or reassign
      await SupportTicket.deleteMany({ assignedTo: user._id });
    }

    // Finally delete the user
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User and all related data deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Server error during deletion' });
  }
});

// Verify doctor
router.put('/users/:id/verify', auth, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    ).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all appointments
router.get('/appointments', auth, authorize('admin'), async (req, res) => {
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

// Get system reports
router.get('/reports', auth, authorize('admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalAppointments = await Appointment.countDocuments();
    const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
    const openTickets = await SupportTicket.countDocuments({ status: { $in: ['open', 'in-progress'] } });

    res.json({
      totalUsers,
      totalDoctors,
      totalPatients,
      totalAppointments,
      pendingAppointments,
      openTickets
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user
router.put('/users/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get dashboard stats
router.get('/dashboard-stats', auth, authorize('admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    const totalSupport = await User.countDocuments({ role: 'support' });
    const totalTickets = await SupportTicket.countDocuments();

    res.json({
      totalUsers,
      totalPatients,
      totalDoctors,
      totalSupport,
      totalTickets
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Server error fetching stats' });
  }
});

// Get pending doctors
router.get('/doctors/pending', auth, authorize('admin'), async (req, res) => {
  try {
    const doctors = await Doctor.find({ isVerified: false })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify doctor
router.put('/doctors/:id/verify', auth, authorize('admin'), async (req, res) => {
  try {
    const { action } = req.body;
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { isVerified: action === 'approve' },
      { new: true }
    ).populate('user', 'name email');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get system stats
router.get('/stats', auth, authorize('admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalAppointments = await Appointment.countDocuments();

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const newUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    const appointmentsBooked = await Appointment.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    const prescriptionsIssued = await require('../models/Prescription').countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    const ticketsCreated = await SupportTicket.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    // Appointment status distribution
    const appointmentStats = await Appointment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Ticket status distribution
    const ticketStats = await SupportTicket.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      totalUsers,
      totalDoctors,
      totalPatients,
      totalAppointments,
      recentActivity: {
        newUsers,
        appointmentsBooked,
        prescriptionsIssued,
        ticketsCreated
      },
      appointmentStats: appointmentStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
      ticketStats: ticketStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {})
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;