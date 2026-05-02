import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  if (
    location.pathname.startsWith('/patient') || 
    location.pathname.startsWith('/doctor') || 
    location.pathname.startsWith('/support') || 
    location.pathname.startsWith('/admin') ||
    location.pathname === '/profile' ||
    location.pathname === '/edit-profile'
  ) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getNavLinks = () => {
    switch (user?.role) {
      case 'patient':
        return (
          <>
            <Link className="nav-link" to="/patient/book-appointment">Book Appointment</Link>
            <Link className="nav-link" to="/patient/appointments">My Appointments</Link>
            <Link className="nav-link" to="/patient/prescriptions">Prescriptions</Link>
          </>
        );
      case 'doctor':
        return (
          <>
            <Link className="nav-link" to="/doctor/appointments">Appointments</Link>
            <Link className="nav-link" to="/doctor/patients">Patients</Link>
            <Link className="nav-link" to="/doctor/prescriptions">Prescriptions</Link>
          </>
        );
      case 'support':
        return (
          <>
            <Link className="nav-link" to="/support/tickets">Support Tickets</Link>
            <Link className="nav-link" to="/support/chat">Chat</Link>
          </>
        );
      case 'admin':
        return (
          <>
            <Link className="nav-link" to="/admin/users">Users</Link>
            <Link className="nav-link" to="/admin/doctors">Doctors</Link>
            <Link className="nav-link" to="/admin/reports">Reports</Link>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark nav-glass">
      <div className="container">
        <Link className="navbar-brand" to="/">GoDoctor</Link>
        <div className="navbar-nav nav-links">
          {getNavLinks()}
          {!user && (
            <>
              <Link className="nav-link" to="/login">Login</Link>
              <Link className="nav-link" to="/register">Register</Link>
            </>
          )}
        </div>
        {user && (
          <div className="navbar-nav ms-auto align-items-center">
            <span className="nav-link text-white">Welcome, {user.name}</span>
            <button className="btn btn-caym btn-primary ms-2" onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;