import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { FaUpload } from "react-icons/fa";
import './Support.css';

const SupportHelp = () => {
  const location = useLocation();
  const { id } = useParams();
  const ticket = location.state?.ticket;
  const navigate = useNavigate();

  const getLoginId = () => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        const parsed = JSON.parse(storedUserData);
        if (parsed.me) return parsed.me;
        if (parsed.loginid) return parsed.loginid;
      } catch (e) {}
    }
    return localStorage.getItem('loginid') || 'india';
  };

  const [messages, setMessages] = useState([  
    { id: 2, text: "Hello dear, please describe in detail the issue you encountered in the game. If possible, kindly send us a screenshot of the problem, this will help us resolve it more effectively and quickly.\nThank you for your cooperation!", sender: "bot", timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);  // 👈 hidden file input ke liye ref

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    console.log('Received ticket:', ticket);
  }, [ticket]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
      loginid: getLoginId()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    setTimeout(() => {
      const botReply = "Hello dear, could you please send us a screenshot of the issue you're experiencing? This will help us assist you more accurately and efficiently.";
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: botReply,
        sender: "bot",
        timestamp: new Date()
      }]);
    }, 800);
  };

  // 👇 file picker kholega
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // 👇 file select hone par image upload karega
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageBase64 = reader.result;
        const imageMessage = {
          id: messages.length + 1,
          text: "📷 Screenshot attached",
          sender: "user",
          timestamp: new Date(),
          loginid: getLoginId(),
          image: imageBase64   // image data store kar rahe hain
        };
        setMessages(prev => [...prev, imageMessage]);
        
        // optional: bot reply
        setTimeout(() => {
          const botReply = "Thank you for sharing the screenshot. Our team will look into it and get back to you soon.";
          setMessages(prev => [...prev, {
            id: prev.length + 1,
            text: botReply,
            sender: "bot",
            timestamp: new Date()
          }]);
        }, 800);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Kripya sirf image file upload karein (JPG, PNG, etc.)");
    }
    // reset file input so same file can be uploaded again
    event.target.value = '';
  };

  const formatTime = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const goBackToTicketList = () => {
    navigate('/dashboard/Support');
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-container">
        <div className="chat-header">
          <div className="d-flex justify-content-between align-items-start">
            <div className="header-title">
              <h2>Message Center</h2>
            </div>
            <div 
              className="official-badge" 
              onClick={goBackToTicketList}
              style={{ cursor: 'pointer' }}
            >
              Back To Ticket List
            </div>
          </div>
        </div>

        {!ticket && (
          <div className="ticket-details-panel error" style={{ margin: '16px 20px 0 20px' }}>
            No ticket information available. ID: {id}
          </div>
        )}
        
        <div className="messages-area">
          {ticket && (
            <div className="message-bubble01">
              <div className="detail-row">
                <span className="detail-label">Subject :</span>
                <span className="detail-value"><strong>{ticket.subject}</strong></span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Message :</span>
                <span className="detail-value"><strong>{ticket.message ? ticket.message : 'No message provided'}</strong></span>
              </div>
            </div>
          )}
          
          {messages.map(msg => (
            <div key={msg.id} className={`message ${msg.sender}`}>
              <div className="message-bubble">
                {/* 👇 agar message mein image hai toh dikhao */}
                {msg.image && (
                  <img 
                    src={msg.image} 
                    alt="screenshot" 
                    style={{ maxWidth: '200px', maxHeight: '150px', borderRadius: '8px', marginBottom: '8px' }} 
                  />
                )}
                <div className="message-text">{msg.text}</div>
                <div className="message-time">{formatTime(msg.timestamp)}</div>
                {msg.sender === 'user' && msg.loginid && (
                  <div className="message-loginid">{msg.loginid}</div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-area">
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Type a message..."
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
              className="chat-input"
            />
            <FaUpload onClick={handleUploadClick} />  {/* 👈 click handler */}
            {/* 👇 hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <button onClick={handleSendMessage} className="send-btn">Send</button>
        </div>
      </div>
    </div>
  );
};

export default SupportHelp;