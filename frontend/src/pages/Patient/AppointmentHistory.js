import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import StatusBadge from '../../components/UI/StatusBadge';
import { Calendar, Clock, User, MessageSquare, Plus, AlertCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AppointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/patients/appointments', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAppointments(res.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.put(`http://localhost:5000/api/appointments/${id}`, { status: 'cancelled' }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAppointments(appointments.map((apt) =>
          apt._id === id ? { ...apt, status: 'cancelled' } : apt
        ));
      } catch (error) {
        alert('Error cancelling appointment');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-blue-400 font-bold tracking-widest text-xs uppercase">
            Appointments
          </span>
          <h2 className="text-4xl font-black text-white mt-1">Recent visits and upcoming care</h2>
          <p className="text-slate-400 font-medium mt-2">View your scheduled appointments and manage any pending bookings.</p>
        </div>
        <Link to="/patient/book-appointment">
          <Button variant="premium" size="md" className="flex items-center gap-2 px-6">
            <Plus size={18} />
            Book New
          </Button>
        </Link>
      </div>

      <Card variant="dark-premium" className="p-8">
        {appointments.length === 0 ? (
          <div className="text-center py-16 space-y-6">
            <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto border border-white/5">
              <Calendar size={32} className="text-slate-600" />
            </div>
            <div className="space-y-2">
              <h4 className="text-2xl font-bold text-white">No appointments yet</h4>
              <p className="text-slate-500 max-w-md mx-auto">Once you book your first appointment, it will appear here for easy tracking.</p>
            </div>
            <Link to="/patient/book-appointment">
              <Button variant="premium" size="lg">Book your first appointment</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {appointments.map((appointment, idx) => (
                <motion.div
                  key={appointment._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card variant="glass-premium" className="p-6 border-white/5 bg-white/5 hover:border-blue-500/30 transition-all group h-full flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex gap-4">
                        <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 shadow-inner">
                          <User size={24} className="text-blue-400" />
                        </div>
                        <div>
                          <h5 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                            Dr. {appointment.doctor.name}
                          </h5>
                          <p className="text-blue-400/70 text-sm font-bold uppercase tracking-wider">
                            {appointment.doctor.specialization}
                          </p>
                        </div>
                      </div>
                      <StatusBadge status={appointment.status} />
                    </div>

                    <div className="space-y-4 flex-1">
                      <div className="flex gap-6 p-4 rounded-2xl bg-slate-900/40 border border-white/5">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-purple-400" />
                          <span className="text-slate-300 font-bold text-sm">
                            {new Date(appointment.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-purple-400" />
                          <span className="text-slate-300 font-bold text-sm">
                            {appointment.time}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/5">
                        <div className="flex items-center gap-2 mb-2 text-slate-500">
                          <MessageSquare size={14} />
                          <span className="text-xs font-bold uppercase tracking-widest">Reason</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                          {appointment.reason}
                        </p>
                      </div>
                    </div>

                    {appointment.status === 'pending' && (
                      <div className="mt-6 pt-6 border-t border-white/5">
                        <button 
                          className="w-full py-3 rounded-xl bg-red-500/10 text-red-400 text-sm font-bold hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
                          onClick={() => handleCancel(appointment._id)}
                        >
                          <XCircle size={16} />
                          Cancel Appointment
                        </button>
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default AppointmentHistory;
