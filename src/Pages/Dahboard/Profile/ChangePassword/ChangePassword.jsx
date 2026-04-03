import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ChangePassword.css';

const ChangePassword = () => {
  const API_URL = 'http://localhost:5000';
  
  // Auto fetch user email - user ko kuch nahi dikhega
  const userEmail = JSON.parse(localStorage.getItem('user'))?.emailID || 'suhailmohd7799@gmail.com';

  // State for Login Password Change
  const [loginOtp, setLoginOtp] = useState('');
  const [loginCurrentPassword, setLoginCurrentPassword] = useState('');
  const [loginNewPassword, setLoginNewPassword] = useState('');
  const [loginConfirmPassword, setLoginConfirmPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginOtpSent, setLoginOtpSent] = useState(false);
  const [loginOtpVerified, setLoginOtpVerified] = useState(false);

  // State for Master Password Change
  const [masterOtp, setMasterOtp] = useState('');
  const [masterNewPassword, setMasterNewPassword] = useState('');
  const [masterConfirmPassword, setMasterConfirmPassword] = useState('');
  const [masterLoginPassword, setMasterLoginPassword] = useState('');
  const [masterLoading, setMasterLoading] = useState(false);
  const [masterOtpSent, setMasterOtpSent] = useState(false);
  const [masterOtpVerified, setMasterOtpVerified] = useState(false);

  // Toast functions
  const showSuccess = (msg) => toast.success(msg, { position: "top-right", autoClose: 3000, theme: "colored" });
  const showError = (msg) => toast.error(msg, { position: "top-right", autoClose: 4000, theme: "colored" });
  const showInfo = (msg) => toast.info(msg, { position: "top-right", autoClose: 3000, theme: "colored" });

  // Send OTP for Login Password
  const handleLoginSendOtp = async () => {
    setLoginLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setLoginOtpSent(true);
        showSuccess('✅ OTP sent successfully to your registered email!');
      } else {
        showError(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      showError('Network error. Please check if backend is running');
    } finally {
      setLoginLoading(false);
    }
  };

  // Verify OTP for Login
  const handleLoginVerifyOtp = async () => {
    if (!loginOtp) {
      showError('Please enter OTP');
      return;
    }

    setLoginLoading(true);

    try {
      const response = await fetch(`${API_URL}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: loginOtp })
      });

      const data = await response.json();

      if (data.success) {
        setLoginOtpVerified(true);
        showSuccess('✅ OTP verified successfully!');
      } else {
        showError(data.message || 'Invalid OTP. Please try again');
      }
    } catch (error) {
      showError('Network error. Please try again');
    } finally {
      setLoginLoading(false);
    }
  };

  // Update Login Password
  const handleLoginUpdatePassword = async () => {
    if (!loginOtpVerified) {
      showError('Please verify OTP first');
      return;
    }
    
    if (!loginCurrentPassword) {
      showError('Please enter current password');
      return;
    }

    if (loginNewPassword !== loginConfirmPassword) {
      showError('New password and confirm password do not match');
      return;
    }
    
    if (loginNewPassword.length < 6) {
      showError('Password must be at least 6 characters');
      return;
    }

    setLoginLoading(true);

    // TODO: Call your API to update password
    setTimeout(() => {
      showSuccess('🎉 Login password updated successfully!');
      setLoginOtp('');
      setLoginCurrentPassword('');
      setLoginNewPassword('');
      setLoginConfirmPassword('');
      setLoginOtpSent(false);
      setLoginOtpVerified(false);
      setLoginLoading(false);
    }, 1000);
  };

  const handleLoginCancel = () => {
    setLoginOtp('');
    setLoginCurrentPassword('');
    setLoginNewPassword('');
    setLoginConfirmPassword('');
    setLoginOtpSent(false);
    setLoginOtpVerified(false);
    showInfo('Login password change cancelled');
  };

  // Send OTP for Master Password
  const handleMasterSendOtp = async () => {
    setMasterLoading(true);

    try {
      const response = await fetch(`${API_URL}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail })
      });

      const data = await response.json();

      if (data.success) {
        setMasterOtpSent(true);
        showSuccess('✅ OTP sent successfully to your registered email!');
      } else {
        showError(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      showError('Network error. Please try again');
    } finally {
      setMasterLoading(false);
    }
  };

  // Verify OTP for Master
  const handleMasterVerifyOtp = async () => {
    if (!masterOtp) {
      showError('Please enter OTP');
      return;
    }

    setMasterLoading(true);

    try {
      const response = await fetch(`${API_URL}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: masterOtp })
      });

      const data = await response.json();

      if (data.success) {
        setMasterOtpVerified(true);
        showSuccess('✅ OTP verified successfully!');
      } else {
        showError(data.message || 'Invalid OTP. Please try again');
      }
    } catch (error) {
      showError('Network error. Please try again');
    } finally {
      setMasterLoading(false);
    }
  };

  // Update Master Password
  const handleMasterUpdatePassword = async () => {
    if (!masterOtpVerified) {
      showError('Please verify OTP first');
      return;
    }

    if (masterNewPassword !== masterConfirmPassword) {
      showError('New password and confirm password do not match');
      return;
    }

    if (masterNewPassword.length < 6) {
      showError('Password must be at least 6 characters');
      return;
    }

    if (!masterLoginPassword) {
      showError('Please enter login password for verification');
      return;
    }

    setMasterLoading(true);

    setTimeout(() => {
      showSuccess('🔐 Master password updated successfully!');
      setMasterOtp('');
      setMasterNewPassword('');
      setMasterConfirmPassword('');
      setMasterLoginPassword('');
      setMasterOtpSent(false);
      setMasterOtpVerified(false);
      setMasterLoading(false);
    }, 1000);
  };

  const handleMasterCancel = () => {
    setMasterOtp('');
    setMasterNewPassword('');
    setMasterConfirmPassword('');
    setMasterLoginPassword('');
    setMasterOtpSent(false);
    setMasterOtpVerified(false);
    showInfo('Master password change cancelled');
  };

  return (
    <>
      <ToastContainer />
      
      <div className="password-container">
        {/* Change Login Password Section */}
        <div className="password-card">
          <h2 className="card-title">Change Login Password</h2>
          
          <div className="form-group">
            <label className="form-label">Enter OTP</label>
            <div className="otp-wrapper">
              <input
                type="text"
                value={loginOtp}
                onChange={(e) => setLoginOtp(e.target.value)}
                placeholder="Enter OTP"
                className="form-input"
                disabled={loginOtpVerified}
              />
              {!loginOtpSent ? (
                <button
                  onClick={handleLoginSendOtp}
                  disabled={loginLoading}
                  className="send-otp-btn"
                >
                  {loginLoading ? 'Sending...' : 'SEND OTP'}
                </button>
              ) : (
                <button
                  onClick={handleLoginVerifyOtp}
                  disabled={loginLoading || loginOtpVerified}
                  className="send-otp-btn"
                >
                  {loginLoading ? 'Verifying...' : 'VERIFY OTP'}
                </button>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input
              type="password"
              value={loginCurrentPassword}
              onChange={(e) => setLoginCurrentPassword(e.target.value)}
              placeholder="Current Password"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">New Password</label>
            <input
              type="password"
              value={loginNewPassword}
              onChange={(e) => setLoginNewPassword(e.target.value)}
              placeholder="New Password"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <input
              type="password"
              value={loginConfirmPassword}
              onChange={(e) => setLoginConfirmPassword(e.target.value)}
              placeholder="Confirm New Password"
              className="form-input"
            />
          </div>

          <div className="button-group">
            <button
              onClick={handleLoginUpdatePassword}
              disabled={loginLoading || !loginOtpVerified}
              className="btn-update"
            >
              UPDATE PASSWORD
            </button>
            <button
              onClick={handleLoginCancel}
              className="btn-cancel"
            >
              CANCEL
            </button>
          </div>
        </div>

        {/* Change Master Password Section */}
        <div className="password-card">
          <h2 className="card-title">Change Master Password</h2>

          <div className="form-group">
            <label className="form-label">Enter OTP</label>
            <div className="otp-wrapper">
              <input
                type="text"
                value={masterOtp}
                onChange={(e) => setMasterOtp(e.target.value)}
                placeholder="Enter OTP"
                className="form-input"
                disabled={masterOtpVerified}
              />
              {!masterOtpSent ? (
                <button
                  onClick={handleMasterSendOtp}
                  disabled={masterLoading}
                  className="send-otp-btn"
                >
                  {masterLoading ? 'Sending...' : 'SEND OTP'}
                </button>
              ) : (
                <button
                  onClick={handleMasterVerifyOtp}
                  disabled={masterLoading || masterOtpVerified}
                  className="send-otp-btn"
                >
                  {masterLoading ? 'Verifying...' : 'VERIFY OTP'}
                </button>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">New Master Password</label>
            <input
              type="password"
              value={masterNewPassword}
              onChange={(e) => setMasterNewPassword(e.target.value)}
              placeholder="New Master Password"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm New Master Password</label>
            <input
              type="password"
              value={masterConfirmPassword}
              onChange={(e) => setMasterConfirmPassword(e.target.value)}
              placeholder="Confirm New Master Password"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Login Password (For Verification)</label>
            <input
              type="password"
              value={masterLoginPassword}
              onChange={(e) => setMasterLoginPassword(e.target.value)}
              placeholder="Enter your login password"
              className="form-input"
            />
          </div>

          <div className="button-group">
            <button
              onClick={handleMasterUpdatePassword}
              disabled={masterLoading || !masterOtpVerified}
              className="btn-update"
            >
              UPDATE PASSWORD
            </button>
            <button
              onClick={handleMasterCancel}
              className="btn-cancel"
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;