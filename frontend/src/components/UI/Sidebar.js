import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Calendar, Clock, LogOut, Menu, X, Users, Pill, Settings, CalendarDays, User, Search, PlusCircle, FileText, MessageSquare } from 'lucide-react';
import '../../styles/globals.css';

const Sidebar = ({ isOpen, onClose, userRole = 'patient' }) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = {
    patient: [
      { icon: Home, label: 'Dashboard', path: '/patient/dashboard' },
      { icon: PlusCircle, label: 'Book Appointment', path: '/patient/book-appointment' },
      { icon: Calendar, label: 'My Appointments', path: '/patient/appointments' },
      { icon: Pill, label: 'Prescriptions', path: '/patient/prescriptions' },
      { icon: FileText, label: 'Medical History', path: '/patient/appointments' },
      { icon: User, label: 'Profile', path: '/patient/profile' },
      { icon: MessageSquare, label: 'Support', path: '/patient/support' }
    ],
    doctor: [
      { icon: Home, label: 'Dashboard', path: '/doctor/dashboard' },
      { icon: Clock, label: "Today's Appointments", path: '/doctor/today' },
      { icon: Calendar, label: 'All Appointments', path: '/doctor/appointments' },
      { icon: Users, label: 'Patient Records', path: '/doctor/patients' },
      { icon: Pill, label: 'Prescriptions', path: '/doctor/prescriptions' },
      { icon: Settings, label: 'Availability', path: '/doctor/schedule' },
      { icon: User, label: 'Profile', path: '/doctor/profile' },
      { icon: MessageSquare, label: 'Support', path: '/doctor/support' }
    ],
    support: [
      { icon: Home, label: 'Dashboard', path: '/support/dashboard' },
      { icon: Clock, label: 'Tickets', path: '/support/tickets' },
      { icon: User, label: 'Profile', path: '/support/profile' }
    ],
    admin: [
      { icon: Home, label: 'Dashboard', path: '/admin' },
      { icon: Users, label: 'Manage Users', path: '/admin/users' },
      { icon: User, label: 'Manage Patients', path: '/admin/patients' },
      { icon: User, label: 'Manage Doctors', path: '/admin/doctors' },
      { icon: MessageSquare, label: 'Manage Support', path: '/admin/support' }
    ]
  };

  const items = menuItems[userRole] || menuItems.patient;

  const isActive = (path) => {
    if (path.includes('/profile')) {
      return location.pathname.includes('/profile') || location.pathname.includes('/edit-profile');
    }
    return location.pathname === path;
  };

  const sidebarVariants = {
    hidden: { x: -280, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        className={`fixed left-0 top-0 h-full w-64 z-50 flex flex-col border-r border-white/10 shadow-2xl bg-[#0f172a] 
          ${isMobile ? '' : 'sticky top-0 h-screen'}`}
        variants={sidebarVariants}
        initial={isMobile ? "hidden" : "visible"}
        animate={isMobile ? (isOpen ? 'visible' : 'hidden') : 'visible'}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Header */}
        <div className="p-8 mb-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 rounded-xl shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
              <div className="w-5 h-5 bg-white/20 rounded-full backdrop-blur-sm" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-white leading-none">
                GoDoctor
              </h1>
              <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                {userRole} portal
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar pb-8">
          {items.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <motion.div key={index}>
                <Link to={item.path}>
                  <motion.button
                    className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                      active
                        ? 'text-white shadow-lg shadow-blue-500/10'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                    whileHover={{ x: 4 }}
                    onClick={() => isMobile && onClose()}
                  >
                    {active && (
                      <motion.div
                        layoutId="active-pill"
                        className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/10 border-l-4 border-blue-500"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <Icon size={20} className={`${active ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} relative z-10 transition-colors`} />
                    <span className={`font-bold text-sm relative z-10 ${active ? 'text-white' : ''}`}>{item.label}</span>
                  </motion.button>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-6 border-t border-white/5 bg-slate-900/50">
          <motion.button
            className="w-full flex items-center justify-center space-x-2 px-4 py-3.5 rounded-xl bg-slate-800/30 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all border border-white/5 group"
            whileHover={{ scale: 1.02 }}
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              window.location.href = '/login';
            }}
          >
            <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
            <span className="font-bold text-sm">Logout</span>
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
