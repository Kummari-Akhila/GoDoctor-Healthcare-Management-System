import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import { Calendar, Clock, CheckCircle2, AlertCircle, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [location, setLocation] = useState('');
  const [formData, setFormData] = useState({
    doctor: '',
    date: '',
    time: '',
    reason: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingDoctors, setIsFetchingDoctors] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (location && location.trim().length > 2) {
        fetchDoctors(location.trim());
      } else {
        setDoctors([]);
        setFormData(prev => ({ ...prev, doctor: '' }));
      }
    }, 800);

    return () => clearTimeout(delayDebounceFn);
  }, [location]);

  const fetchDoctors = async (selectedLocation) => {
    setIsFetchingDoctors(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/patients/doctors?location=${selectedLocation}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDoctors(res.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setStatus({ type: 'error', message: 'Failed to fetch doctors for this location.' });
    } finally {
      setIsFetchingDoctors(false);
    }
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
    if (status.message) setStatus({ type: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (status.message) setStatus({ type: '', message: '' });
  };

  const getAvailableTimeSlots = () => {
    if (!formData.doctor) return [];
    const selectedDoctor = doctors.find(d => d.user?._id === formData.doctor || d._id === formData.doctor);
    if (!selectedDoctor || !selectedDoctor.startTime || !selectedDoctor.endTime) return [];

    const slots = [];
    const [startHour, startMin] = selectedDoctor.startTime.split(':').map(Number);
    const [endHour, endMin] = selectedDoctor.endTime.split(':').map(Number);
    
    let current = new Date();
    current.setHours(startHour, startMin, 0, 0);
    
    const end = new Date();
    end.setHours(endHour, endMin, 0, 0);

    while (current < end) {
      const timeString = current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      slots.push(timeString);
      current.setMinutes(current.getMinutes() + 30);
    }
    return slots;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/appointments', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus({ type: 'success', message: 'Appointment booked successfully! We will notify you once confirmed.' });
      setFormData({ doctor: '', date: '', time: '', reason: '' });
    } catch (error) {
      setStatus({ type: 'error', message: 'Error booking appointment. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <Card variant="dark-premium" className="p-8 lg:p-12">
        <div className="mb-10">
          <span className="text-blue-400 font-bold tracking-widest text-xs uppercase">
            Book Appointment
          </span>
          <h2 className="text-4xl font-black text-white mt-2">Schedule your next visit</h2>
          <p className="text-slate-400 text-lg mt-2">Pick a doctor, choose a time, and tell us what you need help with.</p>
        </div>

        <AnimatePresence>
          {status.message && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`mb-8 p-4 rounded-2xl flex items-center gap-3 ${
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

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input 
                  name="location"
                  label="Search Location (City, State)"
                  variant="dark"
                  icon={MapPin}
                  placeholder="e.g. Hyderabad, Telangana"
                  value={location}
                  onChange={handleLocationChange}
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold text-sm mb-3 block uppercase tracking-wider">
                  Choose Specialist
                </label>
                <div className="relative group">
                  <select
                    name="doctor"
                    className={`w-full bg-slate-900/50 border border-slate-800 focus:border-blue-500/50 text-white rounded-2xl p-4 px-4 appearance-none transition-all outline-none ${!location ? 'opacity-50 cursor-not-allowed' : ''}`}
                    value={formData.doctor}
                    onChange={handleChange}
                    required
                    disabled={!location || isFetchingDoctors}
                  >
                    <option value="" className="bg-slate-900">
                      {!location ? 'Select location first' : (doctors.length === 0 ? 'No Doctors Available' : 'Select Doctor')}
                    </option>
                    {doctors.map((doctor) => (
                      <option key={doctor._id} value={doctor.user?._id} className="bg-slate-900">
                        Dr. {doctor.user?.name || doctor.fullName} ({doctor.specialization})
                      </option>
                    ))}
                  </select>
                </div>
                {location && !isFetchingDoctors && doctors.length === 0 && (
                  <p className="text-pink-500 text-xs font-bold mt-2 ml-2">No doctors available in {location}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                type="date"
                name="date"
                label="Appointment Date"
                variant="dark"
                icon={Calendar}
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
              <div>
                <label className="text-slate-400 font-bold text-sm mb-3 block uppercase tracking-wider">
                  Preferred Time
                </label>
                <div className="relative group">
                  <select
                    name="time"
                    className={`w-full bg-slate-900/50 border border-slate-800 focus:border-blue-500/50 text-white rounded-2xl p-4 px-4 appearance-none transition-all outline-none ${!formData.doctor ? 'opacity-50 cursor-not-allowed' : ''}`}
                    value={formData.time}
                    onChange={handleChange}
                    required
                    disabled={!formData.doctor}
                  >
                    <option value="" className="bg-slate-900">
                      {!formData.doctor ? 'Select doctor first' : (getAvailableTimeSlots().length === 0 ? 'No slots available' : 'Select Time Slot')}
                    </option>
                    {getAvailableTimeSlots().map((slot, index) => (
                      <option key={index} value={slot} className="bg-slate-900">
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="text-slate-400 font-bold text-sm mb-3 block uppercase tracking-wider">
                Reason for Visit
              </label>
              <div className="relative group">
                <textarea
                  name="reason"
                  className="w-full bg-slate-900/50 border border-slate-800 focus:border-blue-500/50 text-white rounded-2xl p-4 px-4 min-h-[150px] transition-all outline-none"
                  placeholder="Tell us about your symptoms or purpose of visit..."
                  value={formData.reason}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              variant="premium" 
              size="lg" 
              className="w-full py-5 text-xl shadow-lg shadow-blue-500/20"
              disabled={isLoading}
            >
              {isLoading ? 'Booking...' : 'Confirm Appointment'}
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default BookAppointment;
