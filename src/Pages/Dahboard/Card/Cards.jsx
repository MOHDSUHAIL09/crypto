import React, { useState } from 'react';
import { GiProfit } from "react-icons/gi";
import { FaMintbit, FaRegCopy } from "react-icons/fa6";
import { MdAddCard } from "react-icons/md";
import toast from "react-hot-toast";
import Stake from "./Stake";
import { useUser } from "../../../context/UserContext"; // Path sahi kar lena
import '../../../assets/dashboardcss/css/Dashboard.css';

const Cards = () => {
  // Context se data nikaal lo
  const { userData, stakeData, payoutData, loading, refreshData } = useUser();
  
  const [isActivationVisible, setIsActivationVisible] = useState(false);
  const [isCovered, setIsCovered] = useState(false);

  const handleToggle = () => setIsCovered(!isCovered);

  const copyReferral = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Sponser ID Copied!");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="row  p-3">
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
                    <span className="status-badge">Active</span>
                  ) : (
                    <span className="status-badge2">Inactive</span>
                  )}
                </div>
              </div>
              <p className="mb-1"><strong>Me:</strong>&nbsp; {userData?.me || "N/A"}</p>
              <p className="mb-1">
                <strong>Sponsor: &nbsp; {userData?.referral || "No Sponsor"} 
                  <FaRegCopy style={{cursor: 'pointer', marginLeft: '5px'}} onClick={() => copyReferral(userData?.referral)} />
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
            <div className="c-box    py_1">
              <Stake 
                walletBalance={stakeData?.walletBalance || 0} 
                onSuccess={refreshData} // Context refresh hoga
                onActivationChange={(visible) => setIsActivationVisible(visible)}
              />
              {!isActivationVisible && (
                <div className="animate__animated animate__fadeIn">
                  <div className="d-flex flex-wrap justify-content-between ">
                    <p className="mb-1">
                       <strong>Deposit Fund : </strong><span  style={{ color: "#16a34a", fontWeight: "700", fontSize: "16px" }}>
                        ${userData?.Depositfund || 0}
                      </span>
                    </p>
                    <button type="button" className="wallet-buttton b"><MdAddCard size={20}/></button>
                  </div>
                  <p className="mb-0">
                    <strong>Investment : </strong>{" "}
                    <span
                      style={{
                        color: "#16a34a",
                        fontWeight: "700",
                        fontSize: "16px"
                      }}
                    >
                      ${(userData?.InvestAmount || 0).toLocaleString("en-IN")}
                    </span>
                  </p>
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
                <input type="number" className="custom-pay-form form-control mb-2" placeholder='Enter Amount' />
                <div className="d-flex align-items-center justify-content-between">
                  <h6 className='small-text mb-1'>
                    Payout Amt: <span className="pay-badge pay-bg"><strong>{payoutData?.WorkingWallet || 0}</strong></span>
                  </h6>
                  <button type="button" className="wallet-buttton">Payout</button>
                </div>
                <p className='payout-text mb-0'>
                  Note: Min <span className='text_clr'>{payoutData?.min || 0}</span> & Max 5000
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cards;