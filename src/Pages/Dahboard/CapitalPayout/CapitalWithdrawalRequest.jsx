import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { IoSend } from 'react-icons/io5';
import { FaCreditCard, FaRegCopy } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useUser } from '../../../context/UserContext';
import apiClient from '../../../api/apiClient';
import CustomTable from '../CustomTable/CustomTable';
import './CapitalPayout.css';

const WalletWithdrawal = () => {
  const [searchParams] = useSearchParams();
  const rid = searchParams.get('Capital');

  const { userData, loading: userLoading } = useUser();

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

  // Get regno
  const regno =
    userData?.regno ||
    userData?.Regno ||
    JSON.parse(localStorage.getItem('user'))?.Regno ||
    JSON.parse(localStorage.getItem('user'))?.regno ||
    localStorage.getItem('regno');

  // State
  const [capitalRecord, setCapitalRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('BANK CARD');
  const [submitting, setSubmitting] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpIntervalId, setOtpIntervalId] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successAmount, setSuccessAmount] = useState(0); // ✅ ADD THIS

  // Saved addresses
  const accountNumber = localStorage.getItem('accountNumber') || '';
  const bep20Wallet = localStorage.getItem('bep20Wallet') || '';

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (otpIntervalId) clearInterval(otpIntervalId);
    };
  }, [otpIntervalId]);

  // Fetch capital record
  useEffect(() => {
    if (!regno || !rid) {
      if (!regno && !userLoading) toast.error('User registration number not found');
      if (!rid) toast.error('No capital record specified');
      return;
    }

    const fetchRecord = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get(`/IncomePayout/capital-withdrawal-report/${rid}`);
        if (res.data?.success && res.data?.response?.data?.length > 0) {
          const item = res.data.response.data[0];
          setCapitalRecord({
            id: item.Rid,
            investmentDate: item.Rdate ? new Date(item.Rdate).toLocaleDateString('en-GB') : '-',
            amount: item.Rkprice || 0,
            profit: item.Rpayid || 0,
            withdrawal: 0,
            remainingCapital: item.payout || 0,
            remainingDays: item.Remainingdays ?? '-',
            withdrawalChargePercent: item.PayoutCharge || 10,
          });
        } else {
          toast.error('Capital record not found');
        }
      } catch (err) {
        console.error(err);
        toast.error('Error fetching capital data');
      } finally {
        setLoading(false);
      }
    };
    fetchRecord();
  }, [regno, rid, userLoading]);

  // Send OTP
  const sendOtp = async () => {
    if (!regno) {
      toast.error('Registration number not found. Please login again.');
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

  // Verify OTP and withdraw
  const verifyOtpAndWithdraw = async () => {
    const amountNum = parseFloat(withdrawAmount);
    if (!withdrawAmount || isNaN(amountNum) || amountNum <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (!capitalRecord || amountNum > capitalRecord.remainingCapital) {
      toast.error(`Amount cannot exceed available balance $${capitalRecord?.remainingCapital.toFixed(2)}`);
      return;
    }
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    // Map payment method to API expected pay_mode
    let wallet_address = '';
    let pay_mode = '';
    if (selectedMethod === 'BANK CARD') {
      if (!accountNumber) {
        toast.error('No bank card added. Please add a card first.');
        return;
      }
      wallet_address = accountNumber;
      pay_mode = 'inr';
    } else if (selectedMethod === 'USDT TRC20') {
      if (!bep20Wallet) {
        toast.error('No USDT TRC20 address added. Please add an address first.');
        return;
      }
      wallet_address = bep20Wallet;
      pay_mode = 'usdt';
    } else {
      toast.error('Invalid payment method');
      return;
    }

    setVerifyingOtp(true);
    try {
      // OTP verification as QUERY PARAMETERS
      const verifyRes = await apiClient.post('/User/verify-otp', null, {
        params: {
          loginid: loginid,
          regno: regno,
          otp: String(otp)
        }
      });

      if (!verifyRes.data?.success) {
        toast.error(verifyRes.data?.message || 'Invalid OTP');
        setVerifyingOtp(false);
        return;
      }

      // Proceed with withdrawal
      setSubmitting(true);
      const payload = {
        regno: parseInt(regno),
        amount: amountNum,
        wallet_address: wallet_address,
        pay_mode: pay_mode,
        rid: parseInt(rid),
      };

      console.log('Withdrawal payload:', payload);
      const withdrawalRes = await apiClient.post('/IncomePayout/capital-payout-withdrawal', payload);

      if (withdrawalRes.data?.success) {
        // ✅ Store the withdrawn amount and show modal
        setSuccessAmount(amountNum);
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 3000);

        // Update local state
        setCapitalRecord(prev => ({ ...prev, remainingCapital: prev.remainingCapital - amountNum }));
        setWithdrawAmount('');
        setOtp('');
        setOtpSent(false);
        setOtpTimer(0);
        if (otpIntervalId) clearInterval(otpIntervalId);
        setOtpIntervalId(null);
      } else {
        toast.error(withdrawalRes.data?.message || 'Withdrawal failed. Please try again.');
      }
    } catch (err) {
      console.error('Withdrawal error:', err.response?.data || err);
      toast.error(err.response?.data?.message || 'Server error. Please try again later.');
    } finally {
      setVerifyingOtp(false);
      setSubmitting(false);
    }
  };

  const quickAmounts = [100, 300, 500, 1000, 5000, 10000];
  const validQuickAmounts = capitalRecord
    ? quickAmounts.filter(amt => amt <= capitalRecord.remainingCapital)
    : [];

  const columns = [
    'Investment Date',
    'Invested Amount',
    'Profit',
    'Withdrawal',
    'Withdrawal Charge %',
    'Remaining Days'
  ];

  const tableRow = capitalRecord && (
    <tr>
      <td className="text-center">{capitalRecord.investmentDate}</td>
      <td className="text-center amount-cell">${capitalRecord.amount.toFixed(2)}</td>
      <td className="text-center profit-cell">${capitalRecord.profit.toFixed(2)}</td>
      <td className="text-center">${capitalRecord.withdrawal.toFixed(2)}</td>
      <td className="text-center">{capitalRecord.withdrawalChargePercent}%</td>
      <td className="text-center">{capitalRecord.remainingDays}</td>
    </tr>
  );

  if (loading) {
    return (
      <div className="ww-page p-4">
        <CustomTable columns={columns} loading={true} loaderText="Loading capital details..." />
      </div>
    );
  }

  if (!capitalRecord) {
    return (
      <div className="ww-page p-4 text-center">
        <p className="text-danger">No capital record found or invalid request.</p>
      </div>
    );
  }

  return (
    <div className="downline-main-wrapper ww-page p-4 mb-5">
      <div className="ww-modal">
        <div className="ww-header modal-header">
          <h4>Capital Withdrawal Request</h4>
        </div>

        <div className="ww-body">
          <CustomTable columns={columns} loading={false}>
            {tableRow}
          </CustomTable>

          <div className='ww-modal-contant'>
            <div className="ww-content meddle01">
              <div className="ww-balance balance-info mt-3">
                <span>Available balance (Remaining Capital)</span>
                <strong>${capitalRecord.remainingCapital.toFixed(2)}</strong>
              </div>

              {/* Payment Methods */}
              <div className="ww-methods methods-grid mt-3">
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

              {/* Method Details */}
              {selectedMethod === 'BANK CARD' && (
                <div className="ww-method-detail method-details">
                  <div className="bank-card-display d-flex justify-content-between align-items-center">
                    <div className="card-number">{accountNumber || 'No card added'}</div>
                    {accountNumber && (
                      <FaRegCopy
                        className="copy-icon"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          navigator.clipboard.writeText(accountNumber);
                          toast.success('Bank card number copied!');
                        }}
                      />
                    )}
                  </div>
                </div>
              )}

              {selectedMethod === 'USDT TRC20' && (
                <div className="ww-method-detail method-details">
                  <div className="bank-card-display d-flex justify-content-between align-items-center">
                    <div className="address-value">{bep20Wallet || 'No address added'}</div>
                    {bep20Wallet && (
                      <FaRegCopy
                        className="copy-icon"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          navigator.clipboard.writeText(bep20Wallet);
                          toast.success('USDT address copied!');
                        }}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Amount Input */}
              <div className="ww-amount-area amount-area mb-3">
                <div className="amount-input-wrapper">
                  <span className="currency-symbol">$</span>
                  <input
                    type="number"
                    className="amount-input"
                    placeholder="Enter amount"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    disabled={submitting || verifyingOtp}
                  />
                </div>
              </div>

              {/* Quick Amount Buttons */}
              {validQuickAmounts.length > 0 && (
                <div className="ww-quick-amounts quick-amounts">
                  {validQuickAmounts.map((amt) => (
                    <button
                      key={amt}
                      className={`quick-amount-btn ${parseFloat(withdrawAmount) === amt ? 'active' : ''}`}
                      onClick={() => setWithdrawAmount(amt.toString())}
                      disabled={submitting || verifyingOtp}
                    >
                      ${amt.toLocaleString()}
                    </button>
                  ))}
                </div>
              )}

              {/* OTP Section */}
              <div className="ww-otp-wrapper input-container01 mt-3">
                <span className="currency-symbol1">OTP</span>
                <span className="divider">|</span>
                <input
                  type="text"
                  className="amount-input"
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  disabled={submitting || verifyingOtp}
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
              {!otpSent && (
                <small className="text-muted">Click the send icon to get OTP</small>
              )}
              {otpSent && (
                <small className="text-success">OTP sent! Enter the code above and click Withdraw Now.</small>
              )}

              {/* Withdraw Button */}
              <button
                className="ww-button modal-button mt-3"
                onClick={verifyOtpAndWithdraw}
                disabled={submitting || verifyingOtp || !otpSent || capitalRecord.remainingCapital <= 0}
              >
                {verifyingOtp ? 'Verifying OTP...' : submitting ? 'Processing...' : 'Withdraw Now'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Centered Success Modal (now with successAmount) */}
      {showSuccessModal && (
        <div className="success-modal-overlay">
          <div className="success-modal">
            <div className="checkmark-circle">
              <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="success-title">Withdrawal Request Submitted</div>
            <div className="success-amount">${successAmount.toFixed(2)}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletWithdrawal;