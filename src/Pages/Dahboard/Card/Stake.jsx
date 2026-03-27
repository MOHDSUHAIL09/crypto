import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import AgreementForm from "./InvestmentForm/AgreementForm";
import apiClient from "../../../api/apiClient";

const Stake = () => {
  const [openAgreement, setOpenAgreement] = useState(false);
  const [loginId, setLoginId] = useState("");
  const [isBotActive, setIsBotActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const [isValidUser, setIsValidUser] = useState(false);
  const [userName, setUserName] = useState("");

  // 🔥 Correct API Integration with Authorization & Subscription
  const checkUserBotStatus = async (id) => {
    if (!id.trim()) return;
    setLoading(true);
    setHasChecked(false);

    try {
      // 1. LocalStorage se token uthao (JWT fix for 401)
      const token = localStorage.getItem("token");

      const res = await apiClient.get(
        `/User/check-user-bot-status?loginid=${id}`,
        {
          headers: {
            // Agar backend 'Bearer' prefix mangta hai:
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 2. Tumhare bataye huye Parameters match kar rahe hain
      // res.data.data = { name: "...", BotStatus: 0/1, ... }
      if (res.data?.success && res.data.data) {
        setIsValidUser(true);
        setUserName(res.data.data.name);

        // BotStatus: 0 = Inactive, 1 = Active
        const activeStatus = res.data.data.BotStatus > 0;
        setIsBotActive(activeStatus);
      } else {
        setIsValidUser(false);
        setIsBotActive(false);
        setUserName("");
      }
    } catch (error) {
      console.error("Subscription Status Check Error:", error);

      // 401 Unauthorized handle karna
      if (error.response?.status === 401) {
        toast.error("Session Expired! Please login again.");
      }

      setIsValidUser(false);
      setUserName("");
    } finally {
      setLoading(false);
      setHasChecked(true);
    }
  };

  useEffect(() => {
    if (loginId.trim() === "") {
      setIsBotActive(false);
      setHasChecked(false);
      setIsValidUser(false);
      setUserName("");
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      checkUserBotStatus(loginId);
    }, 800);
    return () => clearTimeout(delayDebounceFn);
  }, [loginId]);

  const handleButtonClick = () => {
    if (!loginId.trim()) {
      toast.error("Please enter User Login ID");
      return;
    }

    if (!isValidUser && hasChecked) {
      toast.error("User ID database is does not access!");
      return;
    }

    if (isBotActive) {
      setOpenAgreement(true);
    } else {
      // Subscription Toast for Inactive Users (BotStatus: 0)
      toast((t) => (
        <div style={{ minWidth: '300px' }}>
          <div className="d-flex align-items-center gap-2 mb-2">
            <span style={{ fontSize: '18px' }}>🛡️</span>
            <h6 className="mb-0" style={{ fontWeight: '700' }}>Activate Subscription</h6>
          </div>
          <p style={{ fontSize: '13px', margin: '12px 0', color: '#4b5563' }}>
            A deduction of <strong style={{ color: '#ef4444' }}>$100.00</strong> will be made for <br />
            <span style={{ color: '#6366f1', fontWeight: 'bold' }}>{userName}'s Account Activation</span>.
          </p>
          <div className="d-flex gap-2 mt-3">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                // Call activate API here in future
                toast.success("Subscribed Successfully!");
                setIsBotActive(true);
              }}
              className="btn btn-primary btn-sm w-100"
              style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', border: 'none' }}
            >
              Yes, Activate
            </button>
            <button onClick={() => toast.dismiss(t.id)} className="btn btn-light btn-sm w-100">
              Cancel
            </button>
          </div>
        </div>
      ), { id: 'confirm-activation', duration: 8000, position: 'top-center' });
    }
  };

  return (
    <>
      <div className="stake-card d-flex gap-3 align-items-center" style={{ marginBottom: '35px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input type="text"
            className="custom-pay-form form-control "
            placeholder='Enter Login ID (e.g. M903154)'
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
          />

          {loading && (
            <small style={{ position: 'absolute', bottom: '-22px', left: '5px', color: '#e67e22', fontSize: '11px' }}>
              Checking database...
            </small>
          )}

         {!loading && hasChecked && isValidUser && (
            <small style={{
              position: 'absolute',
              bottom: '-22px',
              left: '5px',
              fontSize: '11px',
              color: isBotActive ? '#27ae60' : '#f39c12',
              fontWeight: '600',
              whiteSpace: 'nowrap'  // ← Text ek line me rahega
            }}>
              {isBotActive
                ? `✓ Verified: ${userName} (Subs Active)`
                : `✓ Found: ${userName} (Subscription Needed)`}
            </small>
          )}

          {!loading && hasChecked && !isValidUser && (
            <small style={{
              position: 'absolute',
              bottom: '-22px',
              left: '5px',
              color: '#e74c3c',
              fontSize: '11px',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',        // ← Text ek line me rahega
              background: 'transparent'     // Background transparent
            }}>
              ✖ Invalid Login ID or User not found.
            </small>
          )}
        </div>

        <button
          type="button"
          className="wallet-buttton"
          disabled={loading}
          style={{
            backgroundColor: !isValidUser && hasChecked ? '#95a5a6' : (isBotActive ? '#27ae60' : '#6366f1'),
            color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px',
            minWidth: '130px', cursor: 'pointer', transition: '0.3s'
          }}
          onClick={handleButtonClick}
        >
          {isBotActive ? "Investment" : "Subscription"}
        </button>
      </div>
      <AgreementForm
        open={openAgreement}
        loginId={loginId}
        onClose={() => setOpenAgreement(false)}
      />
    </>
  );
};

export default Stake;