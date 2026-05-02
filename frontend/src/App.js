import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import PatientDashboard from './pages/Patient/Dashboard';
import BookAppointment from './pages/Patient/BookAppointment';
import AppointmentHistory from './pages/Patient/AppointmentHistory';
import Prescriptions from './pages/Patient/Prescriptions';
import DoctorDashboard from './pages/Doctor/Dashboard';
import AppointmentManagement from './pages/Doctor/AppointmentManagement';
import PatientRecords from './pages/Doctor/PatientRecords';
import PatientDetails from './pages/Doctor/PatientDetails';
import PrescriptionForm from './pages/Doctor/PrescriptionForm';
import AvailabilityManagement from './pages/Doctor/AvailabilityManagement';
import ProfileSettings from './pages/Doctor/ProfileSettings';
import AdminDashboard from './pages/Admin/Dashboard';
import CompleteDoctorProfile from './pages/Doctor/CompleteDoctorProfile';
import Profile from './pages/Profile/Profile';
import EditProfile from './pages/Profile/EditProfile';
import Support from './pages/Support/Support';
import SupportDashboard from './pages/Support/SupportDashboard';
import DashboardLayout from './layouts/DashboardLayout';

function App() {
  return (
    <Router>
      <div className="app-shell">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Patient Routes */}
          <Route path="/patient" element={<DashboardLayout />}>
            <Route index element={<PatientDashboard />} />
            <Route path="dashboard" element={<PatientDashboard />} />
            <Route path="book-appointment" element={<BookAppointment />} />
            <Route path="appointments" element={<AppointmentHistory />} />
            <Route path="prescriptions" element={<Prescriptions />} />
            <Route path="profile" element={<Profile />} />
            <Route path="edit-profile" element={<EditProfile />} />
            <Route path="support" element={<Support />} />
          </Route>

          {/* Doctor Routes */}
          <Route path="/doctor/complete-profile" element={<CompleteDoctorProfile />} />
          <Route path="/doctor" element={<DashboardLayout />}>
            <Route index element={<DoctorDashboard />} />
            <Route path="dashboard" element={<DoctorDashboard />} />
            <Route path="today" element={<AppointmentManagement />} />
            <Route path="appointments" element={<AppointmentManagement />} />
            <Route path="patients" element={<PatientRecords />} />
            <Route path="patients/:id" element={<PatientDetails />} />
            <Route path="prescriptions" element={<PrescriptionForm />} />
            <Route path="schedule" element={<AvailabilityManagement />} />
            <Route path="settings" element={<ProfileSettings />} />
            <Route path="profile" element={<Profile />} />
            <Route path="edit-profile" element={<EditProfile />} />
            <Route path="support" element={<Support />} />
          </Route>

          {/* Support Routes */}
          <Route path="/support" element={<DashboardLayout />}>
            <Route index element={<SupportDashboard />} />
            <Route path="dashboard" element={<SupportDashboard />} />
            <Route path="tickets" element={<SupportDashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="edit-profile" element={<EditProfile />} />
          </Route>

          <Route path="/admin/*" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;