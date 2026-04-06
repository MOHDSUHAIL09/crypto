import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiClient from '../../../../api/apiClient';
import './ChangePassword.css';

const ChangePassword = () => {
  // ✅ Get loginid and regno from localStorage
  const getLoginId = () => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        const parsed = JSON.parse(storedUserData);
        if (parsed.loginid) return parsed.loginid;
        if (parsed.me) return parsed.me;
      } catch (e) {}
    }
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.loginid) return user.loginid;
    if (user?.me) return user.me;
    return 'india';
  };

  const loginid = getLoginId();
  const regno = JSON.parse(localStorage.getItem('user'))?.Regno || 
                JSON.parse(localStorage.getItem('user'))?.regno || 
                localStorage.getItem('regno');

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

  // ========== SEND OTP (Login) ==========
  const handleLoginSendOtp = async () => {
    if (!regno) {
      showError('Registration number not found. Please login again.');
      return;
    }
    setLoginLoading(true);
    try {
      const response = await apiClient.post(`/User/genrate-otp?loginid=${loginid}&regno=${regno}`, {});
      if (response.data.success || response.data.status === 'success') {
        setLoginOtpSent(true);
        showSuccess('OTP sent successfully!');
      } else {
        showError(response.data.message || 'Failed to send OTP');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Network error';
      showError(msg);
    } finally {
      setLoginLoading(false);
    }
  };

  // ========== VERIFY OTP (Login) ==========
  const handleLoginVerifyOtp = async () => {
    if (!loginOtp) {
      showError('Please enter OTP');
      return;
    }
    setLoginLoading(true);
    try {
      const response = await apiClient.post('/User/verify-otp', null, {
        params: { loginid, regno, otp: loginOtp }
      });
      if (response.data.success) {
        setLoginOtpVerified(true);
        showSuccess('OTP verified successfully!');
      } else {
        showError(response.data.message || 'Invalid OTP');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Network error';
      showError(msg);
    } finally {
      setLoginLoading(false);
    }
  };

  // ========== UPDATE LOGIN PASSWORD (with 8 character validation) ==========
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
    // ✅ Changed from 6 to 8 characters
    if (loginNewPassword.length < 8) {
      showError('Password must be at least 8 characters');
      return;
    }

    setLoginLoading(true);
    try {
      const response = await apiClient.post('/User/update-password', {
        regno: Number(regno),
        current_password: loginCurrentPassword,
        new_password: loginNewPassword
      });
      if (response.data.success) {
        showSuccess('Login password updated successfully!');
        setLoginOtp('');
        setLoginCurrentPassword('');
        setLoginNewPassword('');
        setLoginConfirmPassword('');
        setLoginOtpSent(false);
        setLoginOtpVerified(false);
      } else {
        showError(response.data.message || 'Password update failed');
      }
    } catch (error) {
      let errorMsg = 'Failed to update password';
      if (error.response?.data?.message) {
        if (Array.isArray(error.response.data.message)) {
          errorMsg = error.response.data.message.join(', ');
        } else {
          errorMsg = error.response.data.message;
        }
      }
      showError(errorMsg);
    } finally {
      setLoginLoading(false);
    }
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

  // ========== SEND OTP (Master) ==========
  const handleMasterSendOtp = async () => {
    if (!regno) {
      showError('Registration number not found.');
      return;
    }
    setMasterLoading(true);
    try {
      const response = await apiClient.post(`/User/genrate-otp?loginid=${loginid}&regno=${regno}`, {});
      if (response.data.success || response.data.status === 'success') {
        setMasterOtpSent(true);
        showSuccess('OTP sent successfully!');
      } else {
        showError(response.data.message || 'Failed to send OTP');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Network error';
      showError(msg);
    } finally {
      setMasterLoading(false);
    }
  };

  // ========== VERIFY OTP (Master) ==========
  const handleMasterVerifyOtp = async () => {
    if (!masterOtp) {
      showError('Please enter OTP');
      return;
    }
    setMasterLoading(true);
    try {
      const response = await apiClient.post('/User/verify-otp', null, {
        params: { loginid, regno, otp: masterOtp }
      });
      if (response.data.success) {
        setMasterOtpVerified(true);
        showSuccess('OTP verified successfully!');
      } else {
        showError(response.data.message || 'Invalid OTP');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Network error';
      showError(msg);
    } finally {
      setMasterLoading(false);
    }
  };

  // ========== UPDATE MASTER PASSWORD (with 8 character validation) ==========
  const handleMasterUpdatePassword = async () => {
    if (!masterOtpVerified) {
      showError('Please verify OTP first');
      return;
    }
    if (masterNewPassword !== masterConfirmPassword) {
      showError('New master password and confirm password do not match');
      return;
    }
    // ✅ Changed from 6 to 8 characters
    if (masterNewPassword.length < 8) {
      showError('Master password must be at least 8 characters');
      return;
    }
    if (!masterLoginPassword) {
      showError('Please enter login password for verification');
      return;
    }

    setMasterLoading(true);
    try {
      const response = await apiClient.post('/User/update-master-password', {
        regno: Number(regno),
        current_password: masterLoginPassword,
        new_password: masterNewPassword,
        otp: masterOtp
      });
      if (response.data.success) {
        showSuccess('Master password updated successfully!');
        setMasterOtp('');
        setMasterNewPassword('');
        setMasterConfirmPassword('');
        setMasterLoginPassword('');
        setMasterOtpSent(false);
        setMasterOtpVerified(false);
      } else {
        showError(response.data.message || 'Master password update failed');
      }
    } catch (error) {
      let errorMsg = 'Failed to update master password';
      if (error.response?.data?.message) {
        if (Array.isArray(error.response.data.message)) {
          errorMsg = error.response.data.message.join(', ');
        } else {
          errorMsg = error.response.data.message;
        }
      }
      showError(errorMsg);
    } finally {
      setMasterLoading(false);
    }
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
      <div className="password-container mb-5">
        {/* Change Login Password Section */}
        <div className="password-card">
          <h2 className="card-title">Change Login Password</h2>
          <div className='f-contaoner'>
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
                  <button onClick={handleLoginSendOtp} disabled={loginLoading} className="send-otp-btn">
                    {loginLoading ? 'Sending...' : 'SEND OTP'}
                  </button>
                ) : (
                  <button onClick={handleLoginVerifyOtp} disabled={loginLoading || loginOtpVerified} className="send-otp-btn">
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
                placeholder="New Password (min 8 characters)"
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
              <button onClick={handleLoginUpdatePassword} disabled={loginLoading || !loginOtpVerified} className="btn-update">
                UPDATE PASSWORD
              </button>
              <button onClick={handleLoginCancel} className="btn-cancel">
                CANCEL
              </button>
            </div>
          </div>
        </div>

        {/* Change Master Password Section */}
        <div className="password-card">
          <h2 className="card-title">Change Master Password</h2>
          <div className='f-contaoner'>
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
                  <button onClick={handleMasterSendOtp} disabled={masterLoading} className="send-otp-btn">
                    {masterLoading ? 'Sending...' : 'SEND OTP'}
                  </button>
                ) : (
                  <button onClick={handleMasterVerifyOtp} disabled={masterLoading || masterOtpVerified} className="send-otp-btn">
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
                placeholder="New Master Password (min 8 characters)"
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
              <button onClick={handleMasterUpdatePassword} disabled={masterLoading || !masterOtpVerified} className="btn-update">
                UPDATE PASSWORD
              </button>
              <button onClick={handleMasterCancel} className="btn-cancel">
                CANCEL
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;