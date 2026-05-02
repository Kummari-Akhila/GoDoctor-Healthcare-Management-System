import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Filter, User, Phone, Mail, Calendar, ChevronRight, Activity, ShieldAlert, Heart } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { Link } from 'react-router-dom';

const PatientRecords = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/doctors/patients', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPatients(res.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(p => {
    const name = p.user?.name || '';
    const email = p.user?.email || '';
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || p.bloodType === filter;
    return matchesSearch && matchesFilter;
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
          <span className="text-blue-400 font-bold tracking-widest text-xs uppercase">
            Records
          </span>
          <h2 className="text-4xl font-black text-white mt-1">Patient Directory</h2>
          <p className="text-slate-400 font-medium mt-2">
            Access medical history and detailed records for all your patients.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text"
              placeholder="Search by name or email..."
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
              <option value="all">All Blood Types</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <Card variant="dark-premium" className="p-8">
        {filteredPatients.length === 0 ? (
          <div className="text-center py-16 space-y-6">
            <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto border border-white/5">
              <Users size={32} className="text-slate-600" />
            </div>
            <div className="space-y-2">
              <h4 className="text-2xl font-bold text-white">No patients found</h4>
              <p className="text-slate-500 max-w-md mx-auto">Try adjusting your search or filter to find the record you need.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredPatients.map((patient, idx) => (
                <motion.div
                  key={patient._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link to={`/doctor/patients/${patient._id}`}>
                    <Card variant="glass-premium" className="p-6 border-white/5 bg-white/5 hover:border-blue-500/30 transition-all group h-full relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-2xl -mr-12 -mt-12 group-hover:bg-blue-500/10 transition-all" />
                      
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                          {patient.user.name.charAt(0)}
                        </div>
                        <div>
                          <h5 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                            {patient.user.name}
                          </h5>
                          <p className="text-blue-400/70 text-xs font-black uppercase tracking-widest">
                            Blood Type: {patient.bloodType || 'N/A'}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-slate-400 text-sm">
                          <Mail size={14} className="text-slate-600" />
                          <span className="truncate">{patient.user.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-400 text-sm">
                          <Phone size={14} className="text-slate-600" />
                          <span>{patient.user.phone || 'No phone'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-400 text-sm">
                          <Calendar size={14} className="text-slate-600" />
                          <span>{patient.user.gender || 'Not specified'}</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                        <div className="flex gap-2">
                          {patient.allergies?.length > 0 && (
                            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20" title="Has Allergies">
                              <ShieldAlert size={14} className="text-red-400" />
                            </div>
                          )}
                          {patient.medicalHistory?.length > 0 && (
                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20" title="Has History">
                              <Activity size={14} className="text-purple-400" />
                            </div>
                          )}
                        </div>
                        <span className="text-blue-400 text-xs font-black uppercase tracking-tighter flex items-center gap-1 group-hover:gap-2 transition-all">
                          View Details <ChevronRight size={14} />
                        </span>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default PatientRecords;