import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Briefcase, Award, GraduationCap, Calendar, Clock, Edit3, ShieldCheck, Heart, Activity, Menu } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Sidebar from '../../components/UI/Sidebar';
import SupportProfile from '../Support/SupportProfile';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        let endpoint = '';
        
        if (user.role === 'doctor') {
          endpoint = 'http://localhost:5000/api/doctors/profile';
        } else if (user.role === 'patient') {
          endpoint = 'http://localhost:5000/api/patients/profile';
        } else if (user.role === 'support') {
          // For support, we might just use the user object from localStorage 
          // or a generic profile endpoint if available.
          setProfile({ user });
          setLoading(false);
          return;
        }
        
        const res = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data) {
          setProfile(res.data);
          
          // Refresh user info in localStorage if backend returned it
          if (res.data.user) {
            const currentUser = JSON.parse(localStorage.getItem('user'));
            const updatedUser = { ...currentUser, ...res.data.user };
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user.role]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isDoctor = user.role === 'doctor';
  const isPatient = user.role === 'patient';
  const isSupport = user.role === 'support';

  return (
    <div className="flex-1 p-8 md:p-12 overflow-y-auto">
      <div className="flex justify-end mb-6">
        <Button 
          variant="premium" 
          size="sm" 
          icon={Edit3}
          onClick={() => {
            if (isDoctor) navigate('/doctor/edit-profile');
            else if (isPatient) navigate('/patient/edit-profile');
            else if (isSupport) navigate('/support/edit-profile');
          }}
        >
          Edit Profile
        </Button>
      </div>
      
      {isSupport ? (
        <SupportProfile profile={profile} />
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto space-y-8"
        >
          {/* Header Section */}
          <Card variant="dark-premium" className="p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full group-hover:bg-blue-500/20 transition-all" />
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-blue-500/20">
                  {profile?.user?.name?.charAt(0) || user.name?.charAt(0)}
                </div>
                {isDoctor && profile?.profileCompleted && (
                  <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-1.5 rounded-xl shadow-lg border-2 border-slate-900">
                    <ShieldCheck size={20} />
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <span className="text-blue-400 font-bold tracking-widest text-xs uppercase">
                    {isDoctor ? 'Medical Professional' : 'Patient'}
                  </span>
                  <h1 className="text-4xl font-black text-white mt-1">
                    {isDoctor ? `Dr. ${profile?.fullName || user.name}` : profile?.user?.name || user.name}
                  </h1>
                  {isDoctor && (
                    <p className="text-purple-400 font-bold mt-1 uppercase tracking-wider text-sm">
                      {profile?.specialization} • {profile?.experience} Years Experience
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-400 font-medium">
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-slate-500" />
                    {profile?.user?.email || user.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-slate-500" />
                    {profile?.phone || profile?.user?.phone || 'No phone provided'}
                  </div>
                  {isDoctor && profile?.location && (
                    <div className="flex items-center gap-2 text-blue-400 font-bold">
                      <MapPin size={16} className="text-blue-500" />
                      {profile.location}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Detailed Info */}
            <div className="lg:col-span-2 space-y-8">
              {isDoctor ? (
                <>
                  <Card variant="dark-premium" className="p-8 space-y-6">
                    <h4 className="text-xl font-bold text-white flex items-center gap-2">
                      <GraduationCap size={20} className="text-blue-400" />
                      Professional Bio
                    </h4>
                    <p className="text-slate-400 leading-relaxed italic">
                      {profile?.bio || "No professional bio provided yet."}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                      <div className="space-y-4">
                        <h5 className="text-white font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                          <Award size={16} className="text-purple-400" />
                          Qualifications
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {profile?.qualifications?.map((qual, idx) => (
                            <span key={idx} className="px-3 py-1.5 rounded-lg bg-slate-800/50 border border-white/5 text-slate-300 text-sm font-medium">
                              {qual}
                            </span>
                          )) || <span className="text-slate-500 text-sm">No qualifications listed</span>}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h5 className="text-white font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                          <MapPin size={16} className="text-pink-400" />
                          Work Location
                        </h5>
                        <p className="text-slate-300 font-medium">
                          {profile?.hospitalName || "Not specified"}
                        </p>
                        <p className="text-slate-500 text-sm">
                          {profile?.address || "No address provided"}
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card variant="dark-premium" className="p-8 space-y-6">
                    <h4 className="text-xl font-bold text-white flex items-center gap-2">
                      <Clock size={20} className="text-purple-400" />
                      Availability & Fees
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Consultation Fee</p>
                        <p className="text-3xl font-black text-white">₹{profile?.consultationFee || 0}</p>
                      </div>
                      <div className="space-y-4">
                        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Working Hours</p>
                        <p className="text-white font-bold">{profile?.startTime} - {profile?.endTime}</p>
                        <div className="flex flex-wrap gap-2">
                          {profile?.workingDays?.map((day) => (
                            <span key={day} className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
                              {day.substring(0, 3)}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </>
              ) : (
                <>
                  <Card variant="dark-premium" className="p-8 space-y-6">
                    <h4 className="text-xl font-bold text-white flex items-center gap-2">
                      <Activity size={20} className="text-blue-400" />
                      Patient Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-1">
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Gender</p>
                        <p className="text-white font-bold capitalize">{profile?.user?.gender || profile?.gender || 'Not specified'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Date of Birth</p>
                        <p className="text-white font-bold">{profile?.user?.dateOfBirth || profile?.dob ? new Date(profile?.user?.dateOfBirth || profile?.dob).toLocaleDateString() : 'Not specified'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Blood Group</p>
                        <p className="text-white font-bold uppercase">{profile?.bloodGroup || 'Not specified'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Address</p>
                        <p className="text-white font-bold">{profile?.user?.address || profile?.address || 'Not specified'}</p>
                      </div>
                    </div>
                  </Card>
                  
                  <Card variant="dark-premium" className="p-8 space-y-6">
                    <h4 className="text-xl font-bold text-white flex items-center gap-2">
                      <Heart size={20} className="text-pink-400" />
                      Medical Background
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Allergies</p>
                        <div className="flex flex-wrap gap-2">
                          {profile?.allergies?.length > 0 ? profile.allergies.map(a => (
                            <span key={a} className="px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
                              {a}
                            </span>
                          )) : <span className="text-slate-500 italic">No allergies listed</span>}
                        </div>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Ongoing Medications</p>
                        <div className="flex flex-wrap gap-2">
                          {profile?.medications?.length > 0 ? profile.medications.map(m => (
                            <span key={m} className="px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
                              {m}
                            </span>
                          )) : <span className="text-slate-500 italic">No medications listed</span>}
                        </div>
                      </div>
                    </div>
                  </Card>
                </>
              )}
            </div>

            {/* Right Column: Stats / Sidebar Info */}
            <div className="space-y-8">
              <Card variant="glass-premium" className="p-6 bg-blue-500/5 border-blue-500/10">
                <h5 className="text-white font-bold mb-6 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-blue-400" />
                  Account Status
                </h5>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 rounded-2xl bg-slate-900/50 border border-white/5">
                    <span className="text-slate-400 text-sm">Role</span>
                    <span className="text-white font-bold capitalize">{user.role}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-2xl bg-slate-900/50 border border-white/5">
                    <span className="text-slate-400 text-sm">Verified</span>
                    <span className="text-green-400 font-bold">Yes</span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-2xl bg-slate-900/50 border border-white/5">
                    <span className="text-slate-400 text-sm">Joined</span>
                    <span className="text-white font-bold">April 2026</span>
                  </div>
                </div>
              </Card>

              <Card variant="glass-premium" className="p-6 bg-purple-500/5 border-purple-500/10">
                <h5 className="text-white font-bold mb-6 flex items-center gap-2">
                  <Calendar size={18} className="text-purple-400" />
                  Quick Actions
                </h5>
                <div className="grid grid-cols-1 gap-3">
                  <button 
                    onClick={() => navigate(isDoctor ? '/doctor' : '/patient')}
                    className="w-full p-4 rounded-2xl bg-slate-900/50 border border-white/5 hover:bg-white/10 transition-all text-left text-slate-300 font-bold text-sm"
                  >
                    Back to Dashboard
                  </button>
                  <button 
                    onClick={() => {
                      if (isDoctor) navigate('/doctor/edit-profile');
                      else if (isPatient) navigate('/patient/edit-profile');
                      else if (isSupport) navigate('/support/edit-profile');
                    }}
                    className="w-full p-4 rounded-2xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-500 transition-all text-center"
                  >
                    Edit Profile Info
                  </button>
                </div>
              </Card>
            </div>
        </div>
      </motion.div>
      )}
    </div>
  );
};

export default Profile;
