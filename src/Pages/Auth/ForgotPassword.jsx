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

    if (!loginId.trim()) {
      toast.error("Please enter Login ID");
      return;
    }

    try {
      setLoading(true);

      // ✅ FIX: await lagao
      const response = await apiClient(
        "/Authentication/forget-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginId.trim()),
        }
      );

      // ✅ response already parsed hai (apiClient se)
      console.log("API Response:", response);

      // ✅ SUCCESS
      if (response.success) {
        toast.success(response.message || "Password sent successfully");
        navigate("/login");
      } else {
        const errorMessage = Array.isArray(response.message)
          ? response.message[0]
          : response.message;
        toast.error(errorMessage || "Something went wrong");
      }

    } catch (error) {
      console.error(error);
      toast.error("Server error");
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