import React, { useState, useEffect } from "react";
import { RiP2pFill } from "react-icons/ri";
import { FaHistory } from "react-icons/fa";
import { IoSend, IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../context/UserContext";
import "./UserDetails.css";

export const Deposit2Deposit = () => {
  const { userData, investNow } = useUser();
  const navigate = useNavigate();

  // ------------------- HOOKS -------------------
  const [amount1, setAmount1] = useState(100);
  const [investUserId1, setInvestUserId1] = useState("");
  const [checkingUser1, setCheckingUser1] = useState(false);
  const [validUser1, setValidUser1] = useState(false);
  const [userName1, setUserName1] = useState("");
  const [loading1, setLoading1] = useState(false);
  const [amount2, setAmount2] = useState(100);
  const [otp, setOtp] = useState("");
  const [loading2, setLoading2] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpIntervalId, setOtpIntervalId] = useState(null);
  const depositOptions = [100, 300, 500, 1000, 10000, 50000];
  const isLoading = !userData;

  // ================= FORMAT BALANCE =================
  const formatBalance = (amount) => {
    if (amount === undefined || amount === null) return "$0.00";
    const num = Number(amount);
    if (isNaN(num)) return "$0.00";
    return `$${num.toFixed(2)}`;
  };

  // ------------------- P2P USER CHECK -------------------
  const checkUser1 = async (id) => {
    if (!id.trim()) return;
    setCheckingUser1(true);
    try {
      const res = await fetch(
        `https://api.mangowealthplanner.com/api/User/check-user?loginid=${id}`
      );
      const data = await res.json();
      const name = data?.data?.Name || data?.data?.name || "";
      if (data?.success && data.data) {
        setValidUser1(true);
        setUserName1(name);
      } else {
        setValidUser1(false);
        setUserName1("");
      }
    } catch (err) {
      console.error("Error checking user:", err);
      setValidUser1(false);
      setUserName1("");
    } finally {
      setCheckingUser1(false);
    }
  };

  // ------------------- P2P TRANSFER -------------------
  const handleInvest1 = async () => {
    if (!amount1 || !investUserId1) {
      alert("Please enter User ID and Amount");
      return;
    }

    if (amount1 > userData.Depositfund) {
      alert("Insufficient Deposit Wallet balance");
      return;
    }

    setLoading1(true);
    try {
      const res = await investNow(investUserId1, amount1);
      alert(res.message);
      if (res.success) {
        setAmount1(100);
        setInvestUserId1("");
        setUserName1("");
        setValidUser1(false);
      }
    } catch (err) {
      console.error("Transfer error:", err);
      alert("Error processing transfer");
    } finally {
      setLoading1(false);
    }
  };

  // ------------------- SELF TRANSFER -------------------
  const handleInvest2 = async () => {
    if (!amount2) return alert("Enter amount");
    if (amount2 > userData.totalWallet) return alert("Insufficient Income Wallet balance");
    if (!otp) return alert("Enter OTP");

    setLoading2(true);
    try {
      const verify = await fetch("http://localhost:5000/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      }).then((r) => r.json());

      if (!verify.success) {
        alert("Invalid OTP");
        return;
      }

      const res = await investNow(userData.me, amount2);
      alert(res.message);

      if (res.success) {
        setAmount2(100);
        setOtp("");
      }
    } catch (err) {
      console.error(err);
      alert("Error processing transfer");
    } finally {
      setLoading2(false);
    }
  };

  // ------------------- SEND OTP -------------------
  const sendOtp = async () => {
    const email = userData?.email || "";
    if (!email) return alert("User email not found");

    try {
      const res = await fetch("http://localhost:5000/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }).then((r) => r.json());

      alert(res.message);

      if (res.success) {
        setOtpTimer(300);
        const interval = setInterval(() => {
          setOtpTimer((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              setOtpIntervalId(null);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        setOtpIntervalId(interval);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to send OTP");
    }
  };

  // ------------------- CLEANUP -------------------
  useEffect(() => {
    return () => {
      if (otpIntervalId) clearInterval(otpIntervalId);
    };
  }, [otpIntervalId]);

  // ------------------- RENDER -------------------
  return (
    <div className="mb-5">
      {isLoading ? (
        <div className="loading">Loading Wallet...</div>
      ) : (
       <div className="deposit-col d-flex flex-lg-nowrap flex-wrap justify-content-between align-items-start p-1">
          {/* SELF TRANSFER CARD */}
          <div className="deposit-card">
            <div className="d-flex justify-content-between align-items-center">
              <div className="deposit-title">
                <RiP2pFill size={22} />
                <h2>Income Wallet To Deposit Wallet</h2>
              </div>
              <div className="d-flex gap-2">
                {/* History Button for Self Transfer - Opens Income Tab */}
                <FaHistory
                  size={22}
                  style={{ cursor: "pointer", color: "#333" }}
                  onClick={() =>
                    navigate("/dashboard/depositHistory", {
                      state: {
                        type: "SELF",
                        tab: "income"  // Opens Income Wallet History tab
                      }
                    })
                  }
                  onMouseOver={(e) => (e.target.style.color = "#f909f9")}
                  onMouseOut={(e) => (e.target.style.color = "#333")}
                  title="View Self Transfer History"
                />
              </div>
            </div>

            <div className="summary-section">
              <div className="summary-row main">
                <span className="label-box">Income Wallet</span>
                <span className="value">{formatBalance(userData.totalWallet)}</span>
              </div>

              <div className="deposit2deposit-color">
                <div className="summary-row">
                  <span className="label-light" style={{ fontWeight: "bold" }}>SELF TRANSFER</span>
                  <div className="input-container1">
                    <span className="currency-symbol">$</span>
                    <span className="divider">|</span>
                    <input
                      type="number"
                      className="amount-input"
                      value={amount2}
                      onChange={(e) => setAmount2(Number(e.target.value))}
                    />
                    <button className="clear-btn" onClick={() => setAmount2(0)}>
                      <IoClose />
                    </button>
                  </div>
                </div>

                <div className="summary-row">
                  <span className="label-light" style={{ fontWeight: "bold" }}>USER ID</span>
                  <div className="input-container1">
                    <input type="text" value={userData.me} readOnly style={{ color: "#4f4949", cursor: "not-allowed" }} />
                  </div>
                </div>

                <div className="options-grid">
                  {depositOptions.map((opt) => (
                    <button
                      key={opt}
                      className={`opt-button ${amount2 === opt ? "active" : ""}`}
                      onClick={() => setAmount2(opt)}
                    >
                      $ {opt}
                    </button>
                  ))}
                </div>

                <div className="input-container">
                  <span className="currency-symbol1">ENTER OTP</span>
                  <span className="divider">|</span>
                  <input type="number" className="amount-input" value={otp} onChange={(e) => setOtp(e.target.value)} />
                  <button className="clear-btn" onClick={sendOtp} disabled={otpTimer > 0}>
                    {otpTimer > 0 ? `${Math.floor(otpTimer / 60)}:${(otpTimer % 60).toString().padStart(2, "0")}` : <IoSend />}
                  </button>
                </div>

                <button className="deposit-btn" onClick={handleInvest2} disabled={loading2}>
                  {loading2 ? "Processing..." : "Transfer"}
                </button>
              </div>
            </div>
          </div>

          {/* P2P TRANSFER CARD */}
          <div className="deposit-card">
            <div className="d-flex justify-content-between align-items-center">
              <div className="deposit-title">
                <RiP2pFill size={22} />
                <h2>Deposit To Deposit</h2>
              </div>
              <div className="d-flex gap-2">
                {/* History Button for P2P Transfer - Opens Deposit Tab */}
                <FaHistory
                  size={22}
                  style={{ cursor: "pointer", color: "#333" }}
                  onClick={() =>
                    navigate("/dashboard/depositHistory", {
                      state: {
                        type: "P2P",
                        tab: "deposit"  // Opens Deposit Wallet History tab
                      }
                    })
                  }
                  onMouseOver={(e) => (e.target.style.color = "#f909f9")}
                  onMouseOut={(e) => (e.target.style.color = "#333")}
                  title="View P2P Transfer History"
                />
              </div>
            </div>

            <div className="summary-section">
              <div className="summary-row main">
                <span className="label-box">Wallet Balance</span>
                <span className="value" style={{ fontWeight: "800" }}>{formatBalance(userData.Depositfund)}</span>
              </div>

              <div className="deposit2deposit-color">
                <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
                  <span className="label-light" style={{ fontWeight: "bold" }}>P2P AMOUNT</span>
                  <input
                    type="range"
                    className="slider"
                    min="0"
                    max={userData.Depositfund}
                    step="1"
                    value={amount1}
                    onChange={(e) => setAmount1(Number(e.target.value))}
                    style={{ width: "60%", margin: "0 10px" }}
                  />
                  <span className="value-light">{formatBalance(amount1)}</span>
                </div>

                <div className="summary-row">
                  <span className="label-light" style={{ fontWeight: "bold" }}>USER ID</span>
                  <div className="input-container1">
                    <input
                      type="text"
                      value={investUserId1}
                      onChange={(e) => setInvestUserId1(e.target.value)}
                      onBlur={() => checkUser1(investUserId1)}
                      placeholder="Enter User ID"
                    />
                    
                  </div>
                </div>



                <div className="options-grid">
                  {depositOptions.map((opt) => (
                    <button key={opt} className={`opt-button ${amount1 === opt ? "active" : ""}`} onClick={() => setAmount1(opt)}>
                      $ {opt}
                    </button>
                  ))}
                </div>

                <div className="input-container">
                  <span className="currency-symbol">$</span>
                  <span className="divider">|</span>
                  <input type="number" className="amount-input" value={amount1} onChange={(e) => setAmount1(Number(e.target.value))} />
                  <button className="clear-btn" onClick={() => setAmount1(0)}><IoClose /></button>
                </div>

                <button className="deposit-btn" onClick={handleInvest1} disabled={!validUser1 || loading1}>
                  {loading1 ? "Processing..." : "Deposit"}
                </button>
              </div>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
};