import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/UI/Sidebar';
import UserManagement from './UserManagement';
import DoctorVerification from './DoctorVerification';
import Reports from './Reports';
import { Menu, User, Bell, Settings } from 'lucide-react';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPatients: 0,
    totalDoctors: 0,
    totalTickets: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setAdmin(JSON.parse(userData));
      fetchStats();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/admin/dashboard-stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        userRole="admin" 
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 md:px-12 bg-slate-950/50 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden text-slate-400 p-2 hover:bg-white/5 rounded-lg transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-bold text-white hidden sm:block">Admin Console</h2>
          </div>

          <div className="flex items-center gap-6">
            <button className="text-slate-400 hover:text-blue-400 transition-colors p-2">
              <Settings size={20} />
            </button>
            
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-white text-sm font-bold">{admin?.name}</p>
                <p className="text-slate-500 text-xs uppercase tracking-tighter">System Admin</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-tr from-slate-700 to-slate-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                {admin?.name?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 md:p-12 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={
                <div className="space-y-6 text-white">
                  <h1 className="text-3xl font-black">System Overview</h1>
                  <p className="text-slate-400 text-lg">Manage users, verify providers, and monitor system health.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4">
                    {[
                      { label: 'Active Users', value: stats.totalUsers.toLocaleString(), color: 'from-blue-500 to-blue-600' },
                      { label: 'Total Patients', value: stats.totalPatients.toLocaleString(), color: 'from-purple-500 to-purple-600' },
                      { label: 'Total Doctors', value: stats.totalDoctors.toLocaleString(), color: 'from-green-500 to-green-600' },
                      { label: 'Support Tickets', value: stats.totalTickets.toLocaleString(), color: 'from-pink-500 to-pink-600' }
                    ].map((stat, idx) => (
                      <div key={idx} className="p-6 rounded-3xl bg-slate-900/50 border border-white/5 group relative overflow-hidden">
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-5 blur-2xl -mr-8 -mt-8 group-hover:opacity-10 transition-opacity`} />
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest relative z-10">{stat.label}</p>
                        <p className="text-3xl font-black mt-2 text-white relative z-10">
                          {loading ? (
                            <span className="inline-block w-16 h-8 bg-white/5 animate-pulse rounded-lg" />
                          ) : (
                            stat.value
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              } />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/patients" element={<UserManagement filterRole="patient" />} />
              <Route path="/doctors" element={<UserManagement filterRole="doctor" />} />
              <Route path="/support" element={<UserManagement filterRole="support" />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;