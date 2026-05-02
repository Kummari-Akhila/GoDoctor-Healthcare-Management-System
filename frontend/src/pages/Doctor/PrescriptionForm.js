import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Pill, User, ClipboardList, Plus, Trash2, CheckCircle2, AlertCircle, FileText, Activity } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';

const PrescriptionForm = () => {
  const [formData, setFormData] = useState({
    patient: '',
    appointment: '',
    diagnosis: '',
    notes: '',
    medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }]
  });
  const [patients, setPatients] = useState([]);
  const [patientHistory, setPatientHistory] = useState({ appointments: [], prescriptions: [] });
  const [historyLoading, setHistoryLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/doctor/patients', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPatients(res.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };
    fetchPatients();
  }, []);

  useEffect(() => {
    const fetchPatientHistory = async () => {
      if (!formData.patient) {
        setPatientHistory({ appointments: [], prescriptions: [] });
        return;
      }

      setHistoryLoading(true);
      try {
        const token = localStorage.getItem('token');
        const [appointmentsRes, prescriptionsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/doctor/patients/${formData.patient}/appointments`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`http://localhost:5000/api/doctor/patients/${formData.patient}/prescriptions`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setPatientHistory({
          appointments: appointmentsRes.data,
          prescriptions: prescriptionsRes.data
        });
      } catch (error) {
        console.error('Error loading patient history:', error);
        setPatientHistory({ appointments: [], prescriptions: [] });
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchPatientHistory();
  }, [formData.patient]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (status.message) setStatus({ type: '', message: '' });
  };

  const handleMedicationChange = (index, field, value) => {
    const newMedications = [...formData.medications];
    newMedications[index][field] = value;
    setFormData({ ...formData, medications: newMedications });
  };

  const addMedication = () => {
    setFormData({
      ...formData,
      medications: [...formData.medications, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]
    });
  };

  const removeMedication = (index) => {
    const newMedications = formData.medications.filter((_, i) => i !== index);
    setFormData({ ...formData, medications: newMedications });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/doctors/prescriptions', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus({ type: 'success', message: 'Prescription issued successfully!' });
      setFormData({
        patient: '',
        appointment: '',
        diagnosis: '',
        notes: '',
        medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }]
      });
    } catch (error) {
      setStatus({ type: 'error', message: 'Error issuing prescription. Please check details.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-8"
    >
      <div>
        <span className="text-pink-400 font-bold tracking-widest text-xs uppercase">
          Prescriptions
        </span>
        <h2 className="text-4xl font-black text-white mt-1">Issue New Prescription</h2>
        <p className="text-slate-400 font-medium mt-2">
          Document diagnosis and prescribe necessary medications for your patient.
        </p>
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

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Patient & Diagnosis */}
          <div className="lg:col-span-1 space-y-6">
            <Card variant="dark-premium" className="p-6 space-y-6">
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                <User size={20} className="text-blue-400" />
                Patient Details
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="text-slate-400 font-bold text-xs mb-2 block uppercase tracking-wider">
                    Select Patient
                  </label>
                  <div className="relative group">
                    <select
                      name="patient"
                      className="w-full bg-slate-950/50 border border-slate-800 focus:border-blue-500/50 text-white rounded-xl p-3.5 px-4 appearance-none transition-all outline-none"
                      value={formData.patient}
                      onChange={handleChange}
                      required
                    >
                      <option value="" className="bg-slate-900">Select Patient</option>
                      {patients.map((p) => (
                        <option key={p._id} value={p.user?._id || p._id} className="bg-slate-900">
                          {p.user?.name || p.name || 'Unnamed Patient'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <Input 
                  type="text"
                  name="diagnosis"
                  label="Diagnosis"
                  variant="dark"
                  icon={Activity}
                  placeholder="Primary diagnosis..."
                  value={formData.diagnosis}
                  onChange={handleChange}
                  required
                />

                <div>
                  <label className="text-slate-400 font-bold text-xs mb-2 block uppercase tracking-wider">
                    Clinical Notes
                  </label>
                  <div className="relative group">
                    <textarea
                      name="notes"
                      className="w-full bg-slate-950/50 border border-slate-800 focus:border-blue-500/50 text-white rounded-xl p-4 px-4 min-h-[120px] transition-all outline-none text-sm"
                      placeholder="Additional observations..."
                      value={formData.notes}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {formData.patient && (
                  <div className="pt-4 border-t border-white/10 space-y-4">
                    <h4 className="text-sm uppercase tracking-wider text-slate-400 font-bold">
                      Patient History
                    </h4>
                    {historyLoading ? (
                      <p className="text-slate-400 text-sm">Loading history...</p>
                    ) : (
                      <div className="space-y-4">
                        <div className="rounded-2xl bg-slate-950/70 border border-white/5 p-4">
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-sm text-slate-400 uppercase tracking-wider font-bold">Recent Visits</p>
                            <span className="text-xs text-slate-500">{patientHistory.appointments.length}</span>
                          </div>
                          {patientHistory.appointments.length > 0 ? (
                            <ul className="space-y-3 text-sm text-white">
                              {patientHistory.appointments.slice(0, 3).map((appt) => (
                                <li key={appt._id} className="rounded-xl border border-white/5 bg-slate-900/80 p-3">
                                  <div className="flex items-center justify-between gap-4">
                                    <span>{new Date(appt.date).toLocaleDateString()}</span>
                                    <span className="text-xs text-slate-500 uppercase tracking-wider">{appt.status}</span>
                                  </div>
                                  <p className="text-slate-400 text-xs mt-1">{appt.reason || 'No reason provided'}</p>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-slate-500 text-sm">No prior visits found for this patient.</p>
                          )}
                        </div>

                        <div className="rounded-2xl bg-slate-950/70 border border-white/5 p-4">
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-sm text-slate-400 uppercase tracking-wider font-bold">Recent Prescriptions</p>
                            <span className="text-xs text-slate-500">{patientHistory.prescriptions.length}</span>
                          </div>
                          {patientHistory.prescriptions.length > 0 ? (
                            <ul className="space-y-3 text-sm text-white">
                              {patientHistory.prescriptions.slice(0, 3).map((rx) => (
                                <li key={rx._id} className="rounded-xl border border-white/5 bg-slate-900/80 p-3">
                                  <div className="flex items-center justify-between gap-4">
                                    <span>{new Date(rx.createdAt).toLocaleDateString()}</span>
                                    <span className="text-xs text-slate-500 uppercase tracking-wider">{rx.diagnosis || 'Prescription'}</span>
                                  </div>
                                  <p className="text-slate-400 text-xs mt-1">{rx.medications?.length} medication(s)</p>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-slate-500 text-sm">No prior prescriptions found for this patient.</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right Column: Medications */}
          <div className="lg:col-span-2 space-y-6">
            <Card variant="dark-premium" className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <Pill size={20} className="text-pink-400" />
                  Prescribed Medications
                </h4>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2 border-pink-500/20 text-pink-400 hover:bg-pink-500/10"
                  onClick={addMedication}
                >
                  <Plus size={16} />
                  Add New
                </Button>
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {formData.medications.map((med, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="p-5 rounded-2xl bg-white/5 border border-white/5 relative group"
                    >
                      {formData.medications.length > 1 && (
                        <button
                          type="button"
                          className="absolute -top-2 -right-2 w-8 h-8 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all border border-red-500/30"
                          onClick={() => removeMedication(index)}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          type="text"
                          label="Medication Name"
                          variant="dark"
                          placeholder="e.g. Amoxicillin"
                          value={med.name}
                          onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                          required
                        />
                        <Input
                          type="text"
                          label="Dosage"
                          variant="dark"
                          placeholder="e.g. 500mg"
                          value={med.dosage}
                          onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                          required
                        />
                        <Input
                          type="text"
                          label="Frequency"
                          variant="dark"
                          placeholder="e.g. Twice daily"
                          value={med.frequency}
                          onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                        />
                        <Input
                          type="text"
                          label="Duration"
                          variant="dark"
                          placeholder="e.g. 7 days"
                          value={med.duration}
                          onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                        />
                        <div className="md:col-span-2">
                          <label className="text-slate-400 font-bold text-xs mb-2 block uppercase tracking-wider">
                            Special Instructions
                          </label>
                          <input
                            type="text"
                            className="w-full bg-slate-950/50 border border-slate-800 focus:border-blue-500/50 text-white rounded-xl p-3 transition-all outline-none text-sm"
                            placeholder="e.g. Take after meals"
                            value={med.instructions}
                            onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5">
                <Button 
                  type="submit" 
                  variant="premium" 
                  size="lg" 
                  className="w-full py-4 text-lg flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20"
                  disabled={isLoading}
                >
                  <FileText size={20} />
                  {isLoading ? 'Issuing...' : 'Complete & Issue Prescription'}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default PrescriptionForm;