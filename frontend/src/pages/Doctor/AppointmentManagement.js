import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, CheckCircle2, XCircle, Filter, Search, MessageSquare } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import StatusBadge from '../../components/UI/StatusBadge';

const AppointmentManagement = ({ todayOnly = false }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        const url = todayOnly 
          ? 'http://localhost:5000/api/doctors/appointments/today'
          : 'http://localhost:5000/api/doctors/appointments';
        
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAppointments(res.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [todayOnly]);

  const handleStatusUpdate = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/doctors/appointments/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(appointments.map(apt =>
        apt._id === id ? { ...apt, status } : apt
      ));
    } catch (error) {
      alert('Error updating appointment status');
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesFilter = filter === 'all' || apt.status === filter;
    const matchesSearch = apt.patient.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-purple-400 font-bold tracking-widest text-xs uppercase">
            Appointments
          </span>
          <h2 className="text-4xl font-black text-white mt-1">
            {todayOnly ? "Today's Schedule" : "All Appointments"}
          </h2>
          <p className="text-slate-400 font-medium mt-2">
            Manage your patient visits and booking requests.
          </p>
        </div>

        {!todayOnly && (
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text"
                placeholder="Search patients..."
                className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white focus:border-blue-500 transition-all outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <Filter size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <select 
                className="bg-slate-900/50 border border-white/5 rounded-xl py-3 pl-12 pr-8 text-white focus:border-blue-500 transition-all outline-none appearance-none"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <Card variant="dark-premium" className="p-8">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-16 space-y-6">
            <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto border border-white/5">
              <Calendar size={32} className="text-slate-600" />
            </div>
            <div className="space-y-2">
              <h4 className="text-2xl font-bold text-white">No appointments found</h4>
              <p className="text-slate-500 max-w-md mx-auto">Your schedule is currently clear for this selection.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {filteredAppointments.map((apt, idx) => (
                <motion.div
                  key={apt._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card variant="glass-premium" className="p-6 border-white/5 bg-white/5 hover:border-blue-500/30 transition-all group h-full flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex gap-4">
                        <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20 shadow-inner">
                          <User size={24} className="text-purple-400" />
                        </div>
                        <div>
                          <h5 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                            {apt.patient.name}
                          </h5>
                          <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">
                            Patient
                          </p>
                        </div>
                      </div>
                      <StatusBadge status={apt.status} />
                    </div>

                    <div className="space-y-4 flex-1">
                      <div className="flex gap-6 p-4 rounded-2xl bg-slate-900/40 border border-white/5">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-blue-400" />
                          <span className="text-slate-300 font-bold text-sm">
                            {new Date(apt.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-blue-400" />
                          <span className="text-slate-300 font-bold text-sm">
                            {apt.time}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/5">
                        <div className="flex items-center gap-2 mb-2 text-slate-500">
                          <MessageSquare size={14} />
                          <span className="text-xs font-bold uppercase tracking-widest">Reason for Visit</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                          {apt.reason}
                        </p>
                      </div>
                    </div>

                    {apt.status === 'pending' && (
                      <div className="mt-6 pt-6 border-t border-white/5 flex gap-3">
                        <Button 
                          variant="premium" 
                          size="sm" 
                          className="flex-1 flex items-center justify-center gap-2"
                          onClick={() => handleStatusUpdate(apt._id, 'confirmed')}
                        >
                          <CheckCircle2 size={16} />
                          Accept
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 border-red-500/20 text-red-400 hover:bg-red-500/10 flex items-center justify-center gap-2"
                          onClick={() => handleStatusUpdate(apt._id, 'cancelled')}
                        >
                          <XCircle size={16} />
                          Reject
                        </Button>
                      </div>
                    )}

                    {apt.status === 'confirmed' && (
                      <div className="mt-6 pt-6 border-t border-white/5">
                        <Button 
                          variant="premium" 
                          size="sm" 
                          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 shadow-green-500/20"
                          onClick={() => handleStatusUpdate(apt._id, 'completed')}
                        >
                          <CheckCircle2 size={16} />
                          Mark Completed
                        </Button>
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

export default AppointmentManagement;