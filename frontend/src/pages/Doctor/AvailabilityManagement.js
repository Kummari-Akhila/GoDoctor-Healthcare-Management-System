import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Plus, Trash2, CheckCircle2, AlertCircle, Calendar, Save, ToggleLeft as Toggle, ToggleRight } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

const AvailabilityManagement = () => {
  const [schedule, setAvailability] = useState({
    workingHours: { start: '09:00', end: '17:00' },
    daysAvailable: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    timeSlots: [],
    isActive: true
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/doctors/schedule', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data) setAvailability(res.data);
      } catch (error) {
        console.error('Error fetching schedule:', error);
      }
    };
    fetchSchedule();
  }, []);

  const handleToggleActive = () => {
    setAvailability(prev => ({ ...prev, isActive: !prev.isActive }));
  };

  const handleDayToggle = (day) => {
    setAvailability(prev => ({
      ...prev,
      daysAvailable: prev.daysAvailable.includes(day)
        ? prev.daysAvailable.filter(d => d !== day)
        : [...prev.daysAvailable, day]
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/doctors/schedule', schedule, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus({ type: 'success', message: 'Schedule updated successfully!' });
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to update schedule.' });
    } finally {
      setIsLoading(false);
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="flex justify-between items-end">
        <div>
          <span className="text-blue-400 font-bold tracking-widest text-xs uppercase">
            Schedule
          </span>
          <h2 className="text-4xl font-black text-white mt-1">Availability</h2>
          <p className="text-slate-400 font-medium mt-2">Set your working hours and available consultation days.</p>
        </div>
        <Button 
          variant="premium" 
          className="flex items-center gap-2 px-8 py-4 shadow-xl shadow-blue-500/20"
          onClick={handleSave}
          disabled={isLoading}
        >
          <Save size={18} />
          {isLoading ? 'Saving...' : 'Save Schedule'}
        </Button>
      </div>

      <AnimatePresence>
        {status.message && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`p-4 rounded-2xl flex items-center gap-3 ${
              status.type === 'success' 
                ? 'bg-green-500/10 border border-green-500/20 text-green-400' 
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}
          >
            {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span className="font-bold">{status.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-8">
        <Card variant="dark-premium" className="p-8 space-y-8">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-bold text-white flex items-center gap-3">
              <Calendar size={22} className="text-blue-400" />
              Working Days
            </h4>
            <button 
              onClick={handleToggleActive}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-black text-xs uppercase tracking-widest ${
                schedule.isActive 
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}
            >
              {schedule.isActive ? <ToggleRight size={20} /> : <Toggle size={20} />}
              {schedule.isActive ? 'Accepting Appointments' : 'Paused'}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {days.map(day => {
              const active = schedule.daysAvailable.includes(day);
              return (
                <button
                  key={day}
                  onClick={() => handleDayToggle(day)}
                  className={`p-4 rounded-2xl border-2 transition-all font-bold text-sm ${
                    active 
                      ? 'border-blue-500 bg-blue-500/10 text-white shadow-lg shadow-blue-500/10' 
                      : 'border-slate-800 bg-slate-900/50 text-slate-500 hover:border-slate-700'
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              );
            })}
          </div>

          <div className="pt-8 border-t border-white/5 space-y-6">
            <h4 className="text-xl font-bold text-white flex items-center gap-3">
              <Clock size={22} className="text-purple-400" />
              Shift Hours
            </h4>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-slate-500 font-bold text-xs uppercase tracking-widest ml-1">Start Time</label>
                <input 
                  type="time" 
                  value={schedule.workingHours.start}
                  onChange={(e) => setAvailability(prev => ({ ...prev, workingHours: { ...prev.workingHours, start: e.target.value } }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white font-bold outline-none focus:border-purple-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-slate-500 font-bold text-xs uppercase tracking-widest ml-1">End Time</label>
                <input 
                  type="time" 
                  value={schedule.workingHours.end}
                  onChange={(e) => setAvailability(prev => ({ ...prev, workingHours: { ...prev.workingHours, end: e.target.value } }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white font-bold outline-none focus:border-purple-500 transition-all"
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default AvailabilityManagement;