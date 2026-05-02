import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [tickets, setTickets] = useState([]);
  const socketRef = useRef();
  const messagesEndRef = useRef();

  useEffect(() => {
    socketRef.current = io('http://localhost:5000');

    socketRef.current.on('message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    fetchTickets();

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/support/tickets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const selectTicket = async (ticket) => {
    setSelectedTicket(ticket);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/support/tickets/${ticket._id}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedTicket) return;

    const messageData = {
      ticketId: selectedTicket._id,
      content: newMessage,
      sender: 'support'
    };

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/support/messages', messageData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      socketRef.current.emit('sendMessage', messageData);
      setNewMessage('');
    } catch (error) {
      alert('Error sending message');
    }
  };

  return (
    <div className="row">
      <div className="col-md-4">
        <h3>Active Tickets</h3>
        <div className="list-group">
          {tickets.filter(ticket => ticket.status !== 'resolved').map((ticket) => (
            <button
              key={ticket._id}
              className={`list-group-item list-group-item-action ${selectedTicket?._id === ticket._id ? 'active' : ''}`}
              onClick={() => selectTicket(ticket)}
            >
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{ticket.subject}</h5>
                <small className={`badge bg-${ticket.priority === 'high' ? 'danger' : ticket.priority === 'medium' ? 'warning' : 'success'}`}>
                  {ticket.priority}
                </small>
              </div>
              <p className="mb-1">{ticket.description}</p>
              <small>{ticket.createdBy?.name || 'Unknown'}</small>
            </button>
          ))}
        </div>
      </div>

      <div className="col-md-8">
        {selectedTicket ? (
          <div className="card">
            <div className="card-header">
              <h4>Chat with {selectedTicket.createdBy?.name || 'User'}</h4>
              <small className="text-muted">Ticket: {selectedTicket.subject}</small>
            </div>
            <div className="card-body" style={{ height: '400px', overflowY: 'auto' }}>
              {messages.map((message, index) => (
                <div key={index} className={`d-flex mb-3 ${message.sender === 'support' ? 'justify-content-end' : 'justify-content-start'}`}>
                  <div className={`p-2 rounded ${message.sender === 'support' ? 'bg-primary text-white' : 'bg-light'}`} style={{ maxWidth: '70%' }}>
                    <small className="text-muted">
                      {message.sender === 'support' ? 'You' : selectedTicket.createdBy?.name || 'User'} - {new Date(message.timestamp).toLocaleTimeString()}
                    </small>
                    <p className="mb-0">{message.content}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="card-footer">
              <form onSubmit={sendMessage}>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button className="btn btn-primary" type="submit">Send</button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="text-center mt-5">
            <h4>Select a ticket to start chatting</h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;