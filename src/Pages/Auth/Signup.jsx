import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../../assets/Css/Auth.css";
import apiClient from "../../api/apiClient";

const SignupPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // const [showModal, setShowModal] = useState(false);
  // const [generatedID, setGeneratedID] = useState("");

  const [formData, setFormData] = useState({
    introRegNo: "", 
    referrer_Id: "",
    sponsorName: "",
    fName: "",
    lName: " ",
    mobile: "",
    email: "",
    password: "",
    address: "India",
    private_Key: "N/A",
    affiliate_Level: 0,
    referrer: "",
    country: 91,
    introSide: "L"
  });

  // const copyIdAction = (id) => {
  //   if (!id) return;
  //   navigator.clipboard.writeText(id)
  //     .then(() => toast.success("ID Copied to Clipboard!"))
  //     .catch(() => toast.error("Failed to copy!"));
  // };
  // 🔥 Input Change


  
  const handleChange = (e) => {
    console.log("payload" ,formData)
    const { name, value } = e.target;

    if (name === "introRegNo") {
      setFormData((prev) => ({
        ...prev,
        referrer_Id: value
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // 🔥 Sponsor Fetch
  useEffect(() => {
    const fetchSponsor = async () => {
      const loginId = formData.referrer_Id;

      if (loginId) {
        try {
          const res = await apiClient.get(
            `/User/check-user?loginid=${loginId}`
          );

          if (res.data?.success && res.data.data) {
            setFormData((prev) => ({
              ...prev,
              sponsorName: res.data.data.Name,
              introRegNo: res.data.data.regno
            }));
          } else {
            setFormData((prev) => ({
              ...prev,
              sponsorName: "Invalid Sponsor",
              introRegNo: ""
            }));
          }
        } catch {
          setFormData((prev) => ({
            ...prev,
            sponsorName: "Not Found",
            introRegNo: ""
          }));
        }
      } else {
        setFormData((prev) => ({
          ...prev,
          sponsorName: "",
          introRegNo: ""
        }));
      }
    };

    const timer = setTimeout(fetchSponsor, 500);
    return () => clearTimeout(timer);
  }, [formData.referrer_Id]);

  // 🔥 Signup
  const handleSignup = async (e) => {
  e.preventDefault();
  
  if (!formData.sponsorName || formData.sponsorName === "Invalid Sponsor") {
    toast.error("Valid Sponsor ID daalein!");
    return;
  }

  setLoading(true);

  // Exact payload jo backend maang raha hai
  const payload = {
    IntroRegNo: formData.introRegNo,
    IntroSide: formData.introSide,
    FName: formData.fName,
    LName: formData.lName,
    Mobile: formData.mobile,
    Email: formData.email,
    LoginId: "###", // Backend generate karega
    Password: formData.password,
    Address: formData.address,
    Country: formData.country,
    Referrer: formData.referrer,
    Created_At: new Date().toISOString(),
    Private_Key: formData.private_Key,
    Affiliate_Level: formData.affiliate_Level,
    Referrer_Id: formData.referrer_Id
  };

  try {
    const response = await apiClient.post(
      "/Authentication/register",
      payload
    );

if (response.data.success === true || response.status === 200) {
  const userData = response.data.data;

  localStorage.setItem("token", response.data.token || "authenticated_via_signup");
  localStorage.setItem("user", JSON.stringify(userData));
  localStorage.setItem("regno", userData.Regno); // ⭐ important
  localStorage.setItem("isLoggedIn", "true");

  toast.success("Registration Successful! Redirecting...");

  setTimeout(() => {
    navigate("/dashboard");
  }, 800);

    } else {
      toast.error(response.data.message || "Registration Failed");
    }
  } catch (error) {
    console.error("Signup Error:", error);
    toast.error(error.response?.data?.message || "Server Error");
  } finally {
    setLoading(false);
  }
};

  return (
  <>
    <div className="signup-v3-page-wrapper">
      <div className="signup-v3-main-card">

        {/* LEFT FORM SECTION */}
        <div className="signup-v3-form-section">
          <div className="signup-v3-header">
            <h1>Signup</h1>
            <p>Sign up to your account to get started</p>
          </div>

          <form onSubmit={handleSignup} className="signup-v3-form">

            <div className="signup-v3-input-row">
              <input type="text" name="introRegNo" placeholder="Sponsor ID" className="signup-v3-input" value={formData.referrer_Id} onChange={handleChange} required />
              <input type="text" value={formData.sponsorName} readOnly className="signup-v3-input signup-v3-readOnly" placeholder="Sponsor Name" />
            </div>
              <input type="text" name="fName" placeholder="Full Name" className="signup-v3-input" value={formData.fName} onChange={handleChange} required />
              <input type="email" name="email" placeholder="Email Address" className="signup-v3-input" value={formData.email} onChange={handleChange} required />
            <div className="signup-v3-mobile-wrap">
              <div className="signup-v3-country-code">91</div>
              <input type="text" name="mobile" placeholder="Mobile Number" maxLength="10" className="signup-v3-input signup-v3-number-input" value={formData.mobile} onChange={handleChange} required />
            </div>
              <input type="password" name="password" placeholder="Create Password" className="signup-v3-input" value={formData.password} onChange={handleChange} required />
              <button type="submit" className="signup-v3-submit-btn" disabled={loading} >
              {loading ? "Creating Account..." : "Signup Now"}
            </button>
          </form>

          <p className="signup-v3-footer-text">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>Login Here</span>
          </p>
        </div>

        {/* RIGHT IMAGE SECTION */}
        <div className="signup-v3-visual-section">
          <img
            src="https://mangowealthplanner.com/img/hero-img.png"
            alt="Hero"
            className="signup-v3-hero-img"
          />
        </div>
      </div>

    
    </div>
    </>
  );
};

export default SignupPage;   