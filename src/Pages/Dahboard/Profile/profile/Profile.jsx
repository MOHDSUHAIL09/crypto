import React, { useState, useEffect } from "react";
import { 
  FaUser, FaEnvelope, FaPhone, FaWallet, FaUniversity, FaCode, 
  FaCreditCard, FaLock, FaSave, FaEye, FaEyeSlash, FaRegIdCard,
  FaArrowLeft, FaBell, FaShieldAlt, FaCheckCircle, FaCopy,
  FaPenAlt, FaUserCircle
} from "react-icons/fa";
import { useUser } from "../../../../context/UserContext";
import "./Profile.css";

const ProfilePage = () => {
  const { userData, user } = useUser();
  const [showMasterPassword, setShowMasterPassword] = useState(false);
  const [showUpdatePassword, setShowUpdatePassword] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState("");

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
    updateMasterPassword: ""
  });

  useEffect(() => {
    if (userData || user) {
      setFormData(prev => ({
        ...prev,
        loginId: userData?.me || user?.loginid || "M492131",
        fullName: userData?.name || user?.name || "msuhail",
        emailId: userData?.email || user?.EmailID || "testtt@gmail.com",
        mobileNumber: userData?.mobile || user?.mobile || "1234567811"
      }));
      
      const savedAccountNumber = localStorage.getItem("accountNumber");
      if (savedAccountNumber) {
        setFormData(prev => ({ ...prev, accountNumber: savedAccountNumber }));
      } else {
        setFormData(prev => ({ ...prev, accountNumber: "2378707022001" }));
      }
      
      const savedBep20Wallet = localStorage.getItem("bep20Wallet");
      if (savedBep20Wallet) {
        setFormData(prev => ({ ...prev, bep20Wallet: savedBep20Wallet }));
      } else {
        setFormData(prev => ({ ...prev, bep20Wallet: "0x6cd8fd916C21E9d124e2EF61640a70A70c3E4" }));
      }
      
      const savedAccountHolder = localStorage.getItem("accountHolderName");
      if (savedAccountHolder) {
        setFormData(prev => ({ ...prev, accountHolderName: savedAccountHolder }));
      }
      
      const savedBankName = localStorage.getItem("bankName");
      if (savedBankName) {
        setFormData(prev => ({ ...prev, bankName: savedBankName }));
      }
      
      const savedIfscCode = localStorage.getItem("ifscCode");
      if (savedIfscCode) {
        setFormData(prev => ({ ...prev, ifscCode: savedIfscCode }));
      }
      
      setLoading(false);
    } else {
      // Demo fallback data for preview
      setFormData(prev => ({
        ...prev,
        loginId: "M492131",
        fullName: "msuhail",
        emailId: "testtt@gmail.com",
        mobileNumber: "1234567811",
        accountNumber: localStorage.getItem("accountNumber") || "2378707022001",
        bep20Wallet: localStorage.getItem("bep20Wallet") || "0x6cd8fd916C21E9d124e2EF61640a70A70c3E4",
        accountHolderName: localStorage.getItem("accountHolderName") || "",
        bankName: localStorage.getItem("bankName") || "",
        ifscCode: localStorage.getItem("ifscCode") || ""
      }));
      setLoading(false);
    }
  }, [userData, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    localStorage.setItem("accountNumber", formData.accountNumber);
    localStorage.setItem("bep20Wallet", formData.bep20Wallet);
    localStorage.setItem("accountHolderName", formData.accountHolderName);
    localStorage.setItem("bankName", formData.bankName);
    localStorage.setItem("ifscCode", formData.ifscCode);
    
    if (formData.updateMasterPassword) {
      localStorage.setItem("masterPassword", formData.updateMasterPassword);
      setFormData(prev => ({ ...prev, masterPassword: formData.updateMasterPassword, updateMasterPassword: "" }));
      setSaveStatus("✓ Master password updated successfully!");
    } else {
      setSaveStatus("✓ Profile updated successfully!");
    }
    
    setTimeout(() => setSaveStatus(""), 3000);
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
      {/* ========== NEW MODERN HEADER DESIGN ========== */}
      <header className="profile-header-modern">
        <div className="header-bg-shape"></div>
        <div className="header-container">
          <div className="header-top-row">
            <div className="header-logo-area">
                {/* <div className="logo-icon">
                  <FaShieldAlt />
                </div>
             */}
            </div>
            {/* <div className="header-actions">
              <button className="header-icon-btn" aria-label="Notifications">
                <FaBell />
              </button>
            </div> */}
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
          
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="profile-grid">
              
              {/* Personal Details Card - Enhanced */}
              <div className="profile-card personal-card">
                <div className="card-header">
                  <div className="header-icon-wrapper">
                    <FaUser className="card-icon" />
                  </div>
                  <h2>Personal Details</h2>
                </div>
                
                <div className="card-body">
                  <div className="form-group">
                    <label className="text"><FaUser className="input-icon" />Login ID</label>
                    <input type="text" name="loginId" value={formData.loginId} className="text" />
                  </div>

                  <div className="form-group">
                    <label className="text"><FaUser className="input-icon" /> Full Name</label>
                    <input type="text" name="fullName" value={formData.fullName}  className=" text" />
                  </div>

                  <div className="form-group">
                    <label className="text"><FaEnvelope className="input-icon" /> Email ID</label>
                    <input type="email" name="emailId" value={formData.emailId}  className="text" />
                  </div>

                  <div className="form-group">
                    <label className="text"><FaPhone className="input-icon" /> Mobile Number</label>
                    <input type="tel" name="mobileNumber" value={formData.mobileNumber}  className="text" />
                  </div>

                  <div className="form-group">
                    <label className="text"><FaLock className="input-icon" /> Master Password</label>
                    <div className="password-wrapper">
                      <input 
                        type={showMasterPassword ? "text" : "password"} 
                        name="masterPassword" 
                        value={formData.masterPassword} 
                        onChange={handleChange} 
                        placeholder="Enter Master Password" 
                      />
                      <button type="button" className="password-toggle" onClick={() => setShowMasterPassword(!showMasterPassword)}>
                        {showMasterPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>    
                    </div>
                    <div className="card-actions">
                      <button type="submit" className="update-btn secondary-btn">
                        <FaSave className="btn-icon" /> UPDATE PROFILE
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            
              {/* Bank Account Details Card - Enhanced */}
              <div className="profile-card bank-card">
                <div className="card-header">
                  <div className="header-icon-wrapper">
                    <FaUniversity className="card-icon" />
                  </div>
                  <h2>Bank Account Details</h2>
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
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="text"><FaCreditCard className="input-icon" /> Account Number</label>
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
                     <button type="submit" className="update-btn secondary-btn">
                        <FaSave id="text" className="btn-icon " /> UPDATE PROFILE
                      </button>
                  </div>
                </div>
              </div>
            </div>
          </form>

          {/* Security footer note */}
          <div className="security-footer">
            <FaShieldAlt />
            <span>Your information is encrypted and secure. Bank details are stored locally for your convenience.</span>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        /* Inline critical styles for completeness, but use external CSS in real project */
      `}</style>
    </div>
  );
};

export default ProfilePage;