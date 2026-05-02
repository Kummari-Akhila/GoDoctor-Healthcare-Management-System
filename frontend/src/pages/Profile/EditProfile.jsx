import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, MapPin, Briefcase, Award, GraduationCap, Save, CheckCircle2, AlertCircle, Camera, Activity, Heart, FileText, Plus, Trash2, ShieldCheck, Calendar, Clock, ChevronLeft, Menu } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Sidebar from '../../components/UI/Sidebar';

const EditProfile = () => {
  const [profile, setProfile] = useState({
    user: { name: '', email: '', phone: '' },
    fullName: '',
    gender: '',
    dob: '',
    phone: '',
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
    bloodGroup: '',
    allergies: [],
    medications: [],
    location: ''
  });
  const [newQual, setNewQual] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  const [newMed, setNewMed] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const isDoctor = user.role === 'doctor';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const endpoint = isDoctor 
          ? 'http://localhost:5000/api/doctors/profile' 
          : 'http://localhost:5000/api/patients/profile';
          
        const res = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data) {
          const data = res.data;
          const userFields = data.user || {};
          
          // Flatten nested user fields for the form
          const flattenedData = {
            ...data,
            name: userFields.name || '',
            email: userFields.email || '',
            phone: data.phone || userFields.phone || '',
            gender: userFields.gender || data.gender || '',
            dob: userFields.dateOfBirth || data.dob || '',
            address: data.address || userFields.address || ''
          };

          if (flattenedData.dob) {
            flattenedData.dob = new Date(flattenedData.dob).toISOString().split('T')[0];
          }
          
          setProfile(prev => ({ ...prev, ...flattenedData }));
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, [isDoctor]);

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

  const handleAddItem = (field, value, setter) => {
    if (value.trim()) {
      setProfile(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
      setter('');
    }
  };

  const handleRemoveItem = (field, index) => {
    setProfile(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const endpoint = isDoctor 
        ? 'http://localhost:5000/api/doctors/profile' 
        : 'http://localhost:5000/api/patients/profile';
        
      const res = await axios.put(endpoint, profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local user object if name changed
      if (res.data.user) {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const updatedUser = { ...currentUser, ...res.data.user };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      setStatus({ type: 'success', message: 'Profile updated successfully!' });
      
      // Redirect back to profile page
      const redirectPath = isDoctor ? '/doctor/profile' : '/patient/profile';
      setTimeout(() => navigate(redirectPath), 1500);
    } catch (error) {
      console.error('Update profile error:', error);
      setStatus({ type: 'error', message: 'Failed to update profile details.' });
    } finally {
      setIsLoading(false);
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="flex-1 p-8 md:p-12 overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <button 
          onClick={() => navigate(user.role === 'doctor' ? '/doctor/profile' : '/patient/profile')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="font-bold text-sm uppercase tracking-widest">Back to Profile</span>
        </button>
        <Button 
          variant="premium" 
          size="sm" 
          icon={Save}
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto space-y-8"
      >
            <div className="flex justify-between items-end">
              <div>
                <span className="text-blue-400 font-bold tracking-widest text-xs uppercase">
                  Account Settings
                </span>
                <h2 className="text-4xl font-black text-white mt-1">Edit Profile</h2>
                <p className="text-slate-400 font-medium mt-2">Update your information to keep your profile accurate.</p>
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
              {/* Left: Avatar & Basic Info */}
              <div className="lg:col-span-1 space-y-6">
                <Card variant="dark-premium" className="p-8 text-center space-y-6">
                  <div className="relative inline-block group">
                    <div className="w-32 h-32 bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-blue-500/20 mx-auto">
                      {profile.user.name?.charAt(0)}
                    </div>
                    <button type="button" className="absolute -bottom-2 -right-2 p-2.5 bg-slate-900 border border-white/10 rounded-xl text-blue-400 hover:text-white transition-all shadow-lg">
                      <Camera size={18} />
                    </button>
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="text-xl font-bold text-white">{profile.fullName || profile.user.name}</h4>
                    <p className="text-blue-400 font-bold text-xs uppercase tracking-widest">{isDoctor ? (profile.specialization || 'Medical Professional') : 'Patient'}</p>
                  </div>

                  <div className="pt-6 border-t border-white/5 space-y-4 text-left">
                    <Input 
                      name="fullName"
                      label={isDoctor ? "Full Professional Name" : "Full Name"}
                      variant="dark"
                      icon={User}
                      value={profile.fullName || profile.user.name}
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
                      value={profile.phone || profile.user.phone}
                      onChange={handleChange}
                    />
                  </div>
                </Card>
              </div>

              {/* Right: Role Specific Info */}
              <div className="lg:col-span-2 space-y-6">
                {isDoctor ? (
                  <>
                    <Card variant="dark-premium" className="p-8 space-y-6">
                      <h4 className="text-xl font-bold text-white flex items-center gap-2">
                        <Briefcase size={20} className="text-blue-400" />
                        Professional Details
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input 
                          name="specialization"
                          label="Specialization"
                          variant="dark"
                          icon={Award}
                          value={profile.specialization}
                          onChange={handleChange}
                        />
                        <Input 
                          name="location"
                          label="City / State"
                          variant="dark"
                          icon={MapPin}
                          placeholder="e.g. Hyderabad, Telangana"
                          value={profile.location}
                          onChange={handleChange}
                        />
                        <Input 
                          name="experience"
                          label="Years of Experience"
                          variant="dark"
                          icon={Activity}
                          value={profile.experience}
                          onChange={handleChange}
                        />
                        <Input 
                          name="licenseNumber"
                          label="License Number"
                          variant="dark"
                          icon={ShieldCheck}
                          value={profile.licenseNumber}
                          onChange={handleChange}
                        />
                        <Input 
                          name="consultationFee"
                          label="Consultation Fee (₹)"
                          variant="dark"
                          icon={Activity}
                          value={profile.consultationFee}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-slate-400 font-bold text-xs uppercase tracking-wider ml-1">Professional Bio</label>
                        <textarea 
                          name="bio"
                          value={profile.bio}
                          onChange={handleChange}
                          rows={4}
                          className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition-all text-sm"
                          placeholder="Tell patients about your medical background and expertise..."
                        />
                      </div>
                    </Card>

                    <Card variant="dark-premium" className="p-8 space-y-6">
                      <h4 className="text-xl font-bold text-white flex items-center gap-2">
                        <MapPin size={20} className="text-purple-400" />
                        Practice Location
                      </h4>
                      <Input 
                        name="hospitalName"
                        label="Hospital / Clinic Name"
                        variant="dark"
                        icon={Briefcase}
                        value={profile.hospitalName}
                        onChange={handleChange}
                      />
                      <Input 
                        name="address"
                        label="Full Practice Address"
                        variant="dark"
                        icon={MapPin}
                        value={profile.address}
                        onChange={handleChange}
                      />
                    </Card>

                    <Card variant="dark-premium" className="p-8 space-y-6">
                      <h4 className="text-xl font-bold text-white flex items-center gap-2">
                        <Clock size={20} className="text-pink-400" />
                        Availability Schedule
                      </h4>
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {days.map(day => (
                            <button
                              key={day}
                              type="button"
                              onClick={() => handleDayToggle(day)}
                              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                                profile.workingDays.includes(day)
                                  ? 'bg-blue-500 border-blue-400 text-white shadow-lg shadow-blue-500/20'
                                  : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'
                              }`}
                            >
                              {day.substring(0, 3)}
                            </button>
                          ))}
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <Input 
                            type="time"
                            name="startTime"
                            label="Start Time"
                            variant="dark"
                            icon={Clock}
                            value={profile.startTime}
                            onChange={handleChange}
                          />
                          <Input 
                            type="time"
                            name="endTime"
                            label="End Time"
                            variant="dark"
                            icon={Clock}
                            value={profile.endTime}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </Card>
                  </>
                ) : (
                  <>
                    <Card variant="dark-premium" className="p-8 space-y-6">
                      <h4 className="text-xl font-bold text-white flex items-center gap-2">
                        <Activity size={20} className="text-blue-400" />
                        Health Profile
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-slate-400 font-bold text-xs uppercase tracking-wider ml-1">Blood Group</label>
                          <select 
                            name="bloodGroup"
                            value={profile.bloodGroup}
                            onChange={handleChange}
                            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3.5 text-white outline-none focus:border-blue-500 transition-all text-sm"
                          >
                            <option value="">Select Blood Group</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                          </select>
                        </div>
                        <Input 
                          name="address"
                          label="Current Address"
                          variant="dark"
                          icon={MapPin}
                          value={profile.address}
                          onChange={handleChange}
                        />
                      </div>
                    </Card>

                    <Card variant="dark-premium" className="p-8 space-y-6">
                      <h4 className="text-xl font-bold text-white flex items-center gap-2">
                        <Heart size={20} className="text-pink-400" />
                        Medical Background
                      </h4>
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <label className="text-slate-400 font-bold text-xs uppercase tracking-wider ml-1">Allergies</label>
                          <div className="flex gap-2">
                            <input 
                              type="text"
                              value={newAllergy}
                              onChange={(e) => setNewAllergy(e.target.value)}
                              placeholder="Add allergy..."
                              className="flex-1 bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-blue-500 text-sm"
                            />
                            <button 
                              type="button"
                              onClick={() => handleAddItem('allergies', newAllergy, setNewAllergy)}
                              className="p-3 bg-blue-500 rounded-xl text-white hover:bg-blue-400 transition-all"
                            >
                              <Plus size={20} />
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {profile.allergies.map((item, idx) => (
                              <span key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold">
                                {item}
                                <button type="button" onClick={() => handleRemoveItem('allergies', idx)}><Trash2 size={14} /></button>
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-slate-400 font-bold text-xs uppercase tracking-wider ml-1">Ongoing Medications</label>
                          <div className="flex gap-2">
                            <input 
                              type="text"
                              value={newMed}
                              onChange={(e) => setNewMed(e.target.value)}
                              placeholder="Add medication..."
                              className="flex-1 bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-blue-500 text-sm"
                            />
                            <button 
                              type="button"
                              onClick={() => handleAddItem('medications', newMed, setNewMed)}
                              className="p-3 bg-blue-500 rounded-xl text-white hover:bg-blue-400 transition-all"
                            >
                              <Plus size={20} />
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {profile.medications.map((item, idx) => (
                              <span key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold">
                                {item}
                                <button type="button" onClick={() => handleRemoveItem('medications', idx)}><Trash2 size={14} /></button>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </>
                )}
              </div>
            </form>
          </motion.div>
    </div>
  );
};

export default EditProfile;
