import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Shield, User, Calendar } from 'lucide-react';
import Card from '../../components/UI/Card';

const SupportProfile = ({ profile }) => {
  const user = profile?.user || profile;
  
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative group"
      >
        <Card variant="dark-premium" className="overflow-hidden border-white/5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-3xl -mr-32 -mt-32" />
          
          <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center text-4xl text-white font-black border border-white/10 shadow-2xl">
                {user?.name?.charAt(0)}
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-500 rounded-2xl flex items-center justify-center border-4 border-slate-900 text-white shadow-xl">
                <Shield size={18} />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <h1 className="text-4xl font-black text-white tracking-tight">{user?.name}</h1>
                <span className="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-500/20 w-fit mx-auto md:mx-0">
                  Support Team
                </span>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 pt-2">
                <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400 font-medium">
                  <Mail size={16} className="text-blue-400" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400 font-medium">
                  <Calendar size={16} className="text-blue-400" />
                  <span>Joined {new Date(user?.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card variant="dark-premium" className="p-8 border-white/5">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <User size={20} className="text-blue-400" />
            Basic Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-1">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Full Name</p>
              <p className="text-white font-bold">{user?.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Email Address</p>
              <p className="text-white font-bold">{user?.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Department</p>
              <p className="text-white font-bold">Customer Support</p>
            </div>
            <div className="space-y-1">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Account Status</p>
              <div className="flex items-center gap-2 pt-1">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                <span className="text-green-500 font-bold text-sm">Verified</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default SupportProfile;
