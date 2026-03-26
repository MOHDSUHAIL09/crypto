  import React, { useState, useEffect } from 'react';
  import { createPortal } from 'react-dom';
  import './AgreementForm.css';
import toast from 'react-hot-toast';

  const AgreementForm = ({ open, onClose, loginId }) => {
    const passedLoginId = (loginId || "GUEST").toUpperCase();
    const [showSuccess, setShowSuccess] = useState(false); // Success popup control

  const [formData, setFormData] = useState({
    fullName: '',
    emailID: '',
    dob: '',
    phone: '',
    motherMaidenName: '',
    address: '',
    amountUSDT: '',
    wallet: '',
  });

    const [agreementId, setAgreementId] = useState("");

    useEffect(() => {
      if (!open) {
          setShowSuccess(false); 
          return;
      }

      const storageKey = `agreementId_${passedLoginId}`;
      const dataKey = `formData_${passedLoginId}`;

      const savedId = localStorage.getItem(storageKey);
      if (savedId) {
        setAgreementId(savedId);
      } else {
        const uniqueSuffix = Math.random().toString(36).substr(2, 5).toUpperCase();
        const newId = `CP-${passedLoginId}-${uniqueSuffix}`;
        localStorage.setItem(storageKey, newId);
        setAgreementId(newId);
      }

      const savedData = localStorage.getItem(dataKey);
      if (savedData) setFormData(JSON.parse(savedData));

    }, [passedLoginId, open]);

    const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "amountUSDT") {
      if (value < 0) return; // negative value ignore
    }

    setFormData({ ...formData, [name]: value });
  };

  
