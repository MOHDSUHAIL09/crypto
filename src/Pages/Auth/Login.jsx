import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../../assets/Css/Auth.css";
import apiClient from "../../api/apiClient";
import { useUser } from "../../context/UserContext";

const LoginPage = () => {

  const navigate = useNavigate();
  const { loginUser } = useUser(); // ⭐ context login

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    loginId: "",
    password: "",
    deviceId: "web-browser"
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  const handleLogin = async (e) => {

    e.preventDefault();
    setLoading(true);

    const payload = {
      loginId: formData.loginId,
      password: formData.password,
      deviceId: formData.deviceId
    };

    try {

      const response = await apiClient.post("/Authentication/login", payload);

      console.log("🔥 Full Backend Response:", response.data);

      if (response.data.success === true || response.data.statusCode === 200) {

        const user = response.data.data;
        const token = response.data.token;

        // ⭐ Context login (ye hi main fix hai)
        loginUser(user, token);

        toast.success("Login Successful!");

        setTimeout(() => {
          navigate("/dashboard");
        }, 500);

      } else {

        toast.error(response.data.message || "Invalid Login Details");

      }

    } catch (error) {

      console.error("Login Error:", error.response);

      const errorMsg =
        error.response?.data?.message ||
        "Login Failed: Server Error";

      toast.error(errorMsg);

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="login-v2-page-wrapper">

      <div className="login-v2-main-container">

        {/* Left Card */}
        <div className="login-v2-card-box">

          <h2 className="login-v2-title">Login</h2>
          <p className="login-v2-subtitle">Enter your details to continue</p>

          <form onSubmit={handleLogin} className="login-v2-form">

            <div className="login-v2-input-group">
              <input
                type="text"
                name="loginId"
                placeholder="Enter Login ID"
                value={formData.loginId}
                onChange={handleChange}
                required
                className="login-v2-input"
              />
            </div>

            <div className="login-v2-input-group">
              <input
                type="password"
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="login-v2-input"
              />
            </div>

            <button
              type="submit"
              className="login-v2-submit-btn"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login Now"}
            </button>

          </form>

          <div className="login-v2-footer">

<span 
  className="login-v2-forgot"
  onClick={() => navigate("/forgotpassword")}
  style={{ cursor: "pointer" }}
>
  Forgot password?
</span>

            <p className="login-v2-redirect">
              New user?
              <span onClick={() => navigate("/signup")}>
                Create Account
              </span>
            </p>

          </div>

        </div>


        {/* Right Image */}
        <div className="login-v2-hero-section">

          <img
            src="https://mangowealthplanner.com/img/hero-img.png"
            alt="Login Illustration"
            className="login-v2-hero-img"
          />

        </div>

      </div>

    </div>

  );

};

export default LoginPage;