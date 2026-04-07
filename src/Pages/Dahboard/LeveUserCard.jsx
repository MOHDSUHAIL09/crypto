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

  const referralLink = "https://mohdsuhail.netlify.app";

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
      
      {/* Instagram (copy link fallback) */}
      <span
        className="ig"
        onClick={() => {
          navigator.clipboard.writeText(referralLink);
          alert("Link copied! Share on Instagram");
        }}
      >
        <FaInstagram />
      </span>

      {/* Facebook */}
      <span
        className="fb"
        onClick={() =>
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
            "_blank"
          )
        }
      >
        <FaFacebookF />
      </span>

      {/* WhatsApp */}
      <span
        className="wa"
        onClick={() =>
          window.open(
            `https://wa.me/?text=${encodeURIComponent(
              "Join using my referral link: " + referralLink
            )}`,
            "_blank"
          )
        }
      >
        <FaWhatsapp />
      </span>

      {/* Telegram */}
      <span
        className="tg"
        onClick={() =>
          window.open(
            `https://t.me/share/url?url=${encodeURIComponent(
              referralLink
            )}&text=${encodeURIComponent("Join using my referral link")}`,
            "_blank"
          )
        }
      >
        <FaTelegramPlane />
      </span>

    </div>
  </div>

</div>
    </div>
  );
};

export default ProUserCard;
