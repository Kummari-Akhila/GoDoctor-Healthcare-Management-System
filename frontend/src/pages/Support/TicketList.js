import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/support/tickets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (ticketId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/support/tickets/${ticketId}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTickets(); // Refresh the list
    } catch (error) {
      alert('Error updating ticket status');
    }
  };

  if (loading) {
    return <div className="text-center">Loading tickets...</div>;
  }

  return (
    <div>
      <h2>Support Tickets</h2>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Subject</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Created By</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket._id}>
                <td>{ticket._id}</td>
                <td>{ticket.subject}</td>
                <td>
                  <span className={`badge bg-${ticket.priority === 'high' ? 'danger' : ticket.priority === 'medium' ? 'warning' : 'success'}`}>
                    {ticket.priority}
                  </span>
                </td>
                <td>
                  <span className={`badge bg-${ticket.status === 'open' ? 'primary' : ticket.status === 'in-progress' ? 'warning' : 'success'}`}>
                    {ticket.status}
                  </span>
                </td>
                <td>{ticket.createdBy?.name || 'Unknown'}</td>
                <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="btn-group">
                    {ticket.status === 'open' && (
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => updateTicketStatus(ticket._id, 'in-progress')}
                      >
                        Start
                      </button>
                    )}
                    {ticket.status === 'in-progress' && (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => updateTicketStatus(ticket._id, 'resolved')}
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {tickets.length === 0 && (
        <div className="text-center mt-4">
          <p>No support tickets found.</p>
        </div>
      )}
    </div>
  );
};

export default TicketList;