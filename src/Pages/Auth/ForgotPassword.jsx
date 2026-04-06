import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import toast from "react-hot-toast";
import apiClient from "../../api/apiClient";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [loginId, setLoginId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();

  const trimmedId = loginId.trim();
  if (!trimmedId) {
    toast.error("Please enter your Login ID / Email");
    return;
  }

  setLoading(true);
  try {
    // 🔥 FIX: Send raw string, NOT JSON object
    const response = await apiClient.post("/Authentication/forget-password", trimmedId, {
    });

    // Handle response (adjust based on actual structure)
    const responseData = response.data || response;
    
    if (responseData.result === "true" || responseData.success === true) {
      toast.success(responseData.message || "Password recovery instructions sent");
      navigate("/login");
    } else {
      // Extract error message from array
      const errorMsg = Array.isArray(responseData.message)
        ? responseData.message[0]
        : responseData.message || "Request failed";
      toast.error(errorMsg);
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    if (error.response?.data?.message) {
      const msg = Array.isArray(error.response.data.message)
        ? error.response.data.message[0]
        : error.response.data.message;
      toast.error(msg);
    } else {
      toast.error("Server error. Please try again.");
    }
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="fp-wrapper">
      <div className="fp-container">
        <div className="fp-card">
          <h2 className="fp-title">Forgot Password</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter Login ID"
              className="fp-input"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              required
            />

            <button type="submit" className="fp-btn" disabled={loading}>
              {loading ? "Sending..." : "Recover Password"}
            </button>
          </form>

          <p className="fp-back" onClick={() => navigate("/login")}>
            Back to Signin?
          </p>
        </div>

        <div className="fp-image-section">
          <img
            src="https://mangowealthplanner.com/img/hero-img.png"
            alt="illustration"
          />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;