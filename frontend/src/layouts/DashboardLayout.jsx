import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/UI/Sidebar';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user')) || {};

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        userRole={user.role} 
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Outlet context={{ setIsSidebarOpen }} />
      </div>
    </div>
  );
};

export default DashboardLayout;
