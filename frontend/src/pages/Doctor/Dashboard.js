import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import Sidebar from '../../components/UI/Sidebar';
import AppointmentManagement from './AppointmentManagement';
import PatientRecords from './PatientRecords';
import PatientDetails from './PatientDetails';
import PrescriptionForm from './PrescriptionForm';
import AvailabilityManagement from './AvailabilityManagement';
import ProfileSettings from './ProfileSettings';
import { Menu, User, Bell, Users, Clock, FileText, ChevronRight, Activity, CalendarDays, ShieldCheck } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import StatusBadge from '../../components/UI/StatusBadge';

const Overview = ({ user }) => {
  const [stats, setStats] = useState({
    totalPatients: '0',
    todayVisits: '0',
    pendingReports: '0'
  });
  const [todayApts, setTodayApts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [statsRes, todayRes, profileRes] = await Promise.all([
          axios.get('http://localhost:5000/api/doctors/stats', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5000/api/doctors/appointments/today', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5000/api/doctors/profile', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        if (profileRes.data && !profileRes.data.profileCompleted) {
          window.location.href = '/doctor/complete-profile';
          return;
        }

        setStats(statsRes.data);
        setTodayApts(todayRes.data);
        setProfile(profileRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) fetchDashboardData();
  }, [user]);

  const isProfileComplete = () => {
    if (!profile) return true; // Don't show while loading
    return profile.profileCompleted === true;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Profile Completion Notice */}
      {!isProfileComplete() && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-3xl bg-pink-500/10 border border-pink-500/20 flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-pink-500/20 rounded-2xl flex items-center justify-center text-pink-400">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="text-white font-bold">Complete Your Professional Profile</h4>
              <p className="text-slate-400 text-sm">Your profile must be verified before patients can book appointments with you.</p>
            </div>
          </div>
          <Button variant="premium" size="sm" onClick={() => window.location.href='/doctor/settings'}>
            Complete Now
          </Button>
        </motion.div>
      )}

      {/* Welcome Hero */}
      <Card variant="dark-premium" className="p-10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full group-hover:bg-blue-500/20 transition-all" />
        <div className="relative z-10 space-y-4">
          <span className="text-blue-400 font-bold tracking-widest text-xs uppercase">
            Medical Professional Dashboard
          </span>
          <h1 className="text-4xl font-black text-white">
            Welcome back, Dr. {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
            You have <span className="text-white font-bold">{stats.todayVisits} appointments</span> scheduled for today. Review your patient records and prescriptions below.
          </p>
          <div className="flex gap-4 pt-4">
            <Button variant="premium" size="md" onClick={() => window.location.href='/doctor/today'}>
              View Today's Schedule
            </Button>
            <Button variant="outline" size="md" className="border-slate-800 text-slate-300 hover:text-white" onClick={() => window.location.href='/doctor/prescriptions'}>
              Issue Prescription
            </Button>
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Patients', value: stats.totalPatients, icon: Users, color: 'from-blue-500 to-cyan-500', shadow: 'shadow-blue-500/20' },
          { label: "Today's Visits", value: stats.todayVisits, icon: CalendarDays, color: 'from-purple-500 to-blue-500', shadow: 'shadow-purple-500/20' },
          { label: 'Pending Reports', value: stats.pendingReports, icon: Activity, color: 'from-pink-500 to-purple-500', shadow: 'shadow-pink-500/20' }
        ].map((stat, idx) => (
          <Card key={idx} variant="glass-premium" className="p-8 group hover:border-white/10 transition-all border-white/5 bg-white/5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2">{stat.label}</p>
                <p className="text-4xl font-black text-white group-hover:scale-105 transition-transform origin-left">{stat.value}</p>
              </div>
              <div className={`w-14 h-14 bg-gradient-to-tr ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg ${stat.shadow}`}>
                <stat.icon size={24} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Patients List */}
        <Card variant="dark-premium" className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-xl font-bold text-white flex items-center gap-3">
              <CalendarDays size={22} className="text-blue-400" />
              Today's Patient List
            </h4>
            <button className="text-blue-400 text-xs font-black uppercase tracking-widest hover:text-blue-300 transition-colors flex items-center gap-1 group" onClick={() => window.location.href='/doctor/today'}>
              View Schedule <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="space-y-4">
            {todayApts.length > 0 ? (
              todayApts.map((apt) => (
                <div key={apt._id} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all group">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                        <User size={20} className="text-blue-400" />
                      </div>
                      <div>
                        <h5 className="text-white font-bold group-hover:text-blue-400 transition-colors">{apt.patient.name}</h5>
                        <p className="text-slate-500 text-xs font-medium">{apt.time} • {apt.reason.slice(0, 40)}...</p>
                      </div>
                    </div>
                    <StatusBadge status={apt.status} />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto border border-white/5">
                  <CalendarDays size={24} className="text-slate-600" />
                </div>
                <p className="text-slate-500 italic">No patients scheduled for today.</p>
              </div>
            )}
          </div>
        </Card>

        {/* Quick Tools replaced by Status / Info */}
        <Card variant="glass-premium" className="p-8 bg-purple-500/5 border-purple-500/10 flex flex-col justify-center items-center text-center space-y-6">
          <div className="w-20 h-20 bg-purple-500/10 rounded-3xl flex items-center justify-center border border-purple-500/20 shadow-2xl shadow-purple-500/10">
            <ShieldCheck size={40} className="text-purple-400" />
          </div>
          <div className="space-y-2">
            <h4 className="text-2xl font-black text-white">Professional Status</h4>
            <p className="text-slate-400 max-w-xs mx-auto">
              Your professional profile is active and visible to patients. Use the sidebar to manage your practice.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="px-4 py-2 bg-slate-900/50 rounded-xl border border-white/5 text-xs font-black text-blue-400 uppercase tracking-widest">Verified Expert</div>
            <div className="px-4 py-2 bg-slate-900/50 rounded-xl border border-white/5 text-xs font-black text-green-400 uppercase tracking-widest">Online</div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="flex-1 p-8 md:p-12 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <Routes>
          <Route path="/" element={<Overview user={user} />} />
          <Route path="dashboard" element={<Overview user={user} />} />
          <Route path="today" element={<AppointmentManagement />} />
          <Route path="appointments" element={<AppointmentManagement />} />
          <Route path="patients" element={<PatientRecords />} />
          <Route path="patients/:id" element={<PatientDetails />} />
          <Route path="prescriptions" element={<PrescriptionForm />} />
          <Route path="schedule" element={<AvailabilityManagement />} />
          <Route path="settings" element={<ProfileSettings />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;