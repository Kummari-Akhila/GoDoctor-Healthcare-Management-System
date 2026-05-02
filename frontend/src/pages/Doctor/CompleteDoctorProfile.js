import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, MapPin, Briefcase, Award, GraduationCap, Save, CheckCircle2, AlertCircle, Camera, Activity, Heart, FileText, Plus, Trash2, ShieldCheck, Calendar, Clock } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';

const CompleteDoctorProfile = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    dob: '',
    specialization: '',
    qualifications: [],
    experience: '',
    licenseNumber: '',
    hospitalName: '',
    phone: '',
    address: '',
    workingDays: [],
    startTime: '09:00',
    endTime: '17:00',
    consultationFee: '',
    bio: '',
    profilePhoto: ''
  });
  
  const [newQual, setNewQual] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDayToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter(d => d !== day)
        : [...prev.workingDays, day]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.workingDays.length === 0) {
      setStatus({ type: 'error', message: 'Please select at least one working day.' });
      return;
    }
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/doctors/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus({ type: 'success', message: 'Profile completed successfully! Redirecting...' });
      setTimeout(() => window.location.href = '/doctor', 2000);
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to save profile. Please check all fields.' });
    } finally {
      setIsLoading(false);
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 py-12">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-4xl"
      >
        <Card variant="dark-premium" className="p-8 lg:p-12 shadow-2xl">
          <div className="text-center mb-10">
            <span className="text-blue-400 font-black tracking-widest text-xs uppercase block mb-2">
              Step {step} of 3
            </span>
            <h1 className="text-4xl font-black text-white">Complete Your Profile</h1>
            <p className="text-slate-400 mt-2">We need a few more details to set up your professional practice.</p>
          </div>

          <AnimatePresence mode="wait">
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
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h4 className="text-xl font-bold text-white flex items-center gap-3 border-b border-white/5 pb-4">
                  <User size={22} className="text-blue-400" />
                  Basic Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input 
                    name="fullName"
                    label="Full Professional Name"
                    variant="dark"
                    icon={User}
                    placeholder="Dr. John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                  <div className="space-y-2">
                    <label className="text-slate-400 font-bold text-xs uppercase tracking-wider ml-1">Gender</label>
                    <select 
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3.5 text-white outline-none focus:border-blue-500 transition-all"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <Input 
                    type="date"
                    name="dob"
                    label="Date of Birth"
                    variant="dark"
                    icon={Calendar}
                    value={formData.dob}
                    onChange={handleChange}
                    required
                  />
                  <Input 
                    type="tel"
                    name="phone"
                    label="Phone Number"
                    variant="dark"
                    icon={Phone}
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex justify-end pt-4">
                  <Button type="button" variant="premium" onClick={() => setStep(2)}>
                    Next: Professional Details
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h4 className="text-xl font-bold text-white flex items-center gap-3 border-b border-white/5 pb-4">
                  <Briefcase size={22} className="text-purple-400" />
                  Professional Background
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input 
                    name="specialization"
                    label="Medical Specialization"
                    variant="dark"
                    icon={Award}
                    placeholder="e.g. Cardiology"
                    value={formData.specialization}
                    onChange={handleChange}
                    required
                  />
                  <Input 
                    name="licenseNumber"
                    label="Medical License #"
                    variant="dark"
                    icon={ShieldCheck}
                    placeholder="State/National License ID"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    required
                  />
                  <Input 
                    type="number"
                    name="experience"
                    label="Years of Experience"
                    variant="dark"
                    icon={Activity}
                    placeholder="e.g. 12"
                    value={formData.experience}
                    onChange={handleChange}
                    required
                  />
                  <Input 
                    name="hospitalName"
                    label="Primary Hospital/Clinic"
                    variant="dark"
                    icon={MapPin}
                    placeholder="Medical Center Name"
                    value={formData.hospitalName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Input 
                    name="address"
                    label="Practice Address"
                    variant="dark"
                    icon={MapPin}
                    placeholder="Full street address..."
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
                  <Button type="button" variant="premium" onClick={() => setStep(3)}>Next: Availability & Fee</Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-6">
                  <h4 className="text-xl font-bold text-white flex items-center gap-3 border-b border-white/5 pb-4">
                    <Clock size={22} className="text-pink-400" />
                    Availability & Bio
                  </h4>
                  
                  <div className="space-y-3">
                    <label className="text-slate-400 font-bold text-xs uppercase tracking-wider">Working Days</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                      {days.map(day => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => handleDayToggle(day)}
                          className={`p-3 rounded-xl border transition-all text-xs font-bold ${
                            formData.workingDays.includes(day)
                              ? 'bg-blue-500 border-blue-400 text-white shadow-lg shadow-blue-500/20'
                              : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'
                          }`}
                        >
                          {day.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input 
                      type="time"
                      name="startTime"
                      label="Start Time"
                      variant="dark"
                      icon={Clock}
                      value={formData.startTime}
                      onChange={handleChange}
                      required
                    />
                    <Input 
                      type="time"
                      name="endTime"
                      label="End Time"
                      variant="dark"
                      icon={Clock}
                      value={formData.endTime}
                      onChange={handleChange}
                      required
                    />
                    <Input 
                      type="number"
                      name="consultationFee"
                      label="Consultation Fee ($)"
                      variant="dark"
                      icon={Heart}
                      placeholder="e.g. 100"
                      value={formData.consultationFee}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-slate-400 font-bold text-xs uppercase tracking-wider">Professional Bio</label>
                    <textarea 
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-white text-sm min-h-[120px] outline-none focus:border-blue-500 transition-all"
                      placeholder="Tell patients about your expertise..."
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={() => setStep(2)}>Back</Button>
                  <Button type="submit" variant="premium" className="px-12 py-4" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Complete Registration'}
                  </Button>
                </div>
              </motion.div>
            )}
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default CompleteDoctorProfile;