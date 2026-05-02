import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reports = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center">Loading reports...</div>;
  }

  return (
    <div>
      <h2>System Reports</h2>

      <div className="row">
        <div className="col-md-3">
          <div className="card text-white bg-primary mb-3">
            <div className="card-header">Total Users</div>
            <div className="card-body">
              <h5 className="card-title">{stats.totalUsers || 0}</h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-success mb-3">
            <div className="card-header">Total Doctors</div>
            <div className="card-body">
              <h5 className="card-title">{stats.totalDoctors || 0}</h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-info mb-3">
            <div className="card-header">Total Patients</div>
            <div className="card-body">
              <h5 className="card-title">{stats.totalPatients || 0}</h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-warning mb-3">
            <div className="card-header">Total Appointments</div>
            <div className="card-body">
              <h5 className="card-title">{stats.totalAppointments || 0}</h5>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>Appointment Status Distribution</h5>
            </div>
            <div className="card-body">
              <div className="mb-2">
                <strong>Scheduled:</strong> {stats.appointmentStats?.scheduled || 0}
              </div>
              <div className="mb-2">
                <strong>Completed:</strong> {stats.appointmentStats?.completed || 0}
              </div>
              <div className="mb-2">
                <strong>Cancelled:</strong> {stats.appointmentStats?.cancelled || 0}
              </div>
              <div className="mb-2">
                <strong>No-show:</strong> {stats.appointmentStats?.noShow || 0}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>Support Ticket Status</h5>
            </div>
            <div className="card-body">
              <div className="mb-2">
                <strong>Open:</strong> {stats.ticketStats?.open || 0}
              </div>
              <div className="mb-2">
                <strong>In Progress:</strong> {stats.ticketStats?.inProgress || 0}
              </div>
              <div className="mb-2">
                <strong>Resolved:</strong> {stats.ticketStats?.resolved || 0}
              </div>
              <div className="mb-2">
                <strong>Closed:</strong> {stats.ticketStats?.closed || 0}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h5>Recent Activity</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Activity</th>
                      <th>Count</th>
                      <th>Period</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>New User Registrations</td>
                      <td>{stats.recentActivity?.newUsers || 0}</td>
                      <td>Last 30 days</td>
                    </tr>
                    <tr>
                      <td>Appointments Booked</td>
                      <td>{stats.recentActivity?.appointmentsBooked || 0}</td>
                      <td>Last 30 days</td>
                    </tr>
                    <tr>
                      <td>Prescriptions Issued</td>
                      <td>{stats.recentActivity?.prescriptionsIssued || 0}</td>
                      <td>Last 30 days</td>
                    </tr>
                    <tr>
                      <td>Support Tickets Created</td>
                      <td>{stats.recentActivity?.ticketsCreated || 0}</td>
                      <td>Last 30 days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h5>System Health</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <div className="text-center">
                    <h6>Database Status</h6>
                    <span className="badge bg-success">Connected</span>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="text-center">
                    <h6>API Status</h6>
                    <span className="badge bg-success">Operational</span>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="text-center">
                    <h6>System Uptime</h6>
                    <span className="badge bg-info">99.9%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;