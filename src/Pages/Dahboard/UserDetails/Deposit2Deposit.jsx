import React, { useState, useEffect } from "react";
import { RiP2pFill } from "react-icons/ri";
import { FaHistory } from "react-icons/fa";
import { IoSend, IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../context/UserContext";
import apiClient from "../../../api/apiClient";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./UserDetails.css";

export const Deposit2Deposit = () => {
  const { userData, investNow } = useUser();
  const navigate = useNavigate();

  // ---------- Helper: get loginid & regno ----------
  const getLoginId = () => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        const parsed = JSON.parse(storedUserData);
        if (parsed.loginid) return parsed.loginid;
        if (parsed.me) return parsed.me;
      } catch (e) { }
    }
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.loginid) return user.loginid;
    if (user?.me) return user.me;
    return 'india';
  };

  const loginid = getLoginId();
  const regno = Number(
    JSON.parse(localStorage.getItem('user'))?.Regno ||
    JSON.parse(localStorage.getItem('user'))?.regno ||
    localStorage.getItem('regno')
  );

  // ---------- State ----------
  const [amount1, setAmount1] = useState(100);
  const [investUserId1, setInvestUserId1] = useState("");
  const [setCheckingUser1] = useState(false);
  const [validUser1, setValidUser1] = useState(false);
  const [setUserName1] = useState("");
  const [loading1, setLoading1] = useState(false);
  const [amount2, setAmount2] = useState(100);
  const [otp, setOtp] = useState("");
  const [loading2, setLoading2] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpIntervalId, setOtpIntervalId] = useState(null);
  const depositOptions = [100, 300, 500, 1000, 10000, 50000];
  const isLoading = !userData;

  const formatBalance = (amount) => {
    if (amount === undefined || amount === null) return "$0.00";
    const num = Number(amount);
    if (isNaN(num)) return "$0.00";
    return `$${num.toFixed(2)}`;
  };

  // ---------- P2P user check ----------
  const checkUser1 = async (id) => {
    if (!id.trim()) return;
    setCheckingUser1(true);
    try {
      const res = await apiClient(
        `/User/check-user?loginid=${id}`
      );
      const data = await res.json();
      const name = data?.data?.Name || data?.data?.name || "";
      if (data?.success && data.data) {
        setValidUser1(true);
        setUserName1(name);
        toast.success(`User found: ${name}`);
      } else {
        setValidUser1(false);
        setUserName1("");
        toast.error("User ID not found");
      }
    } catch (err) {
      console.error("Error checking user:", err);
      setValidUser1(false);
      setUserName1("");
      toast.error("Error checking user");
    } finally {
      setCheckingUser1(false);
    }
  };

  // ---------- P2P Transfer ----------
  const handleInvest1 = async () => {
    if (!amount1 || !investUserId1) {
      toast.error("Please enter User ID and Amount");
      return;
    }
    if (amount1 > userData.Depositfund) {
      toast.error("Insufficient Deposit Wallet balance");
      return;
    }
    setLoading1(true);
    try {
      const res = await investNow(investUserId1, amount1);
      toast.success(res.message);
      if (res.success) {
        setAmount1(100);
        setInvestUserId1("");
        setUserName1("");
        setValidUser1(false);
      }
    } catch (err) {
      console.error("Transfer error:", err);
      toast.error("Error processing transfer");
    } finally {
      setLoading1(false);
    }
  };

  // ---------- SEND OTP using real API ----------
  const sendOtp = async () => {
    if (!regno) {
      toast.error("Registration number not found. Please login again.");
      return;
    }
    try {
      const response = await apiClient.post(`/User/genrate-otp?loginid=${loginid}&regno=${regno}`, {});
      if (response.data.success || response.data.status === 'success') {
        toast.success("OTP sent successfully!");
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
      } else {
        toast.error(response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("OTP send error:", error);
      const msg = error.response?.data?.message || "Network error";
      toast.error(msg);
    }
  };

  // ---------- SELF TRANSFER with OTP verification ----------
  const handleInvest2 = async () => {
    if (!amount2) {
      toast.error("Enter amount");
      return;
    }
    if (amount2 > userData.totalWallet) {
      toast.error("Insufficient Income Wallet balance");
      return;
    }
    if (!otp) {
      toast.error("Enter OTP");
      return;
    }

    setLoading2(true);
    try {
      // Verify OTP using /User/verify-otp (query params)
      const verifyResponse = await apiClient.post('/User/verify-otp', null, {
        params: { loginid, regno, otp }
      });

      if (!verifyResponse.data.success) {
        toast.error(verifyResponse.data.message || "Invalid OTP");
        return;
      }

      // Proceed with transfer
      const res = await investNow(userData.me, amount2);
      toast.success(res.message);

      if (res.success) {
        setAmount2(100);
        setOtp("");
        setOtpTimer(0);
        if (otpIntervalId) clearInterval(otpIntervalId);
        setOtpIntervalId(null);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error processing transfer");
    } finally {
      setLoading2(false);
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (otpIntervalId) clearInterval(otpIntervalId);
    };
  }, [otpIntervalId]);

  // ---------- Render ----------
  return (
    <>
      <ToastContainer />
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
                  <FaHistory
                    size={22}
                    style={{ cursor: "pointer", color: "#333" }}
                    onClick={() =>
                      navigate("/dashboard/depositHistory", {
                        state: { type: "SELF", tab: "income" }
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
                      <input
                        type="text"
                        value={userData.me}
                        readOnly
                        style={{ color: "#4f4949", cursor: "not-allowed" }}
                      />
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
                    <input
                      type="number"
                      className="amount-input"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                    <button className="clear-btn" onClick={sendOtp} disabled={otpTimer > 0}>
                      {otpTimer > 0
                        ? `${Math.floor(otpTimer / 60)}:${(otpTimer % 60)
                          .toString()
                          .padStart(2, "0")}`
                        : <IoSend />}
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
                  <FaHistory
                    size={22}
                    style={{ cursor: "pointer", color: "#333" }}
                    onClick={() =>
                      navigate("/dashboard/depositHistory", {
                        state: { type: "P2P", tab: "deposit" }
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
                  <span className="value" style={{ fontWeight: "800" }}>
                    {formatBalance(userData.Depositfund)}
                  </span>
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
                      <button
                        key={opt}
                        className={`opt-button ${amount1 === opt ? "active" : ""}`}
                        onClick={() => setAmount1(opt)}
                      >
                        $ {opt}
                      </button>
                    ))}
                  </div>

                  <div className="input-container">
                    <span className="currency-symbol">$</span>
                    <span className="divider">|</span>
                    <input
                      type="number"
                      className="amount-input"
                      value={amount1}
                      onChange={(e) => setAmount1(Number(e.target.value))}
                    />
                    <button className="clear-btn" onClick={() => setAmount1(0)}>
                      <IoClose />
                    </button>
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
    </>
  );
};