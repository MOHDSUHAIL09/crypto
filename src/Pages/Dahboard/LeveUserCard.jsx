import React, { useState } from "react";
import {
  FaWallet,
  FaCopy,
  FaInstagram,
  FaFacebookF,
  FaWhatsapp,
  FaTelegramPlane,
} from "react-icons/fa";
import { useUser } from "../../context/UserContext";
import { MdAccountBalance } from "react-icons/md";

const ProUserCard = () => {
  const { userData } = useUser();
  const [copied, setCopied] = useState(false);

  const referralLink = "https://yourapp.com/ref/abc";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pro-card" >
      {/* TOP BAR */}
      <div className="top-bar">
        <div className="user-left">
          <div>
            <span className="role">Pro Member</span>
          </div>
        </div>

       
         <div className='mint-box'><MdAccountBalance/></div>
      </div>

      {/* WALLET */}
      <div className="wallet-strip">
        < FaWallet className="mt-2" />
        <div>
          <span>Total Wallet Balance</span>
          <h2>$ {userData?.Depositfund || 0}</h2>
        </div>
      </div>

      {/* REFERRAL + SHARE */}
      <div className="bottom-section">

        <div className="referral-box">
          <label className="refer-link">Referral Link</label>
          <div className="referral-input">
            <input value={referralLink} readOnly />
            <button onClick={handleCopy}>
              {copied ? "Copied" : <FaCopy />}
            </button>
          </div>
        </div>

        <div className="share-box">
          <p>Share with others</p>
          <div className="social-icons">
            <span className="ig"><FaInstagram /></span>
            <span className="fb"><FaFacebookF /></span>
            <span className="wa"><FaWhatsapp /></span>
            <span className="tg"><FaTelegramPlane /></span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProUserCard;
