import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import Button from './UI/Button';
import Input from './UI/Input';
import Card from './UI/Card';
import ParticleBackground from './ParticleBackground';
import { User, Mail, Lock, UserCheck, AlertCircle, ArrowRight } from 'lucide-react';
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
        <Card variant="dark-premium" className="shadow-2xl p-8 md:p-12">
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <span className="text-blue-400 font-black tracking-widest text-xs mb-2 block uppercase">
              Get Started
            </span>
            <h1 className="text-4xl font-bold text-white mb-2">
              Create your GoDoctor account
            </h1>
            <p className="text-slate-400 font-medium">Register as a patient, doctor, or support specialist.</p>
          </motion.div>

          {success && (
            <motion.div
              className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-2xl text-green-400 flex items-center space-x-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <UserCheck size={20} />
              <span>Registration successful! Redirecting to login...</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div
                className="p-3 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-sm flex items-center space-x-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <AlertCircle size={16} />
                <span>{error}</span>
              </motion.div>
            )}

            <div className="space-y-4">
              <Input
                type="text"
                name="name"
                placeholder="Your full name"
                label="Name"
                variant="dark"
                icon={User}
                value={formData.name}
                onChange={handleChange}
                required
              />

              <Input
                type="email"
                name="email"
                placeholder="your@email.com"
                label="Email"
                variant="dark"
                icon={Mail}
                value={formData.email}
                onChange={handleChange}
                required
              />

              <Input
                type="password"
                name="password"
                placeholder="Min 6 characters"
                label="Password"
                variant="dark"
                icon={Lock}
                value={formData.password}
                onChange={handleChange}
                minLength={6}
                required
              />
            </div>

            {/* Role Selection */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-2"
            >
              <label className="text-slate-400 font-medium text-sm block ml-1">
                Role
              </label>
            <div className="relative group">
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full h-12 bg-slate-900/50 border border-slate-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-white rounded-xl px-4 appearance-none outline-none transition-all text-base"
              >
                <option value="patient" className="bg-slate-900">Patient</option>
                <option value="doctor" className="bg-slate-900">Doctor</option>
                <option value="support" className="bg-slate-900">Support Specialist</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-focus-within:text-purple-500 transition-colors">
                <ArrowRight size={18} className="rotate-90" />
              </div>
            </div>
              <p className="text-xs text-slate-500 mt-2 font-medium ml-1">{roleDescriptions[formData.role]}</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="pt-6 flex justify-center"
            >
              <Button
                type="submit"
                variant="premium"
                size="sm"
                className="w-2/3"
                disabled={isLoading}
              >
                <span>{isLoading ? 'Creating account...' : 'Start Journey'}</span>
              </Button>
            </motion.div>
          </form>

          {/* Footer */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <p className="text-slate-400 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-bold transition-colors underline underline-offset-4">
                Login here
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