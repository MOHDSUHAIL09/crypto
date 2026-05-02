import React, { useState, useEffect } from "react";
import { useNavigate, Link, NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import { CgMenuGridR } from "react-icons/cg";
import "../../assets/Css/Auth.css";
import apiClient from "../../api/apiClient";

// Images
import logoImg from "../../assets/images/logo.png";
import logo2Img from "../../assets/images/logo2.png";
import signupImage from "../../assets/images/resource/appoinment.png"; 

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isInfoGroupActive, setIsInfoGroupActive] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    introSide: "L",
  });

  // ========== 1. URL SE REF PARAM READ KARO AUR SPONSOR ID SET KARO ==========
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get("ref");
    console.log("🔍 URL params:", window.location.search);
    console.log("🔍 refCode from URL:", refCode);
    
    if (refCode && !formData.referrer_Id) {
      console.log("✅ Auto-filling sponsor ID with:", refCode);
      setFormData(prev => ({
        ...prev,
        referrer_Id: refCode,
        introRegNo: refCode,
      }));
    } else {
      console.log("❌ Not auto-filling. refCode:", refCode, "referrer_Id:", formData.referrer_Id);
    }
  }, []); // Sirf ek baar chalega

  // ========== 2. JAB SPONSOR ID CHANGE HO, SPONSOR NAME FETCH KARO ==========
  useEffect(() => {
    const fetchSponsor = async () => {
      const loginId = formData.referrer_Id;
      console.log("🔄 Fetching sponsor for loginId:", loginId);
      if (loginId) {
        try {
          const res = await apiClient.get(`/User/check-user?loginid=${loginId}`);
          console.log("📡 Sponsor API response:", res.data);
          if (res.data?.success && res.data.data) {
            const sponsor = res.data.data.Name;
            const regno = res.data.data.regno;
            console.log("✅ Sponsor found:", sponsor, "RegNo:", regno);
            setFormData(prev => ({
              ...prev,
              sponsorName: sponsor,
              introRegNo: regno,
            }));
          } else {
            console.warn("⚠️ Invalid sponsor response");
            setFormData(prev => ({ ...prev, sponsorName: "Invalid Sponsor", introRegNo: "" }));
          }
        } catch (err) {
          console.error("❌ Sponsor fetch error:", err);
          setFormData(prev => ({ ...prev, sponsorName: "Not Found", introRegNo: "" }));
        }
      } else {
        console.log("⏩ No sponsor ID, clearing name");
        setFormData(prev => ({ ...prev, sponsorName: "", introRegNo: "" }));
      }
    };
    const timer = setTimeout(fetchSponsor, 500);
    return () => clearTimeout(timer);
  }, [formData.referrer_Id]); // referrer_Id change hone par run hoga

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "introRegNo") {
      setFormData((prev) => ({ ...prev, referrer_Id: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!formData.sponsorName || formData.sponsorName === "Invalid Sponsor") {
      toast.error("Valid Sponsor ID daalein!");
      return;
    }
    setLoading(true);
    const payload = {
      IntroRegNo: formData.introRegNo,
      IntroSide: formData.introSide,
      FName: formData.fName,
      LName: formData.lName,
      Mobile: formData.mobile,
      Email: formData.email,
      LoginId: "###",
      Password: formData.password,
      Address: formData.address,
      Country: formData.country,
      Referrer: formData.referrer,
      Created_At: new Date().toISOString(),
      Private_Key: formData.private_Key,
      Affiliate_Level: formData.affiliate_Level,
      Referrer_Id: formData.referrer_Id,
    };
    try {
      const response = await apiClient.post("/Authentication/register", payload);
      if (response.data.success === true || response.status === 200) {
        const userData = response.data.data;
        localStorage.setItem("token", response.data.token || "authenticated_via_signup");
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("regno", userData.Regno);
        localStorage.setItem("isLoggedIn", "true");
        toast.success("Registration Successful! Redirecting...");
        setTimeout(() => navigate("/dashboard"), 800);
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

  // Scroll effects etc. (same as your original)
  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.classList.add("loaded");
    return () => document.body.classList.remove("loaded");
  }, []);

  useEffect(() => {
    if (isSearchActive) {
      document.body.classList.add("search-active");
    } else {
      document.body.classList.remove("search-active");
    }
  }, [isSearchActive]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsSearchActive(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      <div className="bd-bg">
        {/* Header - same as your original, skipping for brevity */}
        <div id="sticky-header" className={`mediic_nav_manu ${isSticky ? "sticky" : ""}`}>
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col-lg-2 col-6">
                <div className="logo cursor-scale small">
                  <Link className="logo_img" to="/">
                    <img className="logo1" src={logoImg} alt="logo" />
                  </Link>
                  <Link className="main_sticky" to="/">
                    <img className="logo1" src={logo2Img} alt="logo" />
                  </Link>
                </div>
              </div>
              <div className="col-lg-10 d-none d-lg-block">
                <nav className="mediic_menu">
                  <ul className="nav_scroll">
                    <li><NavLink to="/">Home</NavLink></li>
                    <li><NavLink to="/about">Why Healthcare?</NavLink></li>
                    <li><NavLink to="#">Our Approach</NavLink></li>
                    <li>
                      <NavLink to="#">Services</NavLink>
                      <ul className="sub-menu">
                        <li><Link to="/service">Our Service</Link></li>
                        <li><Link to="/service-details">Certifications</Link></li>
                      </ul>
                    </li>
                    <li><NavLink to="/contact">Contact Us</NavLink></li>
                  </ul>
                 
                  <div className="mediic-right-side">
                     <div className="mediic-button">
                      <Link to={localStorage.getItem("isLoggedIn") === "true" ? "/dashboard" : "/login"} className="wallet-header">
                        login
                        <div className="mediic-hover-btn hover-btn"></div>
                        <div className="mediic-hover-btn hover-btn2"></div>
                        <div className="mediic-hover-btn hover-btn3"></div>
                        <div className="mediic-hover-btn hover-btn4"></div>
                      </Link>
                    </div>
                    <div className="mediic-button">
                      <Link to={localStorage.getItem("isLoggedIn") === "true" ? "/dashboard" : "/signup"} className="wallet-header">
                        signup
                        <div className="mediic-hover-btn hover-btn"></div>
                        <div className="mediic-hover-btn hover-btn2"></div>
                        <div className="mediic-hover-btn hover-btn3"></div>
                        <div className="mediic-hover-btn hover-btn4"></div>
                      </Link>
                    </div>
                    <div className="sidebar">
                                       <div className="nav-btn navSidebar-button" onClick={() => setIsInfoGroupActive(true)}>
                                         <span><CgMenuGridR className="menu-icon" /></span>
                   
                   
                                       </div>
                                     </div>
                  </div>
                </nav>
              </div>
              <div className="col-6 d-lg-none text-end">
                <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                  <i className="fa-solid fa-bars"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar / Mobile Menu - copy from your existing code */}

      {/* Signup Form */}
      <div className="mediic-appoinment">
        <div className="container">
          <div className="row appoinment">
            <div className="col-lg-6 signup-left-col">
              <img src={signupImage} alt="Signup Illustration" className="signup-side-image" />
            </div>
            <div className="col-lg-6">
              <div className="mediic-section-title2">
                <h4>SIGNUP ACCOUNT</h4>
                <h3>Sign up to your account</h3>
              </div>
              <div className="contact-form-box">
                <form onSubmit={handleSignup}>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="form-box">
                        <input type="text" name="introRegNo" placeholder="Sponsor ID*" value={formData.referrer_Id} onChange={handleChange} required />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="form-box">
                        <input type="text" value={formData.sponsorName} readOnly placeholder="Sponsor Name" className="readonly-input" />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="form-box">
                        <input type="text" name="fName" placeholder="Full Name*" value={formData.fName} onChange={handleChange} required />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="form-box">
                        <input type="email" name="email" placeholder="Email Address*" value={formData.email} onChange={handleChange} required />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="form-box d-flex" style={{ gap: "10px" }}>
                        <span style={{ padding: "1px 15px", background: "#f0f0f0", borderRadius: "8px" }}>+91</span>
                        <input type="text" name="mobile" placeholder="Mobile Number*" maxLength="10" value={formData.mobile} onChange={handleChange} required style={{ flex: 1 }} />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="form-box">
                        <input type="password" name="password" placeholder="Create Password*" value={formData.password} onChange={handleChange} required />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <p className="signup-footer-text">
                        Already have an account? <a href="/login" onClick={(e) => { e.preventDefault(); navigate("/login"); }}>Login Here</a>
                      </p>
                    </div>
                    <div className="col-lg-12">
                      <div className="submit-button">
                        <button type="submit" className="submit-btn" disabled={loading}>
                          {loading ? "Creating Account..." : "Signup Now"} <i className="bi bi-arrow-return-right"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;