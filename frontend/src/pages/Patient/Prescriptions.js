import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../../components/UI/Card';
import { Pill, User, Calendar, FileText, ClipboardList } from 'lucide-react';
import { motion } from 'framer-motion';

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/patients/prescriptions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPrescriptions(res.data);
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrescriptions();
  }, []);

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
      <div>
        <span className="text-blue-400 font-bold tracking-widest text-xs uppercase">
          Prescriptions
        </span>
        <h2 className="text-4xl font-black text-white mt-1">Medical history and medications</h2>
        <p className="text-slate-400 font-medium mt-2">Track your prescribed medications and recovery progress.</p>
      </div>

      <Card variant="dark-premium" className="p-8">
        {prescriptions.length === 0 ? (
          <div className="text-center py-16 space-y-6">
            <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto border border-white/5">
              <Pill size={32} className="text-slate-600" />
            </div>
            <div className="space-y-2">
              <h4 className="text-2xl font-bold text-white">No prescriptions yet</h4>
              <p className="text-slate-500 max-w-md mx-auto">Your medical prescriptions will appear here after your consultations.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {prescriptions.map((prescription, idx) => (
              <motion.div
                key={prescription._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card variant="glass-premium" className="p-6 border-white/5 bg-white/5 hover:border-blue-500/30 transition-all h-full">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex gap-4">
                      <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20">
                        <User size={24} className="text-purple-400" />
                      </div>
                      <div>
                        <h5 className="text-xl font-bold text-white">Dr. {prescription.doctor.name}</h5>
                        <div className="flex items-center gap-3 text-slate-500 text-sm mt-1">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-blue-400" />
                            <span className="font-medium text-slate-400">
                              {new Date(prescription.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <span className="text-slate-700">•</span>
                          <span className="font-bold text-blue-400/70 uppercase tracking-widest text-[10px]">
                            {prescription.doctor.specialization}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 space-y-3">
                      <div className="flex items-center gap-2 text-blue-400">
                        <ClipboardList size={16} />
                        <span className="text-xs font-bold uppercase tracking-widest">Diagnosis</span>
                      </div>
                      <p className="text-white font-bold text-lg">{prescription.diagnosis}</p>
                      <p className="text-slate-400 text-sm italic">"{prescription.notes}"</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-pink-400">
                        <Pill size={16} />
                        <span className="text-xs font-bold uppercase tracking-widest">Medications</span>
                      </div>
                      <div className="space-y-3">
                        {prescription.medications.map((med, index) => (
                          <div key={index} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                            <div className="flex justify-between items-start mb-2">
                              <h6 className="text-white font-bold">{med.name}</h6>
                              <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-tighter rounded-full border border-blue-500/20">
                                {med.duration}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-4 text-xs text-slate-500 font-bold uppercase tracking-wider">
                              <span className="flex items-center gap-1">
                                <FileText size={12} className="text-slate-600" />
                                {med.dosage}
                              </span>
                              <span>•</span>
                              <span>{med.frequency}</span>
                            </div>
                            {med.instructions && (
                              <p className="mt-3 text-xs text-slate-400 bg-slate-950/50 p-2 rounded-lg border border-white/5">
                                <span className="text-blue-400 mr-2 font-black">NOTE:</span>
                                {med.instructions}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default Prescriptions;