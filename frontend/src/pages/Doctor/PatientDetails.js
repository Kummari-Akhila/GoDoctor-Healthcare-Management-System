import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Calendar, Activity, ShieldAlert, Heart, ArrowLeft, ClipboardList, Clock, MessageSquare, Plus, FileText, Pill } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import StatusBadge from '../../components/UI/StatusBadge';

const PatientDetails = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('history');

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [patientRes, appointmentsRes, prescriptionsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/doctors/patients/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`http://localhost:5000/api/doctors/patients/${id}/appointments`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`http://localhost:5000/api/doctors/patients/${id}/prescriptions`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setPatient(patientRes.data);
        setAppointments(appointmentsRes.data);
        setPrescriptions(prescriptionsRes.data);
      } catch (error) {
        console.error('Error fetching patient data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatientData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!patient) return <div className="text-white">Patient not found.</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-12"
    >
      <div className="flex items-center gap-6">
        <Link to="/doctor/patients">
          <button className="p-3 bg-slate-900 rounded-2xl border border-white/5 text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
            <ArrowLeft size={20} />
          </button>
        </Link>
        <div>
          <span className="text-blue-400 font-bold tracking-widest text-xs uppercase">
            Patient Record
          </span>
          <h2 className="text-4xl font-black text-white mt-1">{patient.user.name}</h2>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-1">
            Patient ID: {patient._id.slice(-8)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card variant="dark-premium" className="p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 blur-2xl -mr-16 -mt-16" />
            
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                {patient.user.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-2xl font-bold text-white">{patient.user.name}</h4>
                <p className="text-blue-400 font-black uppercase tracking-widest text-xs mt-1">
                  Blood Group: {patient.bloodType || 'N/A'}
                </p>
              </div>

              <div className="w-full space-y-4 pt-6 border-t border-white/5">
                <div className="flex items-center gap-4 text-slate-400">
                  <div className="w-10 h-10 rounded-xl bg-slate-900/50 border border-white/5 flex items-center justify-center">
                    <Mail size={18} className="text-slate-500" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">Email</p>
                    <p className="text-sm text-white truncate max-w-[180px]">{patient.user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-slate-400">
                  <div className="w-10 h-10 rounded-xl bg-slate-900/50 border border-white/5 flex items-center justify-center">
                    <Phone size={18} className="text-slate-500" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">Phone</p>
                    <p className="text-sm text-white">{patient.user.phone || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-slate-400">
                  <div className="w-10 h-10 rounded-xl bg-slate-900/50 border border-white/5 flex items-center justify-center">
                    <Calendar size={18} className="text-slate-500" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">Date of Birth</p>
                    <p className="text-sm text-white">
                      {patient.user.dateOfBirth ? new Date(patient.user.dateOfBirth).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full pt-6">
                <Link to="/doctor/prescriptions">
                  <Button variant="premium" className="w-full flex items-center justify-center gap-2">
                    <Plus size={18} />
                    New Prescription
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          <Card variant="glass-premium" className="p-6 space-y-6 bg-red-500/5 border-red-500/10">
            <h5 className="text-white font-bold flex items-center gap-2">
              <ShieldAlert size={18} className="text-red-400" />
              Allergies & Risks
            </h5>
            <div className="flex flex-wrap gap-2">
              {patient.allergies?.length > 0 ? (
                patient.allergies.map((allergy, idx) => (
                  <span key={idx} className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-lg uppercase tracking-tighter">
                    {allergy}
                  </span>
                ))
              ) : (
                <p className="text-slate-500 text-xs font-medium italic">No known allergies recorded.</p>
              )}
            </div>
          </Card>

          <Card variant="glass-premium" className="p-6 space-y-6 bg-blue-500/5 border-blue-500/10">
            <h5 className="text-white font-bold flex items-center gap-2">
              <Heart size={18} className="text-blue-400" />
              Emergency Contact
            </h5>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter mb-1">Name</p>
                <p className="text-sm text-white font-bold">{patient.emergencyContact?.name || 'N/A'}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter mb-1">Relationship / Phone</p>
                <p className="text-sm text-white font-bold">
                  {patient.emergencyContact?.relationship} • {patient.emergencyContact?.phone}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Content Tabs */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex p-1 bg-slate-900/50 rounded-2xl border border-white/5 max-w-fit">
            {[
              { id: 'history', label: 'Medical History', icon: Activity },
              { id: 'appointments', label: 'Visits', icon: Clock },
              { id: 'prescriptions', label: 'Prescriptions', icon: Pill }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-bold text-sm ${
                  activeTab === tab.id 
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' 
                    : 'text-slate-500 hover:text-white'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'history' && (
                <Card variant="dark-premium" className="p-8 space-y-8">
                  <h4 className="text-xl font-bold text-white flex items-center gap-2">
                    <ClipboardList size={22} className="text-purple-400" />
                    Medical History Records
                  </h4>
                  {patient.medicalHistory?.length > 0 ? (
                    <div className="space-y-6">
                      {patient.medicalHistory.map((history, index) => (
                        <div key={index} className="p-6 rounded-3xl bg-slate-900/40 border border-white/5 relative overflow-hidden group hover:border-purple-500/30 transition-all">
                          <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 blur-xl group-hover:bg-purple-500/10 transition-all" />
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h5 className="text-lg font-bold text-white">{history.condition}</h5>
                              <p className="text-xs text-purple-400 font-black uppercase tracking-widest mt-1">
                                Diagnosed: {new Date(history.diagnosisDate).toLocaleDateString()}
                              </p>
                            </div>
                            <StatusBadge status="completed" />
                          </div>
                          <div className="p-4 rounded-2xl bg-slate-950/50 border border-white/5">
                            <p className="text-slate-400 text-sm leading-relaxed">
                              <span className="text-slate-500 font-bold uppercase tracking-tighter block mb-2 text-xs">Doctor's Notes</span>
                              {history.notes}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 space-y-4">
                      <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto border border-white/5">
                        <Activity size={24} className="text-slate-600" />
                      </div>
                      <p className="text-slate-500 font-medium italic">No medical history records found.</p>
                    </div>
                  )}
                </Card>
              )}

              {activeTab === 'appointments' && (
                <Card variant="dark-premium" className="p-8 space-y-8">
                  <h4 className="text-xl font-bold text-white flex items-center gap-2">
                    <Clock size={22} className="text-blue-400" />
                    Appointment History
                  </h4>
                  {appointments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {appointments.map((apt) => (
                        <Card key={apt._id} variant="glass-premium" className="p-5 bg-white/5 border-white/5 group hover:border-blue-500/30 transition-all">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                                <Calendar size={18} className="text-blue-400" />
                              </div>
                              <div>
                                <p className="text-sm text-white font-bold">{new Date(apt.date).toLocaleDateString()}</p>
                                <p className="text-xs text-slate-500 font-medium">{apt.time}</p>
                              </div>
                            </div>
                            <StatusBadge status={apt.status} />
                          </div>
                          <div className="p-3 rounded-xl bg-slate-950/50 border border-white/5">
                            <p className="text-xs text-slate-400 line-clamp-2 italic">"{apt.reason}"</p>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-slate-500 font-medium italic">No appointment history found.</p>
                    </div>
                  )}
                </Card>
              )}

              {activeTab === 'prescriptions' && (
                <Card variant="dark-premium" className="p-8 space-y-8">
                  <h4 className="text-xl font-bold text-white flex items-center gap-2">
                    <Pill size={22} className="text-pink-400" />
                    Prescription Records
                  </h4>
                  {prescriptions.length > 0 ? (
                    <div className="space-y-6">
                      {prescriptions.map((pre) => (
                        <Card key={pre._id} variant="glass-premium" className="p-6 bg-white/5 border-white/5 group hover:border-pink-500/30 transition-all">
                          <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center border border-pink-500/20 shadow-inner">
                                <FileText size={22} className="text-pink-400" />
                              </div>
                              <div>
                                <p className="text-lg text-white font-black">{pre.diagnosis}</p>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
                                  Issued: {new Date(pre.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <StatusBadge status="completed" />
                          </div>
                          <div className="space-y-3">
                            {pre.medications.map((med, midx) => (
                              <div key={midx} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-white/5">
                                <div className="flex items-center gap-3">
                                  <Pill size={14} className="text-pink-400" />
                                  <span className="text-sm text-slate-300 font-bold">{med.name}</span>
                                </div>
                                <span className="text-xs text-slate-500 font-black tracking-tighter uppercase">{med.dosage} • {med.frequency}</span>
                              </div>
                            ))}
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-slate-500 font-medium italic">No prescriptions found.</p>
                    </div>
                  )}
                </Card>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default PatientDetails;