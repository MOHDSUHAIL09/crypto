import React, { useState } from 'react';
import { IoSend } from 'react-icons/io5';
import { FaCreditCard, FaRegCopy } from 'react-icons/fa';
import toast from 'react-hot-toast';
import './CapitalPayout.css';

const WalletWithdrawal = () => {
  // Withdraw modal states
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawOtp, setWithdrawOtp] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('BANK CARD');

  // Get values from localStorage (same as Cards component)
  const accountNumber = localStorage.getItem('accountNumber') || 'No card added';
  const bep20Wallet = localStorage.getItem('bep20Wallet') || 'No address added';

  const handleWithdraw = () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (!withdrawOtp || withdrawOtp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }
    // TODO: API call here
    console.log('Withdrawing:', {
      amount: withdrawAmount,
      otp: withdrawOtp,
      method: selectedMethod,
    });

    toast.success(`Withdrawal request for ₹${withdrawAmount} submitted successfully!`);

    // Reset form
    setWithdrawAmount('');
    setWithdrawOtp('');
  };

  return (
    <div className="p-4">
      <div className="modal-content">
        {/* Header */}
        <div className="modal-header">
          <h4>Capital Withdrawal Request</h4>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Available Balance */}
          <div className="balance-info">
            <span>Available balance</span>
            <strong>$0.05</strong>
          </div>

          <div className="meddle">
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
                <div className="bank-card-display d-flex justify-content-between align-items-center">
                  <div className="card-number">{accountNumber}</div>
                  <FaRegCopy
                    className="copy-icon"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      navigator.clipboard.writeText(accountNumber);
                      toast.success('Bank card number copied!');
                    }}
                  />
                </div>
              </div>
            )}

            {/* USDT TRC20 Details */}
            {selectedMethod === 'USDT TRC20' && (
              <div className="method-details">
                <div className="bank-card-display d-flex justify-content-between align-items-center">
                  <div className="address-value">{bep20Wallet}</div>
                  <FaRegCopy
                    className="copy-icon"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      navigator.clipboard.writeText(bep20Wallet);
                      toast.success('USDT address copied!');
                    }}
                  />
                </div>
              </div>
            )}

            {/* Amount Area */}
            <div className="amount-area mb-3">
              {/* <div className="amount-label">Enter Amount</div> */}
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

            {/* Quick Amount Buttons */}
            <div className="quick-amounts">
              {[100, 300, 500, 1000, 10000, 50000].map((amt) => (
                <button
                  key={amt}
                  className={`quick-amount-btn ${parseFloat(withdrawAmount) === amt ? 'active' : ''}`}
                  onClick={() => setWithdrawAmount(amt.toString())}
                >
                  ₹{amt.toLocaleString()}
                </button>
              ))}
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
  );
};

export default WalletWithdrawal;