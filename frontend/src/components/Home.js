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
    <div className="min-h-screen bg-slate-950 overflow-hidden relative">
      <ParticleBackground />
      
      {/* Radial glow background effect */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Navigation */}
      <motion.nav
        className="relative z-20 border-b border-white/5 backdrop-blur-md bg-slate-950/50"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-lg shadow-lg" />
            GoDoctor
          </h1>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-slate-400 hover:text-white font-bold transition-colors">
              Sign In
            </Link>
            <Link to="/register">
              <Button variant="premium" size="sm" className="px-8">Get Started</Button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 py-24 sm:py-36 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="space-y-8">
          <motion.h2
            className="text-6xl sm:text-7xl md:text-8xl font-black leading-tight"
          >
            <span className="text-white">Your Health,</span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Our Priority</span>
          </motion.h2>

          <motion.p
            className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            GoDoctor brings patients and world-class doctors together on a single, secure, and intuitive platform.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          >
            <Link to="/register">
              <Button variant="premium" size="lg" className="flex items-center gap-3 px-10 py-5 text-xl">
                Start Your Journey <ArrowRight size={22} />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="border-slate-800 text-slate-300 hover:text-white px-10 py-5 text-xl">
                Sign In
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <h3 className="text-4xl font-black text-center mb-16 text-white tracking-tight">
          Everything you need in <span className="text-blue-500">one place</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div key={idx} variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <Card variant="dark-premium" className="h-full p-8 border-white/5 bg-slate-900/40">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-6 border border-white/5">
                    <Icon className="w-7 h-7 text-blue-400" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">
                    {feature.title}
                  </h4>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Benefits Section */}
      <motion.section
        className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 py-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <Card variant="dark-premium" className="p-12 lg:p-20 border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full group-hover:bg-blue-500/20 transition-all" />
          
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-12">
            <div className="max-w-xl space-y-8 text-center lg:text-left">
              <h3 className="text-4xl lg:text-5xl font-black text-white leading-tight">Ready to transform your healthcare?</h3>
              <ul className="space-y-5">
                {[
                  'Quick and easy registration in minutes',
                  'Secure HIPAA-compliant platform',
                  '24/7 access to your health records',
                  'Real-time notification system'
                ].map((benefit, idx) => (
                  <motion.li
                    key={idx}
                    className="flex items-center gap-4 text-slate-400 font-bold text-lg"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div className="w-6 h-6 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    </div>
                    {benefit}
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="flex-shrink-0">
              <Link to="/register">
                <Button variant="premium" size="lg" className="px-12 py-6 text-2xl shadow-2xl shadow-purple-500/20">
                  Create Account Today
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </motion.section>

      {/* Footer */}
      <motion.footer
        className="relative z-10 border-t border-white/5 backdrop-blur-md bg-slate-950/50 mt-24"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16 text-center">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-md" />
            <span className="text-xl font-black text-white tracking-tight">GoDoctor</span>
          </div>
          <p className="text-slate-500 font-medium">&copy; 2026 GoDoctor. All rights reserved.</p>
          <p className="text-xs text-slate-600 mt-2 uppercase tracking-widest font-black">Your health, our mission.</p>
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