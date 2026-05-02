import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import Button from './UI/Button';
import Input from './UI/Input';
import Card from './UI/Card';
import ParticleBackground from './ParticleBackground';
import { Mail, Lock } from 'lucide-react';
import '../styles/globals.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      switch (res.data.user.role) {
        case 'patient':
          navigate('/patient');
          break;
        case 'doctor':
          navigate('/doctor');
          break;
        case 'support':
          navigate('/support');
          break;
        case 'admin':
          navigate('/admin');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-purple-900 overflow-hidden flex items-center justify-center">
      <ParticleBackground />

      <motion.div
        className="relative z-10 w-full max-w-lg px-4"
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
              Welcome Back
            </span>
            <h1 className="text-4xl font-bold text-white mb-2">
              Sign in to GoDoctor
            </h1>
            <p className="text-slate-400 font-medium">Access your appointments, messages, and care tools.</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div
                className="p-3 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-sm flex items-center space-x-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                <span>{error}</span>
              </motion.div>
            )}

            <div className="space-y-4">
              <Input
                type="email"
                name="email"
                placeholder="your@email.com"
                label="Email Address"
                variant="dark"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <Input
                type="password"
                name="password"
                placeholder="Your password"
                label="Password"
                variant="dark"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="pt-2 flex justify-center"
            >
              <Button
                type="submit"
                variant="premium"
                size="sm"
                className="w-2/3"
                disabled={isLoading}
              >
                <span>{isLoading ? 'Signing in...' : 'Sign In'}</span>
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
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-400 hover:text-blue-300 font-bold transition-colors underline underline-offset-4">
                Register now
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

export default Login;