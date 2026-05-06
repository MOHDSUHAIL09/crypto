import React, { useState, useEffect, useRef } from "react";
import { 
  FaUser, FaEnvelope, FaPhone, FaWallet, FaUniversity, FaCode, 
  FaCreditCard, FaLock, FaSave, FaEye, FaEyeSlash, FaRegIdCard,
  FaArrowLeft, FaBell, FaShieldAlt, FaCheckCircle, FaCopy,
  FaPenAlt, FaUserCircle
} from "react-icons/fa";
import { useUser } from "../../../../context/UserContext";
import apiClient from "../../../../api/apiClient";
import toast from "react-hot-toast";
import "./Profile.css";

const ProfilePage = () => {
  const { userData, user, updateUserData } = useUser();
  const [showMasterPassword, setShowMasterPassword] = useState(false);
  const [showUpdatePassword, setShowUpdatePassword] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState("");
  const [isUpdatingPersonal, setIsUpdatingPersonal] = useState(false);
  const [isUpdatingBank, setIsUpdatingBank] = useState(false);

  const [formData, setFormData] = useState({
    loginId: "",
    fullName: "",
    emailId: "",
    mobileNumber: "",
    masterPassword: "",
    bep20Wallet: "",
    accountHolderName: "",
    bankName: "",
    ifscCode: "",
    accountNumber: "",
    updateMasterPassword: "",
    upiNumber: ""
  });

  useEffect(() => {
    if (userData) {
      // Load saved bank details from localStorage
      const savedAccountNumber = localStorage.getItem("accountNumber") || "";
      const savedBep20Wallet = localStorage.getItem("bep20Wallet") || "";
      const savedAccountHolderName = localStorage.getItem("accountHolderName") || "";
      const savedBankName = localStorage.getItem("bankName") || "";
      const savedIfscCode = localStorage.getItem("ifscCode") || "";
      const savedMasterPassword = localStorage.getItem("masterPassword") || "";

      setFormData(prev => ({
        ...prev,
        loginId: userData?.me,
        fullName: userData?.name,
        emailId: userData?.email,
        mobileNumber: userData?.MobileNo,
        regNo: userData?.regno,
        accountNumber: savedAccountNumber,
        bep20Wallet: savedBep20Wallet,
        accountHolderName: savedAccountHolderName,
        bankName: savedBankName,
        ifscCode: savedIfscCode,
        masterPassword: savedMasterPassword
      }));    
      setLoading(false);
    }  
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // API call to update personal profile
  const updateProfileAPI = async (profileData) => {
    try {
      const response = await apiClient.post('/User/update-profile', {
        regNo: parseInt(profileData.regNo) || parseInt(userData?.regno),
        fName: profileData.fullName,
        emailID: profileData.emailId,
        mobile: profileData.mobileNumber,
        masterPasword: formData.masterPassword,
      });
            
      if (response.data?.success) {
        // Remove this toast - only setSaveStatus will handle it
        // toast.success(response.data?.message);

        if (updateUserData) {
          updateUserData({
            name: profileData.fullName,
            emailID: profileData.emailId,
            mobile: profileData.mobileNumber
          });
        }
               
        return true;
      } else {
        toast.error(response.data?.message || "Failed to update profile");
        return false;
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.response?.data?.message || "Error updating profile. Please try again.");
      return false;
    }
  };

  // API call to update bank details
  const updateBankDetailsAPI = async (bankData) => {
    try {
      const response = await apiClient.post('/User/update-details', {
        regNo: parseInt(bankData.regNo) || parseInt(userData?.regno),
        accountNo: bankData.accountNumber,
        accountHolderName: bankData.accountHolderName,
        bankName: bankData.bankName,
        ifscCode: bankData.ifscCode,
        upiNumber: bankData.upiNumber || "",
        masterPasword: bankData.updateMasterPassword || ""
      });
      
      if (response.data?.success) {
        // Remove this toast - only setSaveStatus will handle it
        // toast.success(response.data?.message || "Bank details updated successfully!");
        return true;
      } else {
        toast.error(response.data?.message || "Failed to update bank details");
        return false;
      }
    } catch (error) {
      console.error("Bank details update error:", error);
      toast.error(error.response?.data?.message || "Error updating bank details. Please try again.");
      return false;
    }
  };

  // Separate handler for Personal Details section
  const handlePersonalSubmit = async (e) => {
    e.preventDefault();
    
    if (isUpdatingPersonal) return;
    setIsUpdatingPersonal(true);
    
    try {
      // Prepare data for API update
      const profileUpdateData = {
        fullName: formData.fullName,
        emailId: formData.emailId,
        mobileNumber: formData.mobileNumber,
        regNo: userData?.regno || user?.regno || userData?.RegNo
      };
      
      // Update profile via API
      const apiSuccess = await updateProfileAPI(profileUpdateData);
      
      if (apiSuccess) {
        setSaveStatus("✓ Profile updated successfully!");
        setTimeout(() => setSaveStatus(""), 3000);
      }
    } finally {
      // Add delay to prevent multiple clicks
      setTimeout(() => {
        setIsUpdatingPersonal(false);
      }, 2000);
    }
  };

  // Separate handler for Bank & Password section
  const handleBankSubmit = async (e) => {
    e.preventDefault();
    
    if (isUpdatingBank) return;
    setIsUpdatingBank(true);
    
    try {
      // Prepare bank data for API
      const bankData = {
        accountNumber: formData.accountNumber,
        accountHolderName: formData.accountHolderName,
        bankName: formData.bankName,
        ifscCode: formData.ifscCode,
        upiNumber: formData.upiNumber,
        updateMasterPassword: formData.updateMasterPassword,
        regNo: userData?.regno || user?.regno || userData?.RegNo
      };
      
      // Update bank details via API
      const apiSuccess = await updateBankDetailsAPI(bankData);
      
      if (apiSuccess) {
        // Save bank details to localStorage as backup
        localStorage.setItem("accountNumber", formData.accountNumber);
        localStorage.setItem("bep20Wallet", formData.bep20Wallet);
        localStorage.setItem("accountHolderName", formData.accountHolderName);
        localStorage.setItem("bankName", formData.bankName);
        localStorage.setItem("ifscCode", formData.ifscCode);
        localStorage.setItem("upiNumber", formData.upiNumber);
        
        // Update master password if provided
        if (formData.updateMasterPassword) {
          localStorage.setItem("masterPassword", formData.updateMasterPassword);
          setFormData(prev => ({ 
            ...prev, 
            masterPassword: formData.updateMasterPassword, 
            updateMasterPassword: "" 
          }));
          setSaveStatus("✓ Bank details and master password updated successfully!");
        } else {
          setSaveStatus("✓ Bank details updated successfully!");
        }
        
        setTimeout(() => setSaveStatus(""), 3000);
      }
    } finally {
      // Add delay to prevent multiple clicks
      setTimeout(() => {
        setIsUpdatingBank(false);
      }, 2000);
    }
  };

  const handleCopyWallet = () => {
    navigator.clipboard.writeText(formData.bep20Wallet);
    setCopySuccess("Copied!");
    setTimeout(() => setCopySuccess(""), 2000);
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loader"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page-wrapper">
      {/* Header Section */}
      <header className="profile-header-modern">
        <div className="header-bg-shape"></div>
        <div className="header-container">
          <div className="header-top-row">
            <div className="header-logo-area">
            </div>
          </div>
        
          <div className="header-stats-cards">
            <div className="stat-card">
              <div className="stat-icon">
                <FaRegIdCard />
              </div>
              <div className="stat-info">
                <span className="stat-label">Login ID</span>
                <span className="stat-value">{formData.loginId}</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <FaEnvelope />
              </div>
              <div className="stat-info">
                <span className="stat-label">Email</span>
                <span className="stat-value">{formData.emailId}</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <FaPhone />
              </div>
              <div className="stat-info">
                <span className="stat-label">Mobile</span>
                <span className="stat-value">{formData.mobileNumber}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Profile Content */}
      <div className="profile-page-main">
        <div className="profile-container">
          {saveStatus && (
            <div className="save-status-toast">
              <FaCheckCircle />
              {saveStatus}
            </div>
          )}
          
          <div className="profile-grid">
            {/* Personal Details Card */}
            <form onSubmit={handlePersonalSubmit} className="profile-card personal-card">
              <div className="card-header01">
                <div className="header-icon-wrapper">
                  <FaUser className="card-icon" />
                </div>
                <div className="Personal-Details">Personal Details</div>
              </div>
              
              <div className="card-body">
                <div className="form-group">
                  <label className="text"><FaUser className="input-icon" />Login ID</label>
                  <input 
                    type="text" 
                    name="loginId" 
                    value={formData.loginId} 
                    className="text" 
                    disabled 
                    style={{ backgroundColor: "#d3e8fc", cursor: "not-allowed", color: "#070356", fontSize: "18px" }}
                  />
                </div>

                <div className="form-group">
                  <label className="text"><FaUser className="input-icon" /> Full Name</label>
                  <input 
                    type="text" 
                    name="fullName" 
                    value={formData.fullName} 
                    onChange={handleChange}
                    className="text" 
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="text"><FaEnvelope className="input-icon" /> Email ID</label>
                  <input 
                    type="email" 
                    name="emailId" 
                    value={formData.emailId} 
                    onChange={handleChange}
                    className="text" 
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="text"><FaPhone className="input-icon" /> Mobile Number</label>
                  <input 
                    type="tel" 
                    name="mobileNumber" 
                    value={formData.mobileNumber} 
                    onChange={handleChange}
                    className="text" 
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="text"><FaLock className="input-icon" /> Enter Login Password</label>
                  <div className="password-wrapper">
                    <input 
                      type={showMasterPassword ? "text" : "password"} 
                      name="masterPassword" 
                      value={formData.masterPassword} 
                      onChange={handleChange} 
                      placeholder="Enter Login Password" 
                    />
                    <button type="button" className="password-toggle" onClick={() => setShowMasterPassword(!showMasterPassword)}>
                      {showMasterPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>    
                  </div>
                  <div className="card-actions">
                    <button type="submit" className="update-btn secondary-btn" disabled={isUpdatingPersonal}>
                      <FaSave className="btn-icon" /> 
                      {isUpdatingPersonal ? "UPDATING..." : "UPDATE PROFILE"}
                    </button>
                  </div>
                </div>
              </div>
            </form>

            {/* Bank Account Details Card */}
            <form onSubmit={handleBankSubmit} className="profile-card bank-card">
              <div className="card-header01">
                <div className="header-icon-wrapper">
                  <FaUniversity className="card-icon" />
                </div>
                <div className="Personal-Details">Bank Account Details</div>
              </div>
              
              <div className="card-body">
                <div className="form-group wallet-group">
                  <label className="text"><FaWallet className="input-icon" /> BEP20 Wallet Address</label>
                  <div className="wallet-input-wrapper">
                    <input 
                      type="text" 
                      name="bep20Wallet" 
                      value={formData.bep20Wallet} 
                      onChange={handleChange} 
                      placeholder="0x..." 
                    />
                    <button type="button" className="copy-wallet-btn" onClick={handleCopyWallet} title="Copy address">
                      <FaCopy />
                    </button>
                  </div>
                  {copySuccess && <span className="copy-feedback">{copySuccess}</span>}
                </div>

                <div className="form-group">
                  <label className="text"><FaUser className="input-icon" /> Account Holder Name</label>
                  <input 
                    type="text" 
                    name="accountHolderName" 
                    value={formData.accountHolderName} 
                    onChange={handleChange} 
                    placeholder="Enter Account Holder Name" 
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group half">
                    <label className="text"><FaUniversity className="input-icon" /> Bank Name</label>
                    <input 
                      type="text" 
                      name="bankName" 
                      value={formData.bankName} 
                      onChange={handleChange} 
                      placeholder="Bank Name" 
                      required
                    />
                  </div>

                  <div className="form-group half">
                    <label className="text"><FaCode className="input-icon" /> IFSC Code</label>
                    <input 
                      type="text" 
                      name="ifscCode" 
                      value={formData.ifscCode} 
                      onChange={handleChange} 
                      placeholder="IFSC Code" 
                      required
                    />
                  </div>
                </div>


                <div className="form-group">
                  <label className="text" required><FaWallet className="input-icon" /> Account Number</label>
                  <input 
                    type="text" 
                    name="accountNumber" 
                    value={formData.accountNumber} 
                    onChange={handleChange} 
                    placeholder="Enter Account Number" 
                  />
                </div>

                <div className="form-group">
                  <label className="text"><FaLock className="input-icon" /> Update Master Password</label>
                  <div className="password-wrapper">
                    <input 
                      type={showUpdatePassword ? "text" : "password"} 
                      name="updateMasterPassword" 
                      value={formData.updateMasterPassword} 
                      onChange={handleChange} 
                      placeholder="Enter New Master Password" 
                    />
                    <button type="button" className="password-toggle" onClick={() => setShowUpdatePassword(!showUpdatePassword)}>
                      {showUpdatePassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="card-actions">
                  <button type="submit" className="update-btn secondary-btn" disabled={isUpdatingBank}>
                    <FaSave id="text" className="btn-icon" /> 
                    {isUpdatingBank ? "UPDATING..." : "UPDATE PROFILE"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;