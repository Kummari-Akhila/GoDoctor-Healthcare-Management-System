import React from 'react';
import { motion } from 'framer-motion';
import '../../styles/globals.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    gradient: 'btn-gradient',
    outline: 'btn-outline',
    clay: 'clay-button',
    premium: 'btn-premium'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'h-12 px-6 text-base rounded-xl flex items-center justify-center',
    lg: 'h-14 px-8 text-lg rounded-xl flex items-center justify-center'
  };

  return (
    <motion.button
      className={`${variants[variant]} ${sizes[size]} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
