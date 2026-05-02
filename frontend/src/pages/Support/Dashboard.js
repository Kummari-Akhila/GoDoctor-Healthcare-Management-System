import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/UI/Sidebar';
import TicketList from './TicketList';
import ChatInterface from './ChatInterface';
import { Menu, MessageSquare, Bell, LifeBuoy } from 'lucide-react';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        userRole="support" 
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
            <h2 className="text-xl font-bold text-white hidden sm:block">Support Center</h2>
          </div>

          <div className="flex items-center gap-6">
            <button className="text-slate-400 hover:text-blue-400 transition-colors relative p-2">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full border-2 border-slate-950" />
            </button>
            
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-white text-sm font-bold">{user?.name}</p>
                <p className="text-slate-500 text-xs uppercase tracking-tighter">Support Agent</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/20">
                {user?.name?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 md:p-12 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={
                <div className="space-y-6 text-white">
                  <h1 className="text-3xl font-black flex items-center gap-3">
                    <LifeBuoy className="text-blue-400" size={32} />
                    Support Overview
                  </h1>
                  <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
                    Manage patient inquiries, resolve tickets, and provide real-time assistance through the chat interface.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                    {[
                      { label: 'Active Tickets', value: '14', color: 'from-blue-500 to-cyan-500' },
                      { label: 'Average Response', value: '12m', color: 'from-purple-500 to-blue-500' },
                      { label: 'CSAT Score', value: '4.8/5', color: 'from-green-500 to-emerald-500' }
                    ].map((stat, idx) => (
                      <div key={idx} className="p-8 rounded-3xl bg-slate-900/50 border border-white/5 group hover:border-blue-500/30 transition-all">
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                        <p className="text-4xl font-black mt-2 text-white group-hover:text-blue-400 transition-colors">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              } />
              <Route path="/tickets" element={<TicketList />} />
              <Route path="/chat" element={<ChatInterface />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;