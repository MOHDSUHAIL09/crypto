import React, { useEffect, useState } from "react";
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

  const baseUrl = "https://invest.mangowealthplanner.com/";
  const referralLink = userData?.me
    ? `${baseUrl}signup?ref=${userData.me}`
    : baseUrl;

  // Copy referral link to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

// Add this useEffect inside the Signup component, after the existing state declarations
// Add this new useEffect inside the Signup component, after the existing handleChange function
useEffect(() => {
  // Get the 'ref' parameter from the current URL
  const params = new URLSearchParams(window.location.search);
  const refCode = params.get("ref");

  // If a referral code exists and the sponsor ID field is empty, auto-fill it
  if (refCode && !FormData.referrer_Id) {
    setFormData(prev => ({
      ...prev,
      referrer_Id: refCode,
      introRegNo: refCode // Also set the introRegNo field if needed
    }));
  }
}, []); // This effect runs only once when the component first loads
  return (
    <div className="pro-card">
      {/* ========== TOP BAR ========== */}
      <div className="top-bar">
        <div className="user-left">
          <div>
            <span className="role">Pro Member</span>
          </div>
        </div>
        <div className="mint-box">
          <MdAccountBalance />
        </div>
      </div>

      {/* ========== WALLET SECTION ========== */}
      <div className="wallet-strip">
        <FaWallet className="mt-2" />
        <div>
          <span>Total Wallet Balance</span>
          <div className="card-Balance">$ {userData?.Depositfund || 0}</div>
        </div>
      </div>

      {/* ========== REFERRAL + SHARE SECTION ========== */}
      <div className="bottom-section">
        {/* Referral link box */}
        <div className="referral-box">
          <label className="refer-link">Referral Link</label>
          <div className="referral-input">
            <input value={referralLink} readOnly />
            <button onClick={handleCopy}>
              {copied ? "Copied" : <FaCopy />}
            </button>
          </div>
        </div>

        {/* Social share box */}
        <div className="share-box">
          <p>Share with others</p>
          <div className="social-icons">
            <span
              className="ig"
              onClick={() => {
                navigator.clipboard.writeText(referralLink);
                alert("Link copied! Share on Instagram");
              }}
            >
              <FaInstagram />
            </span>

            {/* Facebook - opens share dialog */}
            <span
              className="fb"
              onClick={() =>
                window.open(
                  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    referralLink
                  )}`,
                  "_blank"
                )
              }
            >
              <FaFacebookF />
            </span>

            {/* WhatsApp - opens WhatsApp with prefilled message */}
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

            {/* Telegram - share URL dialog */}
            <span
              className="tg"
              onClick={() =>
                window.open(
                  `https://t.me/share/url?url=${encodeURIComponent(
                    referralLink
                  )}&text=${encodeURIComponent(
                    "Join using my referral link"
                  )}`,
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