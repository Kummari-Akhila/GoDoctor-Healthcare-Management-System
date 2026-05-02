import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, CheckCircle2, AlertCircle, Menu, User, Mail, Tag, BookOpen } from 'lucide-react';
import Sidebar from '../../components/UI/Sidebar';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';

const Support = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    subject: '',
    category: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const categories = ['Billing', 'Appointment', 'Technical', 'Other'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (status.message) setStatus({ type: '', message: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/support/ticket', {
        ...formData,
        role: user.role
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setStatus({ type: 'success', message: 'Support ticket submitted successfully! We will get back to you soon.' });
      setFormData({ ...formData, subject: '', category: '', message: '' });
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.message || 'Failed to submit support ticket.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 p-8 md:p-12 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto space-y-8"
      >
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-black text-white">Contact Support</h2>
              <p className="text-slate-400 font-medium">Have a question or facing an issue? Submit a ticket and our team will help you.</p>
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

            <Card variant="dark-premium" className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input 
                    name="name"
                    label="Name"
                    variant="dark"
                    icon={User}
                    value={formData.name}
                    disabled
                  />
                  <Input 
                    name="email"
                    label="Email Address"
                    variant="dark"
                    icon={Mail}
                    value={formData.email}
                    disabled
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input 
                    name="subject"
                    label="Subject"
                    variant="dark"
                    icon={BookOpen}
                    placeholder="Brief summary of the issue"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                  <div className="space-y-2">
                    <label className="text-slate-400 font-bold text-xs uppercase tracking-wider ml-1">Category</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400">
                        <Tag size={18} />
                      </div>
                      <select 
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3.5 pl-12 text-white outline-none focus:border-blue-500 transition-all text-sm appearance-none"
                      >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-slate-400 font-bold text-xs uppercase tracking-wider ml-1">Message / Issue Details</label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition-all text-sm resize-none"
                    placeholder="Please describe your issue in detail..."
                  />
                </div>

                <Button 
                  type="submit"
                  variant="premium" 
                  className="w-full py-4"
                  icon={Send}
                  disabled={isLoading}
                >
                  {isLoading ? 'Submitting...' : 'Submit Ticket'}
                </Button>
              </form>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              {[
                { label: 'Technical Support', info: '24/7 Monitoring' },
                { label: 'Billing Inquiries', info: 'Mon-Fri 9am-6pm' },
                { label: 'General Help', info: 'Average reply: 2h' }
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <p className="text-white font-bold text-sm">{item.label}</p>
                  <p className="text-slate-500 text-xs mt-1">{item.info}</p>
                </div>
              ))}
            </div>
        </motion.div>
    </div>
  );
};

export default Support;
