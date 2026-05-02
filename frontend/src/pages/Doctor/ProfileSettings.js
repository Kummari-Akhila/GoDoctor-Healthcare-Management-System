import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, MapPin, Briefcase, Award, GraduationCap, Save, CheckCircle2, AlertCircle, Camera, Activity, Heart, FileText, Plus, Trash2, ShieldCheck, Calendar, Clock } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';

const ProfileSettings = () => {
  const [profile, setProfile] = useState({
    user: { name: '', email: '', phone: '' },
    fullName: '',
    gender: '',
    dob: '',
    specialization: '',
    experience: '',
    qualifications: [],
    bio: '',
    consultationFee: '',
    licenseNumber: '',
    hospitalName: '',
    address: '',
    workingDays: [],
    startTime: '09:00',
    endTime: '17:00',
    documents: []
  });
  const [newQual, setNewQual] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/doctors/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data) {
          // Pre-fill fields, ensuring dates are correctly formatted for input
          const data = res.data;
          if (data.dob) data.dob = new Date(data.dob).toISOString().split('T')[0];
          setProfile(prev => ({ ...prev, ...data }));
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfile(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setProfile(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDayToggle = (day) => {
    setProfile(prev => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter(d => d !== day)
        : [...prev.workingDays, day]
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/doctors/profile', profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus({ type: 'success', message: 'Profile updated successfully!' });
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to update profile details.' });
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
      className="max-w-5xl mx-auto space-y-8"
    >
      <div className="flex justify-between items-end">
        <div>
          <span className="text-blue-400 font-bold tracking-widest text-xs uppercase">
            Account
          </span>
          <h2 className="text-4xl font-black text-white mt-1">Profile Settings</h2>
          <p className="text-slate-400 font-medium mt-2">Update your professional information and public profile.</p>
        </div>
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

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
        {/* Left: Avatar & Personal Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card variant="dark-premium" className="p-8 text-center space-y-6">
            <div className="relative inline-block group">
              <div className="w-32 h-32 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-blue-500/20 mx-auto">
                {profile.user.name?.charAt(0)}
              </div>
              <button type="button" className="absolute -bottom-2 -right-2 p-2.5 bg-slate-900 border border-white/10 rounded-xl text-blue-400 hover:text-white transition-all shadow-lg">
                <Camera size={18} />
              </button>
            </div>
            
            <div className="space-y-1">
              <h4 className="text-xl font-bold text-white">{profile.fullName || profile.user.name}</h4>
              <p className="text-blue-400 font-bold text-xs uppercase tracking-widest">{profile.specialization || 'Medical Professional'}</p>
            </div>

            <div className="pt-6 border-t border-white/5 space-y-4 text-left">
              <Input 
                name="fullName"
                label="Full Professional Name"
                variant="dark"
                icon={User}
                value={profile.fullName}
                onChange={handleChange}
              />
              <div className="space-y-2">
                <label className="text-slate-400 font-bold text-xs uppercase tracking-wider ml-1">Gender</label>
                <select 
                  name="gender"
                  value={profile.gender}
                  onChange={handleChange}
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3.5 text-white outline-none focus:border-blue-500 transition-all text-sm"
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
                value={profile.dob}
                onChange={handleChange}
              />
              <Input 
                type="tel" 
                name="phone"
                label="Phone Number"
                variant="dark"
                icon={Phone}
                value={profile.phone}
                onChange={handleChange}
              />
            </div>
          </Card>

          <Card variant="glass-premium" className="p-6 space-y-6 bg-blue-500/5 border-blue-500/10">
            <h5 className="text-white font-bold flex items-center gap-2">
              <Clock size={18} className="text-blue-400" />
              Availability
            </h5>
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-1.5">
                {days.map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayToggle(day)}
                    className={`py-2 rounded-lg border transition-all text-[10px] font-bold ${
                      profile.workingDays.includes(day)
                        ? 'bg-blue-500 border-blue-400 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input type="time" name="startTime" label="Start" variant="dark" value={profile.startTime} onChange={handleChange} />
                <Input type="time" name="endTime" label="End" variant="dark" value={profile.endTime} onChange={handleChange} />
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Professional Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card variant="dark-premium" className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="md:col-span-2">
                <h4 className="text-xl font-bold text-white flex items-center gap-3 mb-6">
                  <Briefcase size={22} className="text-blue-400" />
                  Professional Background
                </h4>
              </div>
              
              <Input 
                type="text" 
                name="specialization"
                label="Specialization"
                variant="dark"
                icon={Award}
                placeholder="e.g. Cardiology"
                value={profile.specialization}
                onChange={handleChange}
              />
              <Input 
                type="text" 
                name="licenseNumber"
                label="Medical License #"
                variant="dark"
                icon={ShieldCheck}
                value={profile.licenseNumber}
                onChange={handleChange}
              />
              <Input 
                type="number" 
                name="experience"
                label="Years of Experience"
                variant="dark"
                icon={Activity}
                value={profile.experience}
                onChange={handleChange}
              />
              <Input 
                type="text" 
                name="hospitalName"
                label="Hospital/Clinic"
                variant="dark"
                icon={MapPin}
                value={profile.hospitalName}
                onChange={handleChange}
              />
              <div className="md:col-span-2">
                <Input 
                  type="text" 
                  name="address"
                  label="Practice Address"
                  variant="dark"
                  icon={MapPin}
                  value={profile.address}
                  onChange={handleChange}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-slate-400 font-bold text-xs mb-3 block uppercase tracking-wider">Qualifications</label>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <input 
                      type="text"
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-sm outline-none focus:border-blue-500 transition-all"
                      placeholder="Add degree..."
                      value={newQual}
                      onChange={(e) => setNewQual(e.target.value)}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      className="border-blue-500/20 text-blue-400 hover:bg-blue-500/10"
                      onClick={() => {
                        if (newQual) {
                          setProfile(prev => ({ ...prev, qualifications: [...prev.qualifications, newQual] }));
                          setNewQual('');
                        }
                      }}
                    >
                      <Plus size={18} />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.qualifications.map((q, i) => (
                      <span key={i} className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold rounded-lg flex items-center gap-2">
                        {q}
                        <button type="button" onClick={() => setProfile(prev => ({ ...prev, qualifications: prev.qualifications.filter((_, idx) => idx !== i) }))}>
                          <Trash2 size={12} className="text-blue-500/50 hover:text-red-400" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="text-slate-400 font-bold text-xs mb-2 block uppercase tracking-wider">Professional Bio</label>
                <textarea 
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white text-sm min-h-[120px] outline-none focus:border-blue-500 transition-all"
                  placeholder="Tell patients about your expertise and approach..."
                />
              </div>
            </div>

            <div className="pt-8 border-t border-white/5">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-xl font-bold text-white flex items-center gap-3">
                  <Heart size={22} className="text-pink-400" />
                  Consultation Fee
                </h4>
                <div className="relative w-40">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                  <input 
                    type="number"
                    name="consultationFee"
                    value={profile.consultationFee}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 pl-8 text-white font-black outline-none focus:border-pink-500 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Button 
                type="submit" 
                variant="premium" 
                size="lg" 
                className="w-full py-4 text-lg flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20"
                disabled={isLoading}
              >
                <Save size={20} />
                {isLoading ? 'Updating...' : 'Save Profile Changes'}
              </Button>
            </div>
          </Card>
        </div>
      </form>
    </motion.div>
  );
};

export default ProfileSettings;