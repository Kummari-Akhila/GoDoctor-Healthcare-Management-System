import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, CheckCircle2, AlertCircle, Menu, User, Calendar, Clock, Tag, ChevronRight, ShieldCheck, Filter } from 'lucide-react';
import Sidebar from '../../components/UI/Sidebar';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import StatusBadge from '../../components/UI/StatusBadge';

const SupportDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const user = JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
    fetchTickets();
  }, [statusFilter]); // Refetch when filter changes

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Relaxed endpoint to get all tickets initially
      const res = await axios.get('http://localhost:5000/api/support/tickets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTickets(res.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/support/${id}`, {
        status: 'resolved'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state
      setTickets(tickets.map(t => t._id === id ? { ...t, status: 'resolved' } : t));
    } catch (error) {
      console.error('Error resolving ticket:', error);
    }
  };

  const filteredTickets = tickets.filter(t => {
    if (statusFilter === 'all') return true;
    return t.status === statusFilter;
  });

  return (
    <div className="flex-1 p-8 md:p-12 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-8"
      >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                <h2 className="text-4xl font-black text-white">Support Dashboard</h2>
                <p className="text-slate-400 font-medium">Manage and resolve user issues and tickets.</p>
              </div>

              <div className="flex items-center gap-3 p-1.5 bg-slate-900/50 rounded-2xl border border-white/5">
                {['all', 'open', 'resolved'].map(status => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      statusFilter === status 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                        : 'text-slate-500 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredTickets.length === 0 ? (
              <Card variant="dark-premium" className="p-20 text-center space-y-4">
                <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto border border-white/5">
                  <CheckCircle2 size={32} className="text-slate-500" />
                </div>
                <h4 className="text-xl font-bold text-white">No Tickets Found</h4>
                <p className="text-slate-500 max-w-xs mx-auto">Great job! All support queries are currently up to date.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTickets.map((ticket) => (
                  <motion.div
                    key={ticket._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Card variant="dark-premium" className="p-6 space-y-6 flex flex-col h-full group">
                      <div className="flex justify-between items-start">
                        <div className={`p-2 rounded-xl bg-opacity-10 border border-opacity-20 ${
                          ticket.status === 'open' ? 'bg-yellow-500 border-yellow-500 text-yellow-500' : 'bg-green-500 border-green-500 text-green-500'
                        }`}>
                          <Tag size={18} />
                        </div>
                        <StatusBadge status={ticket.status} />
                      </div>

                      <div className="space-y-2 flex-1">
                        <h4 className="text-lg font-bold text-white line-clamp-1 group-hover:text-blue-400 transition-colors">
                          {ticket.subject}
                        </h4>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                          <span className={`px-2 py-0.5 rounded-lg border border-white/5 ${
                            ticket.role === 'doctor' ? 'text-purple-400 bg-purple-500/5' : 'text-blue-400 bg-blue-500/5'
                          }`}>
                            {ticket.role}
                          </span>
                          <span>•</span>
                          <span>{ticket.category}</span>
                        </div>
                        <p className="text-slate-400 text-sm italic line-clamp-3 pt-2">
                          "{ticket.message}"
                        </p>
                      </div>

                      <div className="pt-6 border-t border-white/5 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-slate-800 to-slate-900 border border-white/5 flex items-center justify-center text-white text-xs font-black shadow-lg">
                            {ticket.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-bold text-sm truncate">{ticket.name}</p>
                            <p className="text-slate-500 text-xs truncate">{ticket.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                          <div className="flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={12} />
                            {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>

                        {ticket.status === 'open' && (
                          <Button 
                            variant="premium" 
                            className="w-full py-2.5 text-xs font-black uppercase tracking-widest"
                            onClick={() => handleResolve(ticket._id)}
                          >
                            Mark as Resolved
                          </Button>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
    </div>
  );
};

export default SupportDashboard;
