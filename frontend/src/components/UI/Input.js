import React from 'react';
import { motion } from 'framer-motion';
import '../../styles/globals.css';

const Input = ({ 
  label, 
  error, 
  variant = 'modern',
  className = '',
  ...props 
}) => {
  const variants = {
    modern: 'input-modern',
    clay: 'clay-input',
    dark: 'h-12 px-4 py-3 text-base bg-slate-900/50 border border-slate-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-white rounded-xl placeholder:text-slate-500 transition-all outline-none'
  };

  const labelStyles = {
    modern: 'text-gray-300',
    clay: 'clay-label',
    dark: 'text-slate-400 font-medium'
  };

  return (
    <motion.div 
      className="w-full"
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
    >
      {label && (
        <label className={`block text-sm font-medium mb-2 ${labelStyles[variant]}`}>
          {label}
        </label>
      )}
      <div className="relative group">
        <input
          className={`${variants[variant]} w-full px-4 ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-red-400 text-sm mt-1">{error}</p>
      )}
    </motion.div>
  );
};

export default Input;
