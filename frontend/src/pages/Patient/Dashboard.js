import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BookAppointment from './BookAppointment';
import AppointmentHistory from './AppointmentHistory';
import Prescriptions from './Prescriptions';
import Sidebar from '../../components/UI/Sidebar';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import StatusBadge from '../../components/UI/StatusBadge';
import { Calendar, User, Clock, ChevronRight, Activity, Menu } from 'lucide-react';

const Overview = ({ profile, appointments }) => {
  const isNew = appointments.length === 0;
  const nextAppointment = appointments.find((apt) => apt.status === 'confirmed');
  const recentAppointments = appointments.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card variant="dark-premium" className="p-8">
        <div className="flex flex-col lg:flex-row justify-between gap-8">
          <div className="flex-1 space-y-4">
            <div>
              <span className="text-blue-400 font-bold tracking-widest text-xs uppercase">
                Patient Overview
              </span>
              <h2 className="text-3xl font-black text-white mt-1">
                {profile ? `Hello, ${profile.user.name}` : 'Welcome to GoDoctor'}
              </h2>
            </div>
            <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
              {isNew
                ? 'Tell us what brought you here today and book your first appointment in seconds.'
                : 'Review your recent care activity, upcoming visits, and book follow-up appointments quickly.'}
            </p>
            <div className="flex gap-4 pt-2">
              <Button variant="premium" size="md" onClick={() => window.location.href='/patient/book-appointment'}>
                Book Appointment
              </Button>
              <Button variant="outline" size="md" className="border-slate-700 text-slate-300 hover:text-white" onClick={() => window.location.href='/patient/appointments'}>
                View Appointments
              </Button>
            </div>
          </div>

          <div className="w-full lg:w-80">
            <Card variant="glass-premium" className="p-6 h-full border-white/5 bg-white/5">
              <h5 className="text-white font-bold mb-4 flex items-center gap-2">
                <User size={18} className="text-blue-400" />
                Care Snapshot
              </h5>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-900/50 border border-white/5">
                  <span className="text-slate-400 text-sm">Appointments</span>
                  <span className="text-white font-bold">{appointments.length}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5">
                  <span className="text-slate-400 text-sm block mb-1">Next Visit</span>
                  <span className="text-white font-medium text-sm">
                    {nextAppointment ? `${new Date(nextAppointment.date).toLocaleDateString()} at ${nextAppointment.time}` : 'No confirmed visits'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-900/50 border border-white/5">
                  <span className="text-slate-400 text-sm">Status</span>
                  <span className="text-blue-400 text-sm font-bold uppercase tracking-tighter">
                    {isNew ? 'New' : 'Active'}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Section */}
        <Card variant="dark-premium" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xl font-bold text-white flex items-center gap-2">
              <Clock size={20} className="text-purple-400" />
              Recent Activity
            </h4>
          </div>
          
          {isNew ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto border border-white/5">
                <Calendar size={24} className="text-slate-500" />
              </div>
              <p className="text-slate-500 font-medium">No appointments yet</p>
              <Button variant="premium" size="sm" onClick={() => window.location.href='/patient/book-appointment'}>
                Book Your First Visit
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentAppointments.map((apt) => (
                <div key={apt._id} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all group">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                        <User size={20} className="text-blue-400" />
                      </div>
                      <div>
                        <h5 className="text-white font-bold group-hover:text-blue-400 transition-colors">Dr. {apt.doctor.name}</h5>
                        <p className="text-slate-500 text-sm font-medium">
                          {new Date(apt.date).toLocaleDateString()} • {apt.time}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={apt.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Health Insights / Welcome back */}
        <Card variant="glass-premium" className="p-6 bg-blue-500/5 border-blue-500/10 flex flex-col justify-center items-center text-center space-y-4">
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20">
            <Activity size={32} className="text-blue-400" />
          </div>
          <h4 className="text-xl font-bold text-white">Your Health Journey</h4>
          <p className="text-slate-400 max-w-xs">
            Use the sidebar to manage your appointments, view prescriptions, and update your medical profile.
          </p>
          <div className="flex gap-2">
            <div className="px-3 py-1 bg-slate-900/50 rounded-lg border border-white/5 text-xs font-bold text-slate-500 uppercase tracking-widest">Verified Account</div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const [profileRes, appointmentRes] = await Promise.all([
          axios.get('http://localhost:5000/api/patients/profile', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/patients/appointments', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setProfile(profileRes.data);
        setAppointments(appointmentRes.data);
      } catch (error) {
        console.error('Error loading patient dashboard:', error);
        if (error.response?.status === 401) navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 font-bold animate-pulse">Loading GoDoctor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 md:p-12 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <Routes>
          <Route path="/" element={<Overview profile={profile} appointments={appointments} />} />
          <Route path="dashboard" element={<Overview profile={profile} appointments={appointments} />} />
          <Route path="book-appointment" element={<BookAppointment />} />
          <Route path="appointments" element={<AppointmentHistory />} />
          <Route path="prescriptions" element={<Prescriptions />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
