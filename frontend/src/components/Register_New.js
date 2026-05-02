import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import Button from './UI/Button';
import Input from './UI/Input';
import Card from './UI/Card';
import ParticleBackground from './ParticleBackground';
import { User, Mail, Lock, UserCheck, AlertCircle } from 'lucide-react';
import '../styles/globals.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setSuccess(true);
      
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const roleDescriptions = {
    patient: '👤 Book appointments and manage your health',
    doctor: '👨‍⚕️ Manage patients and consultations',
    support: '🎧 Provide patient support and assistance'
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-purple-900 overflow-hidden flex items-center justify-center">
      <ParticleBackground />

      <motion.div
        className="relative z-10 w-full max-w-2xl px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card variant="glass-blue" className="shadow-2xl">
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-2">
              Join HealthConnect
            </h1>
            <p className="text-gray-400">Create your account and access healthcare</p>
          </motion.div>

          {success && (
            <motion.div
              className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-300 flex items-center space-x-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <UserCheck size={20} />
              <span>Registration successful! Redirecting to login...</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm flex items-center space-x-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <AlertCircle size={16} />
                <span>{error}</span>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="text"
                name="name"
                placeholder="Your full name"
                label="Full Name"
                icon={User}
                value={formData.name}
                onChange={handleChange}
                required
              />

              <Input
                type="email"
                name="email"
                placeholder="your@email.com"
                label="Email Address"
                icon={Mail}
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <Input
              type="password"
              name="password"
              placeholder="Min 6 characters"
              label="Password"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              minLength={6}
              required
            />

            {/* Role Selection */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-3">
                I am a...
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['patient', 'doctor', 'support'].map((role, idx) => (
                  <motion.button
                    key={role}
                    type="button"
                    onClick={() => setFormData({ ...formData, role })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.role === role
                        ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300'
                        : 'border-gray-600 bg-gray-800/30 text-gray-400 hover:border-cyan-400/50'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div className="font-semibold capitalize text-sm mb-1">{role}</div>
                    <div className="text-xs opacity-75">
                      {roleDescriptions[role].split(' ').slice(0, 3).join(' ')}
                    </div>
                  </motion.button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">{roleDescriptions[formData.role]}</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="pt-2"
            >
              <Button
                type="submit"
                variant="gradient"
                size="md"
                className="w-full flex items-center justify-center space-x-2"
                disabled={isLoading}
              >
                <UserCheck size={18} />
                <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>
              </Button>
            </motion.div>
          </form>

          {/* Footer */}
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </motion.div>
        </Card>

        {/* Decorative elements */}
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"
          animate={{ y: [0, 40, 0], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl"
          animate={{ y: [0, -40, 0], x: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </motion.div>
    </div>
  );
};

export default Register;
