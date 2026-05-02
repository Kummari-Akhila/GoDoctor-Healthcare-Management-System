const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const SupportTicket = require('../models/SupportTicket');

const router = express.Router();

// Create support ticket
router.post('/ticket', auth, async (req, res) => {
  try {
    const { name, email, role, subject, category, message } = req.body;
    const ticket = new SupportTicket({
      user: req.user.id,
      name,
      email,
      role,
      subject,
      category,
      message,
      status: 'open'
    });
    await ticket.save();
    res.json(ticket);
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all tickets (support/admin role only)
router.get('/tickets', auth, authorize('support', 'admin'), async (req, res) => {
  try {
    const tickets = await SupportTicket.find()
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update ticket status (resolve)
router.put('/:id', auth, authorize('support', 'admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const ticket = await SupportTicket.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Send message
router.post('/messages', auth, async (req, res) => {
  try {
    const { ticketId, content, sender } = req.body;
    const ticket = await SupportTicket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check if user has access
    if (ticket.user.toString() !== req.user.id && req.user.role !== 'support' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    ticket.messages.push({
      sender: req.user.id,
      message: content,
      timestamp: new Date()
    });
    ticket.updatedAt = Date.now();
    await ticket.save();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;