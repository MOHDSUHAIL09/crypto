import React, { useState, useRef, useEffect } from "react";
import { FaHome, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../context/UserContext";
import "../../../assets/dashboardcss/css/Dashboard.css";

const Header = () => {

  const navigate = useNavigate();
  const { logoutUser } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ✅ Toggle dropdown function
  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logoutUser();
    navigate("/");
  };

  return (
    <header className="topbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px' }}>

      <div className="left" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <FaHome className="Dasboard-icon" style={{ cursor: 'pointer' }} />
        <h4>Dashboard</h4>
      </div>

      {/* Dropdown Container */}
      <div className="right" ref={dropdownRef} style={{ position: 'relative' }}>
        <button 
          className="logout-btn" 
          onClick={toggleDropdown}
          style={{
            background: "linear-gradient(to right, var(--primary-clr), var(--secondary-clr))",
            color: "#ebd8e8",
            border: 'none',
            cursor: 'pointer',
            padding: '10px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <FaUser fontSize={"22px"} />
        </button>

        {/* Dropdown Menu - Sirf open hote time animation */}
        {isDropdownOpen && (
          <div 
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '10px',
              background: '#ffffff',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              minWidth: '180px',
              zIndex: 9999,
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
              animation: 'dropdownOpen 0.2s ease-out'
            }}
          >
            {/* User Info Section */}
            {/* <div style={{
              padding: '12px 16px',
              borderBottom: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc'
            }}>
              <p style={{ margin: 0, fontWeight: '600', fontSize: '14px', color: '#1e293b' }}>
                My Account
              </p>
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>
                Click below to logout
              </p>
            </div> */}
            <div
              onClick={() => {
                setIsDropdownOpen(false);   // 👈 dropdown bhi band ho jayega
                navigate("/dashboard/profile"); // 👈 correct full path
              }} 
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc',
                cursor: "pointer"
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontWeight: '500',
                  fontSize: '14px',
                  color: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <FaUser /> Profile
              </p>
            </div>


            {/* Logout Button */}
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                background: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '14px',
                color: '#ef4444',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => e.target.style.background = '#fef2f2'}
              onMouseLeave={(e) => e.target.style.background = 'white'}
            >
              <FaSignOutAlt size={16} />
              Logout
            </button>
          </div>
        )}
      </div>
      
      {/* Simple Animation Keyframes */}
      <style>{`
        @keyframes dropdownOpen {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      
    </header>
  );
};

export default Header;