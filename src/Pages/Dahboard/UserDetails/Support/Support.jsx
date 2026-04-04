// Support.jsx - With Toast Messages
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useUser } from '../../../../context/UserContext';
import CustomTable from '../../CustomTable/CustomTable';
import './Support.css';

const Support = () => {
  const navigate = useNavigate(); 
  const { user, userData, refreshData } = useUser();
  
  // State declarations - ALL FIXED
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [selectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [formData, setFormData] = useState({
    subject: '',
    ticketType: '', 
    messege: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');  // ✅ FIXED: Added 'error' variable
  const [currentPage] = useState(1); 

  const [totalRecords, setTotalRecords] = useState(0);  // ✅ FIXED: Added variable name
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeFilter] = useState('widthdraw');
  
  // Toast State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  const API_BASE_URL = 'https://api.mangowealthplanner.com/api/Dashboard';

  // Handle View Ticket - Navigation
const handleViewTicket = (ticket) => {   
  navigate(`/dashboard/supporthelp/${ticket.id}`, { 
    state: { ticket }  
  });
};
  // Toast Function
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const getAuthToken = () => {
    return localStorage.getItem('token') || localStorage.getItem('auth_token');
  };

  const getRegNo = () => {
    if (userData?.regno) return userData.regno;
    if (user?.Regno) return user.Regno;
    if (user?.regno) return user.regno;
    return localStorage.getItem('regno') || '1';
  };

  const getLoginId = () => {
    if (userData?.me) return userData.me;
    if (user?.loginid) return user.loginid;
    if (user?.LoginId) return user.LoginId;
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        const parsed = JSON.parse(storedUserData);
        if (parsed.me) return parsed.me;
        if (parsed.loginid) return parsed.loginid;
      } catch (e) {}
    }
    return 'india';
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
    } catch (e) {
      return dateString;
    }
  };

  // Ticket List Fetch
  const fetchTickets = async (paymentMode = 'widthdraw', pageIndex = 1) => {
    const token = getAuthToken();
    const regNo = getRegNo();
    
    if (!token) {
      setError('❌ Please login first. Token not found.');
      showToast('Please login first', 'error');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const url = `${API_BASE_URL}/ticket-list?PageIndex=${pageIndex}&PageSize=10&RegNo=${regNo}&PaymentMode=${paymentMode}`;
      
      console.log('📡 Fetching tickets:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ API Response:', data);
      
      if (data?.success && data?.data?.data && Array.isArray(data.data.data)) {
        const formattedTickets = data.data.data.map((item) => ({
          id: item.MsgId,
          ticketId: `FX${item.MsgId}`,
          date: formatDate(item.MsgDate),
          type: item.MsgType === 'withdraw' ? 'Withdrawal' : 
          item.MsgType === 'income' ? 'Income' : 
          item.MsgType || 'N/A',
          subject: item.MsgSubject || 'VIEW',
          status: item.status,
          rowNumber: item.RowNumber,
          message: item.Message,
          originalDate: item.MsgDate
        }));
        
        setTickets(formattedTickets);
        setTotalRecords(data.data.recordCount || 0);
    
        
        console.log('📊 Formatted tickets:', formattedTickets);
        console.log('📊 Total records:', data.data.recordCount);
        console.log('📊 Total pages:', Math.ceil((data.data.recordCount || 0) / 10));
      } else {
        setTickets([]);
        setTotalRecords(0);
        console.log('⚠️ No tickets found or invalid response structure');
      }
      
    } catch (err) {
      console.error('❌ Fetch error:', err);
      setError(err.message);
      showToast(err.message, 'error');
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  // Create Ticket
  const createTicket = async (ticketData) => {
    const token = getAuthToken();
    const loginId = getLoginId();
    const regNo = getRegNo();
    
    if (!token) {
      showToast('Please login first', 'error');
      return;
    }

    setSubmitting(true);
    
    try {
      const formDataPayload = new FormData();
      formDataPayload.append('From', regNo);
      formDataPayload.append('Subject', ticketData.subject);
      formDataPayload.append('MessageType', ticketData.ticketType === 'withdrawal' ? 'withdraw' : 'income');
      formDataPayload.append('LoginId', loginId);
      
      if (ticketData.messege) {
        formDataPayload.append('Message', ticketData.messege);
      }
      
      if (selectedImage) {
        formDataPayload.append('TicketImgage', selectedImage);
      }
      
      console.log('📤 Creating ticket...');
      console.log('FormData contents:');
      for (let pair of formDataPayload.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
      
      const response = await fetch(`${API_BASE_URL}/create-ticket`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataPayload
      });

      const responseText = await response.text();
      console.log('📥 Create Response:', responseText);
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        result = { message: responseText };
      }

      if (!response.ok) {
        throw new Error(result.message || result.Message || responseText);
      }

      if (result?.success || result?.data?.success) {
        console.log('✅ Ticket created successfully');
        
        await fetchTickets(activeFilter, currentPage);
        
        if (refreshData) refreshData();
        
        setShowModal(false);
        resetForm();
        setSelectedImage(null);
        
        showToast('✅ Ticket created successfully!', 'success');
      } else {
        throw new Error(result.message || 'Failed to create ticket');
      }
      
    } catch (err) {
      console.error('❌ Create error:', err);
      showToast(`❌ ${err.message}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Send Reply
  const sendReply = async () => {
    if (!replyMessage.trim()) {
      showToast('Please type your message', 'error');
      return;
    }
    
    const token = getAuthToken();
    const loginId = getLoginId();
    const regNo = getRegNo();
    
    try {
      const formDataPayload = new FormData();
      formDataPayload.append('From', regNo);
      formDataPayload.append('Subject', `RE: ${selectedTicket?.subject}`);
      formDataPayload.append('MessageType', 'reply');
      formDataPayload.append('Message', replyMessage);
      formDataPayload.append('LoginId', loginId);
      formDataPayload.append('ParentId', selectedTicket?.id);
      
      const response = await fetch(`${API_BASE_URL}/create-ticket`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataPayload
      });
      
      if (response.ok) {
        showToast('✅ Reply sent successfully!', 'success');
        setReplyMessage('');
        await fetchTickets(activeFilter, currentPage);
      } else {
        showToast('❌ Failed to send reply', 'error');
      }
    } catch (err) {
      console.error('Reply error:', err);
      showToast('❌ Failed to send reply', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      subject: '',
      ticketType: '',
      messege: ''
    });
    setSelectedImage(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.ticketType) {
      showToast('Please select ticket type', 'error');
      return;
    }
    if (!formData.subject.trim()) {
      showToast('Please enter subject', 'error');
      return;
    }
    createTicket({
      subject: formData.subject,
      ticketType: formData.ticketType,
      messege: formData.messege
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
      showToast('Image selected: ' + e.target.files[0].name, 'success');
    }
  };

  useEffect(() => {
    const token = getAuthToken();
    console.log('🔑 Auth token exists:', !!token);
    if (!token) {
      setError('⚠️ No authentication token found. Please login first.');
      showToast('Please login first', 'error');
    } else {
      fetchTickets('widthdraw', 1);
    }
  }, []);

  // Debug: Log tickets when they change
  useEffect(() => {
    console.log('🎫 Tickets updated:', tickets.length, 'tickets');
  }, [tickets]);

  return (
    <div className="downline-main-wrapper support-container">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast-notification ${toast.type}`}>
          <span className="toast-message">{toast.message}</span>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="error-message" style={{backgroundColor: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '5px', marginBottom: '15px'}}>
          {error}
        </div>
      )}

      <div className="support-header">
        <div>
          <h1 className="support-title">Ticket List</h1>
          {totalRecords > 0 && <p>Total Tickets: {totalRecords}</p>}
        </div>

        <button className="create-ticket-btn" onClick={() => setShowModal(true)}>
          Create New Ticket
        </button>
      </div>

      {loading && <div className="loading-spinner">Loading tickets...</div>}

      <CustomTable 
        columns={["S.NO.", "DATE", "TICKET ID", "TICKET TYPE", "SUBJECT"]}
        loading={loading}
        emptyMessage="No tickets found. Create your first ticket!"
      >
        {tickets.length > 0 ? (
          tickets.map((ticket, index) => (
            <tr key={ticket.id || index}>
              <td>{((currentPage - 1) * 10) + index + 1}</td>
              <td>{ticket.date}</td>
              <td className="ticket-id">{ticket.ticketId}</td>
              <td>
                <span className={`ticket-type ${ticket.type?.toLowerCase()}`}>
                  {ticket.type}
                </span>
              </td>
              <td>
                <button 
                  className="view-btn"
                  onClick={() => handleViewTicket(ticket)}               
                >
                  VIEW
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" style={{textAlign: 'center'}}>No tickets found</td>
          </tr>
        )}
      </CustomTable>

      {/* Create Ticket Modal */}
      {showModal && (
        <div className="modal-overlay01">
          <div className="modal-content01">
            <div className="modal-header01">
              <h2>Create New Ticket</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form className='modal-middle' onSubmit={handleSubmit}>
              <div className="form-group01">
                <label>Ticket Type *</label>
                <select 
                  name="ticketType" 
                  value={formData.ticketType} 
                  onChange={handleInputChange} 
                  required
                >
                  <option value="">-- Select Message Type --</option>
                  <option value="income">Income</option>
                  <option value="withdrawal">Withdrawal</option>
                  <option value="deposit">Deposit</option>
                  <option value="purchase_bot">Purchase BOT</option>
                  <option value="profile">Profile</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Subject *</label>
                <input 
                  type="text" 
                  name="subject" 
                  value={formData.subject} 
                  onChange={handleInputChange} 
                  placeholder="Enter ticket subject" 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  name="messege" 
                  value={formData.messege} 
                  onChange={handleInputChange} 
                  placeholder="Enter detailed messege" 
                  rows="4" 
                />
              </div>
              
              <div className="form-group">
                <label>Attachment (Optional)</label>
                <input type="file" onChange={handleImageChange} accept="image/*" />
                {selectedImage && <p style={{fontSize: '12px', marginTop: '5px'}}>Selected: {selectedImage.name}</p>}
              </div>
              
              <div className="modal-buttons">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>  
  );
};

export default Support;