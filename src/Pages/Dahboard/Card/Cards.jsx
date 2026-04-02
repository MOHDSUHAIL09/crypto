import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import { GiProfit } from "react-icons/gi";
import { FaCreditCard, FaMintbit, FaRegCopy } from "react-icons/fa6";
import { MdAddCard } from "react-icons/md";
import toast from "react-hot-toast";
import Stake from "./Stake";
import { useUser } from "../../../context/UserContext";
import '../../../assets/dashboardcss/css/Dashboard.css';
import { IoSend } from 'react-icons/io5';

const Cards = () => {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  // Withdraw modal states
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawOtp, setWithdrawOtp] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('BANK CARD');

  // Payout input amount state
  const [payoutAmount, setPayoutAmount] = useState('');

  // Context se data nikaal lo
  const { userData, stakeData, payoutData, loading, refreshData } = useUser();

  const [isActivationVisible, setIsActivationVisible] = useState(false);
  const [isCovered, setIsCovered] = useState(false);

  const handleToggle = () => setIsCovered(!isCovered);

  const copyReferral = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Sponser ID Copied!");
  };

  // Dynamic copy function for bank card - user ke data se
  const copyBankCard = () => {
    const bankCardNumber = userData?.bankCardNumber || userData?.card_number || "No card added";
    navigator.clipboard.writeText(bankCardNumber);
    toast.success("Bank card number copied!");
  };

  // Dynamic copy function for USDT address - user ke data se
  const copyUsdtAddress = () => {
    const usdtAddress = userData?.usdtAddress || userData?.wallet_address || "No address added";
    navigator.clipboard.writeText(usdtAddress);
    toast.success("USDT address copied!");
  };

  // Handle Payout Button Click - Amount pre-fill karega
  const handlePayoutClick = () => {
    if (payoutAmount && parseFloat(payoutAmount) > 0) {
      setWithdrawAmount(payoutAmount);
    }
    setShowWithdrawModal(true);
  };

  // Withdraw function
  const handleWithdraw = () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (!withdrawOtp || withdrawOtp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    // Yahan API call karo
    console.log('Withdrawing:', {
      amount: withdrawAmount,
      otp: withdrawOtp,
      method: selectedMethod
    });

    toast.success(`Withdrawal request for ₹${withdrawAmount} submitted successfully!`);

    // Reset and close
    setWithdrawAmount('');
    setWithdrawOtp('');
    setPayoutAmount('');
    setShowWithdrawModal(false);
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
                <div className='d-flex justify-content-between pt-2'>
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
                <p className="mb-1"><strong>Me:</strong>&nbsp; {userData?.me || "N/A"}</p>
                <p className="mb-1">
                  <strong>Sponsor: &nbsp; {userData?.referral || "No Sponsor"}
                    <FaRegCopy style={{ cursor: 'pointer', marginLeft: '5px' }} onClick={() => copyReferral(userData?.referral)} />
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Stake Card */}
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
                      <p className="mb-1">
                        <strong>Deposit Fund : </strong><span className='Investment-text'>
                          ${userData?.Depositfund || 0}
                        </span>
                      </p>
                      <button type="button" className="wallet-buttton b"><MdAddCard size={20} /></button>
                    </div>

                    <div className='investment-wrapper d-flex gap-3'>
                      <Link to="/dashboard/investmenthistory">
                        <p className="mb-0">
                          <strong>Subscription : </strong>
                          <span className='Investment-text'>
                            ${(userData?.BotAmount || 0).toLocaleString("en-IN")}
                          </span>
                        </p>
                      </Link>
                      <Link to="/dashboard/investmenthistory">
                        <p className="mb-0">
                          <strong>Investment : </strong>
                          <span className='Investment-text'>
                            ${(userData?.InvestAmount || 0).toLocaleString("en-IN")}
                          </span>
                        </p></Link>
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
                <div className='mint-box'><GiProfit /></div>
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
                    <h6 className='hover-text small-text mb-1'>
                      Payout Amt : <span className="pay-badge pay-bg"><strong>{payoutData?.WorkingWallet || 0}</strong></span>
                    </h6>
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

      {/* payout modal */}
      {showWithdrawModal && (
        <div className="modal-overlay">
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="modal-header">
              <h4>Withdraw</h4>
              <button
                className="modal-close"
                onClick={() => {
                  setShowWithdrawModal(false);
                  setWithdrawAmount('');
                  setWithdrawOtp('');
                }}
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="modal-body">
              {/* Available Balance */}
              <div className="balance-info">
                <span>Available balance</span>
                <strong>$0.05</strong>
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
                        {localStorage.getItem("accountNumber") || "No card added"}  {/* 🔥 Bas itna */}
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
                        {localStorage.getItem("bep20Wallet") || "No address added"}  {/* 🔥 Bas itna */}
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
                    <span className="currency-symbol">₹</span>
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
                  <IoSend />
                </div>

                {/* Withdraw Button */}
                <button className="modal-button mt-3" onClick={handleWithdraw}>
                  Withdraw Now
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