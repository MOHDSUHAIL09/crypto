import React, { useState } from 'react';
import './CapitalPayout.css';

const CapitalWithdrawalRequest = () => {
    const [formData, setFormData] = useState({
        selectedAmount: 0,
        paymentMode: '',
        otp: '',
        withdrawalPercentage: 0
    });

    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);

    // Sample data - replace with actual API data
    const investmentData = {
        investmentDate: "17/12/2025",
        investedAmount: 1000.00,
        profit: 87.10,
        withdrawal: 0.00,
        withdrawalCharge: 10,
        remainingDays: "00",
        investmentBalance: 1000
    };

    const paymentModes = ['INR','USDC'];

    // Calculate percentage based on amount
    const calculatePercentage = (amount) => {
        return (amount / investmentData.investmentBalance) * 100;
    };

    // Handle amount change via range slider
    const handleAmountChange = (e) => {
        const amount = parseInt(e.target.value);
        const percentage = calculatePercentage(amount);
        setFormData({
            ...formData,
            selectedAmount: amount,
            withdrawalPercentage: percentage
        });
    };


    const handleSendOtp = async () => {
        if (!formData.selectedAmount || !formData.paymentMode) {
            alert('Please select amount and payment mode first');
            return;
        }

        setLoading(true);
        try {
            setTimeout(() => {
                setOtpSent(true);
                alert('OTP sent successfully!');
                setLoading(false);
            }, 1000);
        } catch (error) {
            console.error('Error sending OTP:', error);
            alert('Failed to send OTP');
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!formData.selectedAmount) {
            alert('Please select withdrawal amount');
            return;
        }
        if (!formData.paymentMode) {
            alert('Please select payment mode');
            return;
        }
        if (!formData.otp) {
            alert('Please enter OTP');
            return;
        }

        setLoading(true);
        try {
            setTimeout(() => {
                alert('Withdrawal request submitted successfully!');
                setLoading(false);
                setFormData({ selectedAmount: 0, paymentMode: '', otp: '', withdrawalPercentage: 0 });
                setOtpSent(false);
            }, 1000);
        } catch (error) {
            console.error('Error submitting withdrawal:', error);
            alert('Failed to submit withdrawal request');
            setLoading(false);
        }
    };




    return (
        <div className="withdrawal-container mb-5">
            <div className="withdrawal-card">
                <h2 className="withdrawal-title">Capital Withdrawal Request</h2>

                {/* Investment Details Table */}
                {/* <div className="table-responsive">
                    <table className="investment-table">
                        <thead>
                            <tr>
                                <th>Investment Date</th>
                                <th>Invested Amount</th>
                                <th>Profit</th>
                                <th>Withdrawal</th>
                                <th>Withdrawal Charge %</th>
                                <th>Remaining Days</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{investmentData.investmentDate}</td>
                                <td className="amount-cell">${investmentData.investedAmount.toFixed(2)}</td>
                                <td className="profit-cell">${investmentData.profit.toFixed(2)}</td>
                                <td>${investmentData.withdrawal.toFixed(2)}</td>
                                <td>{investmentData.withdrawalCharge}%</td>
                                <td>{investmentData.remainingDays}</td>
                            </tr>
                        </tbody>
                    </table>
                </div> */}

                {/* Balance Information */}
                <div className="balance-row">
                    <div className="balance-info">
                        <span className="balance-label">Investment Balance:</span>
                        <span className="balance-amount">${investmentData.investmentBalance}</span>
                    </div>
                    <div className="balance-info">
                        <span className="balance-label">Withdraw Balance:</span>
                        <span className="balance-amount withdraw-amount">${investmentData.investmentBalance}</span>
                    </div>
                </div>

                {/* Withdrawal Amount Selection - Range Slider */}
                <div className="amount-section">
                    <div className="amount-header">
                        <span className="amount-label">Select Amount:</span>
                        <span className="amount-value">${formData.selectedAmount || 0}</span>
                    </div>

                    {/* Amount Range Slider */}
                    <div className="slider-range">
                        <input
                            type="range"
                            min="0"
                            max={investmentData.investmentBalance}
                            step="10"
                            value={formData.selectedAmount}
                            onChange={handleAmountChange}
                            className="amount-slider"
                        />
                    </div>

                </div>

                {/* Warning Message */}

                <span className="warning-icon">⚠️</span>
                <span className="warning-text ">Warning: 10% will be deducted from amount.<br />You can take Capital Payout only once in a year. You can take Capital Payout only once in a year.
                </span>


                {/* Payment Mode Selection */}
                <div className="payment-section mt-4">
                    <label className="payment-label">Select Mode</label>
                    <select
                        className="payment-select"
                        value={formData.paymentMode}
                        onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                    >
                        <option value="">-- Select Mode --</option>
                        {paymentModes.map(mode => (
                            <option key={mode} value={mode}>{mode}</option>
                        ))}
                    </select>
                </div>

                {/* OTP Section */}
                <div className="otp-section">
                    <label className="otp-label">Enter OTP:</label>
                    <div className="otp-row">
                        <input
                            type="text"
                            className="otp-input"
                            placeholder="Enter OTP"
                            value={formData.otp}
                            onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                            disabled={!otpSent}
                        />
                        <button
                            className="send-otp-btn"
                            onClick={handleSendOtp}
                            disabled={loading || otpSent}
                        >
                            {loading ? 'Sending...' : otpSent ? 'OTP Sent' : 'CLICK HERE TO SEND OTP'}
                        </button>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="action-buttons">
                    <button
                        className="submit-btn"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'SUBMIT'}
                    </button>
                    <button
                        className="cancel-btn"
                        
                        disabled={loading}
                    >
                        CANCEL
                    </button>
                </div>

                {/* Note */}
                <div className="note-section">
                    <p className="note-text">
                        <strong>Note:</strong> If the overall investment amount falls below $100,
                        both IB income and level income must stop immediately
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CapitalWithdrawalRequest;