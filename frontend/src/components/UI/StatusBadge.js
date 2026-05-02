import React from 'react';
import { motion } from 'framer-motion';

const StatusBadge = ({ status, className = '' }) => {
  const statusMap = {
    confirmed: { color: 'badge-confirmed', label: 'Confirmed' },
    pending: { color: 'badge-pending', label: 'Pending' },
    cancelled: { color: 'badge-cancelled', label: 'Cancelled' },
    completed: { color: 'badge-confirmed', label: 'Completed' }
  };

  const { color, label } = statusMap[status] || statusMap.pending;

  return (
    <motion.span
      className={`badge-status ${color} ${className}`}
      whileHover={{ scale: 1.1 }}
      transition={{ duration: 0.2 }}
    >
      {label}
    </motion.span>
  );
};

export default StatusBadge;
