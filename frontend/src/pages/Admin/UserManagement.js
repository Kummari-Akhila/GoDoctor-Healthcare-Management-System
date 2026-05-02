import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Edit2, UserCheck, UserMinus, Search, Mail, Shield, User } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';

const UserManagement = ({ filterRole = '' }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '' });

  useEffect(() => {
    fetchUsers();
  }, [filterRole]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const url = filterRole 
        ? `http://localhost:5000/api/admin/users?role=${filterRole}`
        : 'http://localhost:5000/api/admin/users';
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to permanently delete this user and all their related data? This action cannot be undone.')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (error) {
      alert('Error deleting user');
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'doctor': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'patient': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'support': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getTitle = () => {
    if (!filterRole) return 'All Users';
    return `Manage ${filterRole.charAt(0).toUpperCase() + filterRole.slice(1)}s`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">{getTitle()}</h1>
          <p className="text-slate-400">Total {filteredUsers.length} users found</p>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card variant="dark-premium" className="overflow-hidden border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-6 py-4 text-slate-400 font-bold text-xs uppercase tracking-widest">User</th>
                <th className="px-6 py-4 text-slate-400 font-bold text-xs uppercase tracking-widest">Role</th>
                <th className="px-6 py-4 text-slate-400 font-bold text-xs uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-slate-400 font-bold text-xs uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-slate-500 font-medium">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        Loading users...
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-slate-500 font-medium">
                      No users found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="group hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center text-white font-bold border border-white/5 shadow-inner">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-white font-bold leading-none mb-1">{user.name}</p>
                            <p className="text-slate-500 text-xs flex items-center gap-1">
                              <Mail size={12} /> {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${getRoleBadgeColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'} shadow-[0_0_8px_rgba(34,197,94,0.4)]`} />
                          <span className={`text-xs font-bold ${user.isActive ? 'text-green-500' : 'text-red-500'}`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => deleteUser(user._id)}
                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all border border-red-500/20 group/btn"
                            title="Delete User"
                          >
                            <Trash2 size={16} className="group-hover/btn:scale-110 transition-transform" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default UserManagement;