const handleSubmit = (e) => {
  e.preventDefault(); 
  
  // 1. Convert string to number
  const amount = Number(formData.amountUSDT);

  // 2. Check: Empty fields
  if (!formData.fullName || !formData.amountUSDT) {
    alert("Bhai, Name aur Amount bharna zaroori hai!");
    return;
  }

  // 3. Check: Minimum Amount (Ab ye perfectly work karega)
 if (amount < 1000) {
    alert("Minimum investment of $1000.00 is required.", {
    });
    return;
  }
  // 4. Sab sahi hai? Toh data save karo aur Success Popup dikhao (YE MISSING THA)
  localStorage.setItem(`formData_${passedLoginId}`, JSON.stringify(formData));
  setShowSuccess(true); 
};
    if (!open) return null;

    return createPortal(
      <div className="agreement-overlay" style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.85)', zIndex: 9999,
        display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
        overflowY: 'auto', padding: '40px 30px'
      }}>
        
        {/* --- MAIN FORM --- */}
        {!showSuccess ? (
          <form onSubmit={handleSubmit} className="form-container" style={{ position: 'relative', width: '100%', maxWidth: '850px', margin: '0 auto' }}>
          <div className="form-container" style={{ position: 'relative', width: '100%', maxWidth: '850px', margin: '0 auto' }}>
            <button onClick={onClose} style={{
              position: 'absolute', right: '20px', top: '20px', border: 'none', 
              background: '#e74c3c', color: 'white', borderRadius: '50%', 
              width: '30px', height: '30px', cursor: 'pointer', zIndex: 100
            }}>✖</button>

            <div className="form-card" style={{ background: '#fff', borderRadius: '8px', paddingBottom: '30px' }}>
              <div className="form-header">
                <div className="logo-section">
                  <img src='/images/favicon.ico' className='logo-icon' alt="logo" />
                  <div className="logo-text">
                    <span className="brand-name">CoinPool</span>
                    <span className="brand-sub">Wealth Planner</span>
                  </div>
                </div>
                <h2 className="form-title">Customer agreement form</h2>
                <p style={{textAlign: 'center', color: '#e67e22', fontWeight: 'bold'}}>Agreement ID: {agreementId}</p>
              </div>

              <section className="form-section">
                <h3 className="section-heading">Personal information</h3>
                <div className="grid-row">
                  <div className="input-group">
                    <label>Full name</label>
                    <input type="text" name="fullName" placeholder="Full name" onChange={handleChange} value={formData.fullName} required />
                  </div>
                  <div className="input-group">
                    <label>User Login ID (Auto)</label>
                    <input type="text" value={passedLoginId} readOnly style={{ backgroundColor: '#f0f0f0' }} />
                  </div>
                </div>
                
                <div className="grid-row">
                  <div className="input-group">
                    <label>Email address</label>
                  <input type="email" name="emailID" value={formData.emailID} placeholder="Email address" onChange={handleChange} required />
                  </div>
                  <div className="input-group">
                    <label>Phone number</label>
                    <input type="text" name="phone" value={formData.phone} placeholder="Phone number" onChange={handleChange} required/>
                  </div>
                </div>
                

                  <div className="grid-row">
    {/* Date of Birth Field */}
    <div className="input-group">
      <label>Date of birth</label>
      <input 
        type="date" 
        name="dob" 
        value={formData.dob} 
        onChange={handleChange}
        required 
      />
      <span className="input-hint" style={{ fontSize: '10px', color: '#777', marginTop: '4px', display: 'block' }}>
        Format: DD-MM-YYYY
      </span>
    </div>

    {/* Mother's Maiden Name Field */}
    <div className="input-group">
      <label>Mother's maiden name</label>
      <input 
        type="text" 
        name="motherMaidenName" 
        value={formData.motherMaidenName} 
        placeholder="Mother's maiden name" 
        onChange={handleChange} 
        required
      />
    </div>
  </div>

                <div className="input-group full-width" style={{marginBottom: '15px'}}>
                  <label>Residential Address</label>
                  <input type="text" name="address" value={formData.address} placeholder="Full Address" onChange={handleChange} required/>
                </div>
              </section>

              <section className="form-section">
    <h3 className="section-heading">Investment details</h3>

    <div className="grid-row">
      
      
      <div className="input-group">
        <label>Investment amount (USDT)</label>
        <input
          type="number"
          name="amountUSDT"
          value={formData.amountUSDT}
          placeholder="Enter USDT"
          onChange={handleChange}
          required
        />
      </div>
      

      
      <div className="input-group">
        <label>Amount in INR</label>
        <input
          type="text"
          required
          value={(formData.amountUSDT * 92 || 0).toFixed(2)}
          readOnly
          style={{ backgroundColor: '#f0f0f0' }}
        />
      </div> <div
      style={{
        background: "#fff3e6",
        border: "1px dashed #f4a261",
        padding: "5px 10px",
        borderRadius: "8px",
        fontSize: "13px",
        color: "#e67e22"
      }}
    >
      Minimum investment: $1000.00
    </div>
    </div>
      <div >
      <p style={{ fontSize: "10px", fontWeight: "500", marginLeft: "20px" }}>
        Cryptocurrency wallet address or bank account number
      </p>

      <div style={{ padding: "0 15px" }}>
  <input
    type="text"
    name="wallet"
    placeholder="Enter BEP-20 wallet or bank account number"
    onChange={handleChange}
    required
    style={{
      width: "100%",
      height: "48px",
      borderRadius: "10px",
      fontSize: "12px",
      padding: "0 12px"
    }}
  />
  </div>

      <p
        style={{
          fontSize: "12px",
          color: "#6b7280",
          marginLeft: "12px",
          padding: "7px"
        }}
      >
        Ensure the wallet is BEP-20 compatible and bank details are correct.
      </p>
    </div>
  </section>

  <section
    style={{
      border: "1px solid #d1d5db",
      borderRadius: "10px",
      overflow: "hidden",
      marginTop: "25px",
      fontFamily: "sans-serif"
    }}
  >





    
    {/* Header */}
    <div
      style={{
        background: "#f3f4f6",
        padding: "12px 15px",
        fontWeight: "600",
        fontSize: "15px",
        color: "#111827"
      }}
    >
      Trading bot subscription
    </div>

    {/* Content */}
    <div
      style={{
        padding: "10px",
        fontSize: "13px",
        color: "#374151"
      }}
    >

  <div style={{ 
    display: "flex", 
    alignItems: "flex-start", // Container ko top align rakho
    gap: "10px", 
    marginBottom: "15px" 
  }}>
    <input 
      type="checkbox" 
      required
      style={{ 
        marginTop: "5px",        //
        flexShrink: 0,           
        width: "15px",           
        height: "15px", 
        cursor: "pointer",
        alignSelf: "flex-start"  // Browser agar center kar raha ho toh ye force stop karega
      }} 
    />
    <p style={{ 
      margin: 0, 
      lineHeight: "1.4",        // Line height ko thoda tight rakho alignment ke liye
      fontSize: "13px", 
      color: "#374151",
      textAlign: "left"
    }}>
      I agree to purchase the mandatory annual subscription for{" "}
      <strong style={{ color: "#111827" }}>INR 9000</strong>, payable in advance, 
      to participate in the investment program.
    </p>
  </div>

      {/* Bullet Points */}
      <ul style={{ marginTop: "12px", color: "#6b7280" }}>
        <li style={{ marginBottom: "6px" }}>
          Payment instructions will be provided upon signing the Investment
          Agreement.
        </li>
        <li>
          The subscription is non-refundable and must be renewed annually.
        </li>
      </ul>
    </div>
  </section>


  <section
    style={{
      border: "1px solid #d1d5db",
      borderRadius: "10px",
      overflow: "hidden",
      marginTop: "25px",
      fontFamily: "sans-serif",
      backgroundColor: "#fff"
    }}
  >
    {/* Header */}
    <div
      style={{
        background: "#f9fafb",
        padding: "12px 15px",
        fontWeight: "600",
        fontSize: "16px",
        color: "#111827",
        borderBottom: "1px solid #e5e7eb"
      }}
    >
      Investment terms acknowledgment
    </div>

    {/* Content Body */}
    <div style={{ padding: "20px" }}>
      
      {/* Row 1: Portfolio Return */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "20px" }}>
        <span style={{ color: "#9ca3af", fontSize: "18px", marginTop: "2px", flexShrink: 0 }}>✓</span>
        <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.5", color: "#374151" }}>
          <strong>Portfolio Return:</strong> expected annual portfolio return ranging between 72% to 84%, subject to market performance and company policy.
        </p>
      </div>

      {/* Row 2: Lock-In Period */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "20px" }}>
        <span style={{ color: "#9ca3af", fontSize: "18px", marginTop: "2px", flexShrink: 0 }}>✓</span>
        <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.5", color: "#374151" }}>
          <strong>Lock-In Period:</strong> I acknowledge that the investment has a No Lock-in Period, during which the Investment Amount can be withdrawn except as outlined below.
        </p>
      </div>

      {/* Row 3: Early Withdrawal Terms */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "20px" }}>
        <span style={{ color: "#9ca3af", fontSize: "18px", marginTop: "2px", flexShrink: 0 }}>✓</span>
        <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.5", color: "#374151" }}>
          <strong>Early Withdrawal Terms:</strong> Withdrawals between 1–11 months: 6% to 7% monthly return, subject to a 10% processing charge on the return provided.
        </p>
      </div>

      {/* Row 4: Confidentiality */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
        <span style={{ color: "#9ca3af", fontSize: "18px", marginTop: "2px", flexShrink: 0 }}>✓</span>
        <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.5", color: "#374151" }}>
          <strong>Confidentiality:</strong> I agree to keep the terms of the Investment Agreement and any proprietary information provided by MANGOFX LIMITED confidential, except as required by law.
        </p>
      </div>

    </div>
  </section>


  <section
    style={{
      border: "1px solid #d1d5db",
      borderRadius: "10px",
      overflow: "hidden",
      marginTop: "25px",
      fontFamily: "sans-serif",
      backgroundColor: "#fff"
    }}
  >
    {/* Header */}
    <div required 
      style={{
        background: "#f9fafb",
        padding: "12px 15px",
        fontWeight: "600",
        fontSize: "16px",
        color: "#111827",
        borderBottom: "1px solid #e5e7eb"
      }}
    >
      Investment Adjustment Policy
    </div>

    {/* Content Body */}
    <div style={{ padding: "20px" }}>
      
      {/* Point 1 */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "15px" }}>
        <span style={{ fontSize: "18px", lineHeight: "1", marginTop: "2px", flexShrink: 0 }}>•</span>
        <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.6", color: "#374151" }}>
          When the Investor’s total payout becomes equal to or exceeds 100% of the invested principal amount, 25% of the principal amount shall be adjusted towards returns.
        </p>
      </div>

      {/* Point 2 */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "15px" }}>
        <span style={{ fontSize: "18px", lineHeight: "1", marginTop: "2px", flexShrink: 0 }}>•</span>
        <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.6", color: "#374151" }}>
          When the Investor’s total accumulated returns reach 200% (2X) of the invested principal amount, 50% of the principal amount shall be adjusted towards returns.
        </p>
      </div>

      {/* Point 3 */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
        <span style={{ fontSize: "18px", lineHeight: "1", marginTop: "2px", flexShrink: 0 }}>•</span>
        <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.6", color: "#374151" }}>
          When the Investor’s total earnings reach 300% (3X) of the principal amount, the investment term shall be considered completed. Any further participation shall require execution of a new investment agreement.
        </p>
      </div>
    </div>
  </section>





  <section
    style={{
      border: "1px solid #d1d5db",
      borderRadius: "10px",
      overflow: "hidden",
      marginTop: "25px",
      fontFamily: "sans-serif",
      backgroundColor: "#fff"
    }}
  >
    {/* Header */}
    <div
      style={{
        background: "#f9fafb",
        padding: "12px 15px",
        fontWeight: "600",
        fontSize: "16px",
        color: "#111827",
        borderBottom: "1px solid #e5e7eb"
      }}
    >
      Consent and authorization
    </div>

    {/* Content Body */}
    <div style={{ padding: "20px" }}>
      
      {/* Point 1: Data Privacy */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "20px" }}>
        <span style={{ color: "#9ca3af", fontSize: "18px", marginTop: "2px", flexShrink: 0 }}>✓</span>
        <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.5", color: "#374151" }}>
          I consent to MANGOFX LIMITED processing my personal information (Name, Email, Phone Number, Date of Birth, Mother's Maiden Name, Address, Wallet Address and Bank Account Details) in accordance with its Privacy Policy and applicable data protection laws.
        </p>
      </div>

      {/* Point 2: DocuSign Authorization */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "20px" }}>
        <span style={{ color: "#9ca3af", fontSize: "18px", marginTop: "2px", flexShrink: 0 }}>✓</span>
        <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.5", color: "#374151" }}>
          I authorize MANGOFX LIMITED to send me the Investment Agreement via DocuSign to the email address provided, where I will fill in any additional details and apply my digital signature.
        </p>
      </div>

      {/* Point 3: Confirmation of Terms */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
        <span style={{ color: "#9ca3af", fontSize: "18px", marginTop: "2px", flexShrink: 0 }}>✓</span>
        <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.5", color: "#374151" }}>
          I confirm that I have read, understood, and agree to be bound by the terms outlined in this form and the forthcoming Investment Agreement.
        </p>
      </div>

    </div>
  </section>




  <section
    style={{
      border: "1px solid #d1d5db",
      borderRadius: "10px",
      overflow: "hidden",
      marginTop: "25px",
      fontFamily: "sans-serif",
      backgroundColor: "#fff",
      paddingBottom: "20px"
    }}
  >
    {/* Header */}
    <div
      style={{
        background: "#f9fafb",
        padding: "12px 15px",
        fontWeight: "600",
        fontSize: "16px",
        color: "#111827",
        borderBottom: "1px solid #e5e7eb",
        marginBottom: "20px"
      }} required
    >
      Signature
    </div>

    <div style={{ padding: "0 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "40px", flexWrap: "wrap" }}>
        
        {/* Left Side: Mango Wealth Planner */}
        <div style={{ flex: "1", minWidth: "250px" }}>
          <p style={{ margin: "0 0 5px", fontWeight: "bold", fontSize: "14px" }}>For MANGO WEALTH PLANNER</p>
          <p style={{ margin: "0", fontSize: "13px", color: "#374151" }}>Name: Mango Wealth Planner</p>
          <p style={{ margin: "0", fontSize: "13px", color: "#374151" }}>Title: Invest For Multi Asset Trading</p>
          <p style={{ margin: "10px 0 5px", fontSize: "13px", color: "#374151" }}>Digital Signature:</p>
          <div style={{ 
            fontFamily: "'Great Vibes', cursive", 
            fontSize: "28px", 
            color: "#1f2937",
            marginTop: "5px" 
          }}>
            Mango Wealth Planner
          </div>
        </div>

        {/* Right Side: Investor */}
        <div style={{ flex: "1", minWidth: "250px" }}>
          <p style={{ margin: "0 0 5px", fontWeight: "bold", fontSize: "14px" }}>For the Investor</p>
          
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", fontSize: "12px", marginBottom: "5px" }}>Name:</label>
            <input 
              type="text"   
              placeholder='Enter your Name'
              required
              style={{ 
                width: "100%", 
                padding: "8px 12px", 
                border: "1px solid #d1d5db", 
                borderRadius: "8px",
                fontSize: "14px"
              }} 
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", marginBottom: "5px" }}>Investor signature (digital):</label>
            <div style={{ position: "relative" }}>
              <input 
                type="text" 
                placeholder="signature"
                style={{ 
                  width: "100%", 
                  height: "80px", 
                  padding: "10px", 
                  border: "1px solid #d1d5db", 
                  borderRadius: "8px",
                  fontFamily: "'Great Vibes', cursive",
                  fontSize: "17px",
                  textAlign: "center",
                  color: "#1f2937"
                }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Date Section */}
      <div style={{ marginTop: "30px" }}>
        <p style={{ margin: "0 0 5px", fontWeight: "bold", fontSize: "14px", color: "#374151" }}>Date</p>
        <div style={{ 
          display: "inline-block",
          fontSize: "14px",
          fontWeight: "500"
        }}>
          xyz
        </div>
      </div>
    </div>
  </section>
  <hr></hr>      
  <div 
    className="button-group" 
    style={{
      display: 'flex', 
      justifyContent: 'flex-end', // Buttons ko right side move karne ke liye
      gap: '12px', 
      padding: '20px 40px 40px', // Bottom spacing thodi badha di hai
      marginTop: '5px'
    }}
  >
    {/* Print Button */}
    <button 
      type="button" 
      onClick={() => window.print()} 
      style={{
        padding: '10px 25px', 
        borderRadius: '8px', 
        border: 'none', 
        background: '#f1f5f9', // Light grey background
        color: '#1e293b', 
        fontWeight: '600', 
        fontSize: '14px',
        cursor: 'pointer',
        letterSpacing: '0.5px',
        transition: 'background 0.2s'
      }}
      onMouseOver={(e) => e.target.style.background = '#e2e8f0'}
      onMouseOut={(e) => e.target.style.background = '#f1f5f9'}
    >
      PRINT
    </button>

    {/* Submit Button */}
    <button 
      type="submit" 
      className="btn-orange" 
      // onSubmit={handleSubmit} 
      style={{
        padding: '10px 40px', 
        borderRadius: '8px', 
        border: 'none', 
        background: '#ffab00', 
        color: '#000', 
        fontWeight: '700', 
        fontSize: '14px',
        cursor: 'pointer',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        letterSpacing: '0.5px',
        transition: 'transform 0.1s'
      }}
      onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
      onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
    >
      SUBMIT
    </button>
  </div>
            </div>  
          </div>
          </form>
        ) : (
            /* --- PREMIUM SUCCESS TRIGGER POPUP --- */
          <div style={{
            background: '#fff', padding: '20px', borderRadius: '24px', textAlign: 'center',
            maxWidth: '400px', width: '100%', marginTop: '80px', position: 'relative',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
            animation: 'fadeIn 0.4s ease-out'
          }}>
            {/* Top-Right Close Icon */}
            <button onClick={onClose} style={{
              position: 'absolute', right: '15px', top: '15px', border: 'none', 
              background: '#f1f5f9', color: '#64748b', borderRadius: '50%', 
              width: '30px', height: '30px', cursor: 'pointer', fontSize: '18px'
            }}>✖</button>

            <div style={{ 
              width: '80px', height: '80px', background: '#dcfce7', color: '#22c55e', 
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '40px', margin: '0 auto 20px'
            }}>✓</div>
            
            <h2 style={{ margin: '0 0 5px', color: '#0f172a', fontSize: '26px' }}>Submission Success!</h2>
            <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '10px' }}>Your agreement has been officially recorded in our system.</p>
            
            <div style={{ 
              background: '#f8fafc', padding: '15px', borderRadius: '16px', 
              margin: '25px 0', textAlign: 'left', border: '1px solid #e2e8f0' 
            }}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px dashed #cbd5e1', paddingBottom: '8px'}}>
                  <span style={{color: '#64748b', fontSize: '14px'}}>Investor Name</span>
                  <span style={{fontWeight: '700', color: '#1e293b'}}>{formData.fullName}</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px dashed #cbd5e1', paddingBottom: '8px'}}>
                  <span style={{color: '#64748b', fontSize: '14px'}}>Login ID</span>
                  <span style={{fontWeight: '700', color: '#1e293b'}}>{passedLoginId}</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px dashed #cbd5e1', paddingBottom: '8px'}}>
                  <span style={{color: '#64748b', fontSize: '14px'}}>Invest Amount</span>
                  <span style={{fontWeight: '700', color: '#16a34a'}}>${formData.amountUSDT}</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span style={{color: '#64748b', fontSize: '14px'}}>Agreement ID</span>
                  <span style={{fontWeight: '700', color: '#ea580c'}}>{agreementId}</span>
              </div>
            </div>
          </div>
        )}


      </div>,
      document.body
    );
  };

  export default AgreementForm;