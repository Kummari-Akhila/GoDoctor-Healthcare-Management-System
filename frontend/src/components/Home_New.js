import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ParticleBackground from './ParticleBackground';
import Button from './UI/Button';
import Card from './UI/Card';
import { Heart, Stethoscope, Clock, Shield, ArrowRight, CheckCircle } from 'lucide-react';
import '../styles/globals.css';

const Home = () => {
  const features = [
    {
      icon: Heart,
      title: 'Patient Care',
      description: 'Access your medical records and book appointments seamlessly'
    },
    {
      icon: Stethoscope,
      title: 'Healthcare Providers',
      description: 'Manage your practice and connect with patients'
    },
    {
      icon: Clock,
      title: 'Real-time Updates',
      description: 'Stay informed about all your appointments and prescriptions'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your health data is encrypted and protected'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      <ParticleBackground />

      {/* Navigation */}
      <motion.nav
        className="relative z-20 border-b border-cyan-500/10 backdrop-blur-sm"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold gradient-text">GoDoctor</h1>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="outline" size="sm">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="text-center mb-16"
          variants={itemVariants}
        >
          <motion.h2
            className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <span className="gradient-text">Your Health,</span>
            <br />
            <span className="text-white">Our Priority</span>
          </motion.h2>

          <motion.p
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Connect with healthcare providers, manage your appointments, and take control of your health journey with HealthConnect
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={itemVariants}
          >
            <Link to="/register">
              <Button variant="gradient" size="lg" className="flex items-center gap-2">
                Start Your Journey <ArrowRight size={20} />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">Sign In</Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {[
            { number: '10K+', label: 'Active Patients' },
            { number: '500+', label: 'Healthcare Providers' },
            { number: '50K+', label: 'Appointments Booked' }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              className="text-center"
              variants={itemVariants}
            >
              <p className="text-3xl font-bold gradient-text">{stat.number}</p>
              <p className="text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <motion.h3
          className="text-4xl font-bold text-center mb-16 gradient-text"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Why Choose GoDoctor?
        </motion.h3>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div key={idx} variants={itemVariants}>
                <Card variant="modern">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <Icon className="w-8 h-8 text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">
                        {feature.title}
                      </h4>
                      <p className="text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>

      {/* Benefits Section */}
      <motion.section
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl p-12 border border-cyan-500/20">
          <h3 className="text-3xl font-bold mb-8 text-white">Ready to get started?</h3>
          <ul className="space-y-4 mb-8">
            {[
              'Quick and easy registration in minutes',
              'Secure HIPAA-compliant platform',
              '24/7 access to your health records',
              'Real-time notification system'
            ].map((benefit, idx) => (
              <motion.li
                key={idx}
                className="flex items-center gap-3 text-gray-300"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <CheckCircle className="w-5 h-5 text-green-400" />
                {benefit}
              </motion.li>
            ))}
          </ul>
          <Link to="/register">
            <Button variant="gradient" size="lg">
              Create Your Account Today
            </Button>
          </Link>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        className="relative z-10 border-t border-cyan-500/10 backdrop-blur-sm mt-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-gray-400">
          <p>&copy; 2026 HealthConnect. All rights reserved.</p>
          <p className="text-sm mt-2">Your health, our mission.</p>
        </div>
      </motion.footer>

      {/* Decorative elements */}
      <motion.div
        className="fixed -top-40 -right-40 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"
        animate={{ y: [0, 50, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="fixed -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"
        animate={{ y: [0, -50, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
    </div>
  );
};

export default Home;
