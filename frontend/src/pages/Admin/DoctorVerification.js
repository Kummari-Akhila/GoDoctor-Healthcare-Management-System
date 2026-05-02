import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DoctorVerification = () => {
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingDoctors();
  }, []);

  const fetchPendingDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/admin/doctors/pending', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingDoctors(response.data);
    } catch (error) {
      console.error('Error fetching pending doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyDoctor = async (doctorId, action) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/admin/doctors/${doctorId}/verify`, { action }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPendingDoctors(); // Refresh the list
    } catch (error) {
      alert(`Error ${action === 'approve' ? 'approving' : 'rejecting'} doctor`);
    }
  };

  if (loading) {
    return <div className="text-center">Loading pending doctors...</div>;
  }

  return (
    <div>
      <h2>Doctor Verification</h2>
      <div className="row">
        {pendingDoctors.map((doctor) => (
          <div key={doctor._id} className="col-md-6 mb-4">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">{doctor.user.name}</h5>
                <span className="badge bg-warning">Pending Verification</span>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-sm-6">
                    <p><strong>Email:</strong> {doctor.user.email}</p>
                    <p><strong>Specialization:</strong> {doctor.specialization}</p>
                    <p><strong>License Number:</strong> {doctor.licenseNumber}</p>
                  </div>
                  <div className="col-sm-6">
                    <p><strong>Experience:</strong> {doctor.experience} years</p>
                    <p><strong>Phone:</strong> {doctor.phone}</p>
                    <p><strong>Address:</strong> {doctor.address}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <h6>Qualifications:</h6>
                  <ul>
                    {doctor.qualifications.map((qual, index) => (
                      <li key={index}>{qual}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-3">
                  <h6>Documents:</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {doctor.documents.map((doc, index) => (
                      <a
                        key={index}
                        href={`http://localhost:5000/uploads/${doc}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-primary"
                      >
                        View {doc.split('.').pop().toUpperCase()}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <div className="btn-group w-100">
                  <button
                    className="btn btn-success"
                    onClick={() => verifyDoctor(doctor._id, 'approve')}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => verifyDoctor(doctor._id, 'reject')}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {pendingDoctors.length === 0 && (
        <div className="text-center mt-4">
          <p>No pending doctor verifications.</p>
        </div>
      )}
    </div>
  );
};

export default DoctorVerification;