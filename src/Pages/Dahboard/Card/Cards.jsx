import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { GiProfit } from "react-icons/gi";
import { FaCreditCard, FaMintbit, FaRegCopy } from "react-icons/fa6";
import { MdAddCard } from "react-icons/md";
import toast from "react-hot-toast";
import Stake from "./Stake";
import { useUser } from "../../../context/UserContext";
import apiClient from '../../../api/apiClient';
import '../../../assets/dashboardcss/css/Dashboard.css';
import { IoSend } from 'react-icons/io5';

const Cards = () => {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);


  // Withdraw modal states
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawOtp, setWithdrawOtp] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('BANK CARD');
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpIntervalId, setOtpIntervalId] = useState(null);
  const [usdToInrRate, setUsdToInrRate] = useState(null);
  const [setFetchingRate] = useState(false);
  const [setRateError] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");


  // Payout input amount state
  const [payoutAmount, setPayoutAmount] = useState('');

  // Context data
  const { userData, stakeData, loading, refreshData } = useUser();

  // Helper to get loginid
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
  const regno = userData?.regno || userData?.Regno || localStorage.getItem('regno');

  const [isActivationVisible, setIsActivationVisible] = useState(false);
  const [isCovered, setIsCovered] = useState(false);
  const handleToggle = () => setIsCovered(!isCovered);

  const copyReferral = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Sponser ID Copied!");
  };
  // Fetch live USD/INR rate
  const fetchUsdToInrRate = async () => {
    setFetchingRate(true);
    setRateError(null);
    try {
      const response = await fetch('https://api.budjet.org/fiat/USD/INR');
      const data = await response.json();
      const rate = data.conversion_result || data.rate;
      if (rate && typeof rate === 'number') {
        setUsdToInrRate(rate);
      } else {
        throw new Error('Invalid rate format');
      }
    } catch (err) {
      console.error('Rate fetch error:', err);
      setRateError('Unable to fetch live conversion rate');
      toast.error('Could not fetch live rate. Please try again later.');
    } finally {
      setFetchingRate(false);
    }
  };



  useEffect(() => {
    const DateString = userData?.topupdate;
    


    const targetDate = new Date(DateString);
    targetDate.setDate(targetDate.getDate() + 365);
    targetDate.setHours(0, 0, 0, 0); 

    const updateCountdown = () => {
      const now = new Date().getTime();
      const targetTime = targetDate.getTime();
      const timeDiff = targetTime - now;


      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
      const seconds = Math.floor((timeDiff / 1000) % 60);

      setTimeLeft(`Remaining Days: ${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [userData?.topupdate]);






  // Fetch rate when modal opens
  useEffect(() => {
    if (showWithdrawModal) {
      fetchUsdToInrRate();
    }
  }, [showWithdrawModal]);

  // Handle Payout Button Click
  const handlePayoutClick = () => {
    if (payoutAmount && parseFloat(payoutAmount) > 0) {
      setWithdrawAmount(payoutAmount);
    }
    setShowWithdrawModal(true);
  };

  // Send OTP
  const sendOtp = async () => {
    if (!regno) {
      toast.error('Registration number not found');
      return;
    }
    setSendingOtp(true);
    try {
      const response = await apiClient.post(`/User/genrate-otp?loginid=${loginid}&regno=${regno}`, {});
      if (response.data.success || response.data.status === 'success') {
        toast.success('OTP sent successfully!');
        setOtpSent(true);
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
        toast.error(response.data.message || 'Failed to send OTP');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error sending OTP');
    } finally {
      setSendingOtp(false);
    }
  };

  // Withdraw function
  const handleWithdraw = async () => {
    const amountNum = parseFloat(withdrawAmount);
    if (!withdrawAmount || isNaN(amountNum) || amountNum <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (amountNum < 20) {
      toast.error('Minimum withdrawal amount is $20.00');
      return;
    }
    if (amountNum > (userData?.Remaining || 0)) {
      toast.error(`Amount exceeds available balance $${userData?.Remaining?.toFixed(2)}`);
      return;
    }
    if (!withdrawOtp || withdrawOtp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }
    if (!otpSent) {
      toast.error('Please request OTP first');
      return;
    }

    let walletAddress = '';
    let payMode = '';
    let liveRate = 0;

    if (selectedMethod === 'BANK CARD') {
      const card = localStorage.getItem('accountNumber');
      if (!card) {
        toast.error('No bank card added. Please add a card first.');
        return;
      }
      walletAddress = card;
      payMode = 'inr';
      liveRate = usdToInrRate || 0;
    } else if (selectedMethod === 'USDT TRC20') {
      const address = localStorage.getItem('bep20Wallet');
      if (!address) {
        toast.error('No USDT TRC20 address added. Please add an address first.');
        return;
      }
      walletAddress = address;
      payMode = 'usdt';
      if (!usdToInrRate) {
        toast.error('Live conversion rate not available. Please try again.');
        return;
      }
      liveRate = usdToInrRate;
    } else {
      toast.error('Invalid payment method');
      return;
    }

    setVerifyingOtp(true);
    try {
      const verifyRes = await apiClient.post('/User/verify-otp', null, {
        params: {
          loginid: loginid,
          regno: regno,
          otp: String(withdrawOtp)
        }
      });
      if (!verifyRes.data?.success) {
        toast.error(verifyRes.data?.message || 'Invalid OTP');
        setVerifyingOtp(false);
        return;
      }

      const payload = {
        regNo: parseInt(regno),
        amount: amountNum,
        liveRate: liveRate,
        payMode: payMode,
        walletAddress: walletAddress
      };
      console.log('Withdrawal payload:', payload);
      const withdrawalRes = await apiClient.post('/IncomePayout/withdraw-request', payload);

      if (withdrawalRes.data?.success) {
        toast.success(`Withdrawal request for $${amountNum.toFixed(2)} submitted successfully!`);
        refreshData();
        setShowWithdrawModal(false);
        setWithdrawAmount('');
        setWithdrawOtp('');
        setPayoutAmount('');
        setOtpSent(false);
        setOtpTimer(0);
        if (otpIntervalId) clearInterval(otpIntervalId);
        setOtpIntervalId(null);
      } else {
        toast.error(withdrawalRes.data?.message || 'Withdrawal failed');
      }
    } catch (err) {
      console.error('Withdrawal error:', err.response?.data || err);
      toast.error(err.response?.data?.message || 'Server error. Please try again.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <div className="row p-3">
        {/* 1. User Info Card */}
        <div className="col-lg-5 col-md-9">
          <div className="card1 no-animate custom-card1 p-0 rounded_5">
            <div className="card1-body px-3 py-3">
              <div className="top-box mb-2">
                <div className='d-flex justify-content-between p-2'>
                  <label className={`insurance-switch ${isCovered ? 'active' : ''}`}>
                    <input type="checkbox" checked={isCovered} onChange={handleToggle} hidden />
                    <div className="switch-slider">
                      <div className="switch-knob"></div>
                      <span className="switch-text">Insurance Covered</span>
                    </div>
                  </label>
                  <h6 className='mt-1'>Rank : <span className="cus-badge green-badge">{userData?.rank || 0}</span></h6>
                </div>
              </div>

              <div className="c-box">
                <div className="d-flex align-items-center justify-content-between w-100">
                  <p className="mb-0"><strong>Name:</strong>&nbsp; {userData?.name || "N/A"}</p>
                  <div className="mb-2">
                    {userData?.kid > 0 ? (
                      <span className="status-badge">Active 🟢</span>
                    ) : (
                      <span className="status-badge2">Inactive 🔴</span>
                    )}
                  </div>
                </div>
                <div className= ' timer d-flex   justify-content-between'>
                  <div className=''>
                    <p className="mb-1"><strong>Me:</strong>&nbsp; {userData?.me || "N/A"}</p>
                    <p className="mb-1">
                      <strong>Sponsor: &nbsp; {userData?.referral || "No Sponsor"}
                        <FaRegCopy style={{ cursor: 'pointer', marginLeft: '5px' }} onClick={() => copyReferral(userData?.referral)} />
                      </strong>
                    </p>
                  </div>

                  {timeLeft && (
                    <div className="countdown-timer mb-2" style={{
                      fontSize: "13px",
                      background: "linear-gradient(to right, var(--primary-clr), var(--secondary-clr))",
                      padding: "8px 12px",
                      borderRadius: "12px",
                      textAlign: "center",
                      fontWeight: "500",
                      color: "#ffffff"
                    }}>
                       {timeLeft}
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Stake Card with Countdown Timer */}
        <div className="col-lg-4 col-md-5">
          <div className="card1 no-animate custom-card1 p-0 rounded_5">
            <div className="card1-body px-3 py-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <h5 className='mb-0 fw-bold'>Subscription / Invest</h5>
                <div className='mint-box'><FaMintbit /></div>
              </div>


              <div className="c-box py_1">
                <Stake
                  walletBalance={stakeData?.walletBalance || 0}
                  onSuccess={refreshData}
                  onActivationChange={(visible) => setIsActivationVisible(visible)}
                />
                {!isActivationVisible && (
                  <div className="animate__animated animate__fadeIn">
                    <div className="d-flex flex-wrap justify-content-between">
                      <Link to="/dashboard/depositHistory">
                        <p className="mb-1">
                          <strong title='Deposit History'>Deposit Fund : </strong><span className='Investment-text'>
                            ${userData?.Depositfund || 0}
                          </span>
                        </p>
                      </Link>
                      <div className='fundbtn'>
                   <button type="button" title='fund-deposit' className="wallet-buttton b"><MdAddCard size={20} /></button>
                    </div></div>

                    <div className='investment-wrapper d-flex gap-0 gap-md-4 flex-wrap '>
                      <Link to="/dashboard/investmenthistory">
                        <p className="mb-0">
                          <strong title='Subscription History'>Subscription : </strong>
                          <span  className='Investment-text'>
                            ${(userData?.BotAmount || 0).toLocaleString("en-IN")}
                          </span>
                        </p>
                      </Link>
                      <Link to="/dashboard/investmenthistory">
                        <p className="mb-0 ms-0 md:ms-4">
                          <strong title='Investment History'>Investment : </strong>
                          <span className='Investment-text'>
                            ${(userData?.InvestAmount || 0).toLocaleString("en-IN")}
                          </span>
                        </p>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Payout Card */}
        <div className="col-lg-3 col-md-12">
          <div className="card1 no-animate custom-card1 p-0 rounded_5">
            <div className="card1-body px-3 py-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className='mb-0 fw-bold'>Payout</h5>              
                <div className='mint-box' ><GiProfit /></div>
              </div>
              <div className="c-box gap-3 py_3">
                <div className="payout-input-box">
                  <input
                    type="number"
                    className="custom-pay-form form-control mb-2"
                    placeholder='Enter Amount'
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                  />
                  <div className="d-flex align-items-center justify-content-between">
                    <Link to= "/dashboard/WithdrawalHistory">
                    <h6 className='hover-text small-text mb-1' title='WithdrawalHistory'>
                      Payout Amt : <span className="pay-badge pay-bg"><strong>${parseFloat(userData?.Remaining || 0).toFixed(2)}</strong></span>
                    </h6>
                    </Link>
                    <button
                      type="button"
                      className="wallet-buttton"
                      onClick={handlePayoutClick}
                    >
                      Payout
                    </button>
                  </div>

                  <div className='d-flex align-items-center gap-2'>
                    <span style={{ color: "green", fontWeight: "bold" }}>Note :</span>
                    <p style={{ margin: 0, color: "#666", fontSize: "13px" }}> Min Withdrawal $ 20.00</p>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="modal-overlay">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4>Withdraw</h4>
              <button
                className="modal-close"
                onClick={() => {
                  setShowWithdrawModal(false);
                  setWithdrawAmount('');
                  setWithdrawOtp('');
                  setOtpSent(false);
                  setOtpTimer(0);
                  if (otpIntervalId) clearInterval(otpIntervalId);
                  setOtpIntervalId(null);
                }}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="balance-info">
                <span>Available balance</span>
                <strong>${parseFloat(userData?.Remaining || 0).toFixed(2)}</strong>
              </div>

              <div className='meddle'>
                {/* Methods Grid */}
                <div className="methods-grid mt-3">
                  <div
                    className={`method-chip ${selectedMethod === 'BANK CARD' ? 'active' : ''}`}
                    onClick={() => setSelectedMethod('BANK CARD')}
                  >
                    <FaCreditCard />
                    <span>BANK CARD</span>
                  </div>
                  <div
                    className={`method-chip ${selectedMethod === 'USDT TRC20' ? 'active' : ''}`}
                    onClick={() => setSelectedMethod('USDT TRC20')}
                  >
                    <span>₿</span>
                    <span>USDT TRC20</span>
                  </div>
                </div>

                {/* BANK CARD Details */}
                {selectedMethod === 'BANK CARD' && (
                  <div className="method-details">
                    <div className="bank-card-display d-flex justify-content-between">
                      <div className="card-number">
                        {localStorage.getItem("accountNumber") || "No card added"}
                      </div>
                      <FaRegCopy
                        className='copy-icon'
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          navigator.clipboard.writeText(localStorage.getItem("accountNumber") || "No card added");
                          toast.success("Bank card number copied!");
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* USDT TRC20 Details */}
                {selectedMethod === 'USDT TRC20' && (
                  <div className="method-details">
                    <div className="bank-card-display d-flex justify-content-between">
                      <div className="address-value">
                        {localStorage.getItem("bep20Wallet") || "No address added"}
                      </div>
                      <FaRegCopy
                        className='copy-icon'
                        style={{ cursor: 'pointer', marginLeft: '5px' }}
                        onClick={() => {
                          navigator.clipboard.writeText(localStorage.getItem("bep20Wallet") || "No address added");
                          toast.success("USDT address copied!");
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Amount Area */}
                <div className="amount-area mb-3">
                  <div className="amount-label">Enter Amount</div>
                  <div className="amount-input-wrapper">
                    <span className="currency-symbol">$</span>
                    <input
                      type="number"
                      className="amount-input"
                      placeholder="Enter amount"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                    />
                  </div>
                </div>

                {/* OTP Input */}
                <div className="input-container01 mt-3">
                  <span className="currency-symbol1">OTP</span>
                  <span className="divider">|</span>
                  <input
                    type="text"
                    className="amount-input"
                    placeholder="Enter 6-digit OTP"
                    maxLength="6"
                    value={withdrawOtp}
                    onChange={(e) => setWithdrawOtp(e.target.value.replace(/\D/g, ''))}
                  />
                  <button
                    className="clear-btn"
                    onClick={sendOtp}
                    disabled={otpTimer > 0 || sendingOtp}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    {otpTimer > 0 ? (
                      `${Math.floor(otpTimer / 60)}:${(otpTimer % 60).toString().padStart(2, '0')}`
                    ) : (
                      <IoSend />
                    )}
                  </button>
                </div>
                {!otpSent && <small className="text-muted">Click the send icon to get OTP</small>}
                {otpSent && <small className="text-success">OTP sent! Enter the code above and click Withdraw Now.</small>}

                {/* Withdraw Button */}
                <button
                  className="modal-button mt-3"
                  onClick={handleWithdraw}
                  disabled={verifyingOtp || !otpSent || !withdrawAmount || parseFloat(withdrawAmount) <= 0 || (selectedMethod === 'USDT TRC20' && !usdToInrRate)}
                >
                  {verifyingOtp ? 'Verifying...' : 'Withdraw Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cards;