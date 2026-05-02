import React from 'react';
import { motion } from 'framer-motion';
import '../../styles/globals.css';

const Card = ({ 
  children, 
  variant = 'modern', 
  className = '',
  animationDelay = 0,
  ...props 
}) => {
  const variants = {
    modern: 'card-modern',
    gradient: 'card-gradient',
    glass: 'glass',
    'glass-blue': 'glass-blue',
    clay: 'clay-card',
    'glass-premium': 'glass-premium',
    'dark-premium': 'dark-card-premium'
  };

  return (
    <motion.div
      className={`${variants[variant]} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: animationDelay }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
