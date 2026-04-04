import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';


const SupportHelp = () => {
  const location = useLocation();
  const { id } = useParams();
  const ticket = location.state?.ticket;

  // Debug: console.log ticket object
  useEffect(() => {
    console.log('Received ticket:', ticket);
  }, [ticket]);

  const [messages, setMessages] = useState([
    { id: 1, text: "Welcome to BG678 Live chat", sender: "bot", timestamp: new Date() },
    { id: 2, text: "Hello dear, please describe in detail the issue you encountered in the game. If possible, kindly send us a screenshot of the problem, this will help us resolve it more effectively and quickly.\nThank you for your cooperation!", sender: "bot", timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date()
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

  const formatTime = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="chat-wrapper">
      <div className="chat-container">
        <div className="chat-header">
          <div className="header-title">
            <h2>BG678 Live chat</h2>
            <span className="official-badge">Official Channel</span>
          </div>
        </div>

        {/* ✅ Ticket details – hamesha dikhega, chahe message ho ya nahi */}
        {ticket && (
          <div className="ticket-details-panel">
            <div className="detail-row">
              <span className="detail-label">Subject:</span>
              <span className="detail-value">{ticket.subject}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Message:</span>
              <span className="detail-value">
                <span className="detail-value">{ticket.message}</span>
              </span>
            </div>
          </div>
        )}

        {/* Agar ticket missing ho to fallback */}
        {!ticket && (
          <div className="ticket-details-panel error">
            No ticket information available. ID: {id}
          </div>
        )}

        <div className="messages-area">
          {messages.map(msg => (
            <div key={msg.id} className={`message ${msg.sender}`}>
              <div className="message-bubble">
                <div className="message-text">{msg.text}</div>
                <div className="message-time">{formatTime(msg.timestamp)}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-area">
          <input
            type="text"
            placeholder="Type a message..."
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
            className="chat-input"
          />
          <button onClick={handleSendMessage} className="send-btn">Send</button>
        </div>
      </div>
    </div>
  );
};

export default SupportHelp;