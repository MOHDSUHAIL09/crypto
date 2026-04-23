
import React, { useState, useEffect } from "react";
import { useNavigate, Link, NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import { CgMenuGridR } from "react-icons/cg";
import "../../assets/Css/Auth.css";
import apiClient from "../../api/apiClient";

// Images
import logoImg from "../../assets/images/logo.png";
import logo2Img from "../../assets/images/logo2.png";
import arrowImg from "../../assets/images/resource/arrow.png";
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "introRegNo") {
      setFormData((prev) => ({ ...prev, referrer_Id: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    const fetchSponsor = async () => {
      const loginId = formData.referrer_Id;
      if (loginId) {
        try {
          const res = await apiClient.get(`/User/check-user?loginid=${loginId}`);
          if (res.data?.success && res.data.data) {
            setFormData((prev) => ({
              ...prev,
              sponsorName: res.data.data.Name,
              introRegNo: res.data.data.regno,
            }));
          } else {
            setFormData((prev) => ({ ...prev, sponsorName: "Invalid Sponsor", introRegNo: "" }));
          }
        } catch {
          setFormData((prev) => ({ ...prev, sponsorName: "Not Found", introRegNo: "" }));
        }
      } else {
        setFormData((prev) => ({ ...prev, sponsorName: "", introRegNo: "" }));
      }
    };
    const timer = setTimeout(fetchSponsor, 500);
    return () => clearTimeout(timer);
  }, [formData.referrer_Id]);

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
        {/* Sticky Header */}
        <div id="sticky-header" className={`mediic_nav_manu ${isSticky ? "sticky" : ""}`}>
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col-lg-2 col-6">
                <div className="logo cursor-scale small">
                  <Link className="logo_img" to="/" title="mediic">
                    <img className="logo1" src={logoImg} alt="logo" />
                  </Link>
                  <Link className="main_sticky" to="/" title="mediic">
                    <img className="logo1" src={logo2Img} alt="logo" />
                  </Link>
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="col-lg-10 d-none d-lg-block">
                <nav className="mediic_menu">
                  <ul className="nav_scroll">
                    <li><NavLink className="mdy-hover cursor-scale small" to="/">Home</NavLink></li>
                    <li><NavLink className="mdy-hover cursor-scale small" to="/about">Why Healthcare?</NavLink></li>
                    <li><NavLink className="mdy-hover cursor-scale small" to="#">Our Approach</NavLink></li>
                    <li>
                      <NavLink className="mdy-hover cursor-scale small" to="#">Services</NavLink>
                      <ul className="sub-menu">
                        <li><Link to="/service">Our Service</Link></li>
                        <li><Link to="/service-details">Certifications</Link></li>
                      </ul>
                    </li>
                    <li><NavLink className="mdy-hover cursor-scale small" to="/contact">Contact Us</NavLink></li>
                  </ul>
                  <div className="mediic-right-side cursor-scale small">
                    <div className="search-box-btn search-box-outer" onClick={() => setIsSearchActive(true)}>
                      <i className="fa-solid fa-magnifying-glass"></i>
                    </div>
                    <div className="mediic-button">
                      <Link to={localStorage.getItem("isLoggedIn") === "true" ? "/dashboard" : "/login"} className="wallet-header">
                        Get Dashboard
                        <img src={arrowImg} alt="" />
                        <div className="mediic-hover-btn hover-btn"></div>
                        <div className="mediic-hover-btn hover-btn2"></div>
                        <div className="mediic-hover-btn hover-btn3"></div>
                        <div className="mediic-hover-btn hover-btn4"></div>
                      </Link>
                    </div>
                    <div className="sidebar">
                      <div className="nav-btn navSidebar-button" onClick={() => setIsInfoGroupActive(true)}>
                        <span><i><CgMenuGridR /></i></span>
                      </div>
                    </div>
                  </div>
                </nav>
              </div>

              {/* Mobile Menu Toggle */}
              <div className="col-6 d-lg-none text-end">
                <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                  <i className="fa-solid fa-bars"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search Popup */}
        <div className={`search-popup ${isSearchActive ? "search-active" : ""}`}>
          <button className="close-search style-two" onClick={() => setIsSearchActive(false)}>
            <span className="flaticon-multiply"><i className="fa-solid fa-xmark"></i></span>
          </button>
          <form method="get" action="#">
            <div className="form-group">
              <input type="search" name="search-field" placeholder="Search..." required />
              <button type="submit"><i className="fa fa-search"></i></button>
            </div>
          </form>
        </div>

        {/* Info Group Sidebar */}
        <div className={`xs-sidebar-group info-group ${isInfoGroupActive ? "isActive" : ""}`}>
          <div className="xs-overlay xs-bg-black" onClick={() => setIsInfoGroupActive(false)}></div>
          <div className="xs-sidebar-widget">
            <div className="sidebar-widget-container">
              <div className="widget-heading">
                <a href="#" className="close-side-widget" onClick={(e) => { e.preventDefault(); setIsInfoGroupActive(false); }}>
                  <i className="fa-solid fa-xmark"></i>
                </a>
              </div>
              <div className="sidebar-textwidget">
                <div className="sidebar-info-contents">
                  <div className="contact-info">
                    <h2>About Company</h2>
                    <p>Mango Wealth Planner specializes in healthcare and pharmaceutical investments, combining financial expertise with deep sector knowledge to build resilient, growth-oriented portfolios in the essential healthcare sector.</p>
                    <ul className="list-style-one">
                      <li><span className="icon fa-phone"></span>+1 800 123 456 789</li>
                      <li><span className="icon fa-envelope"></span>healthcare@mangowealthplanner.com</li>
                    </ul>
                    <ul className="social-box">
                      <li><a href="#"><i className="fa-brands fa-facebook-f"></i></a></li>
                      <li><a href="#"><i className="fa-brands fa-twitter"></i></a></li>
                      <li><a href="#"><i className="fa-brands fa-instagram"></i></a></li>
                      <li><a href="#"><i className="fa-brands fa-linkedin-in"></i></a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="mobile-menu-drawer-overlay" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="mobile-menu-drawer" onClick={e => e.stopPropagation()}>
              <button className="close-mobile-menu" onClick={() => setIsMobileMenuOpen(false)}>✕</button>
              <nav className="mediic_menu">
                <ul className="nav_scroll">
                  <li><NavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</NavLink></li>
                  <li><NavLink to="/about" onClick={() => setIsMobileMenuOpen(false)}>Why Healthcare?</NavLink></li>
                  <li><NavLink to="#" onClick={() => setIsMobileMenuOpen(false)}>Our Approach</NavLink></li>
                  <li><NavLink to="#" onClick={() => setIsMobileMenuOpen(false)}>Services</NavLink></li>
                  <li><NavLink to="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact Us</NavLink></li>
                  <div className="mediic-button01">
                    <Link
                      to={localStorage.getItem("isLoggedIn") === "true" ? "/dashboard" : "/login"}
                      className="wallet-header01"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                      <div className="mediic-hover-btn hover-btn"></div>
                      <div className="mediic-hover-btn hover-btn2"></div>
                      <div className="mediic-hover-btn hover-btn3"></div>
                      <div className="mediic-hover-btn hover-btn4"></div>
                    </Link>
                  </div>
                </ul>
              </nav>
            </div>
          </div>
        )}

        {/* Signup Form Section */}
        <div className="mediic-appoinment">
          <div className="container">
            <div className="row appoinment">
              {/* LEFT COLUMN - IMAGE (on desktop left, on mobile below form) */}
              <div className="col-lg-6 signup-left-col">
                <img src={signupImage} alt="Signup Illustration" className="signup-side-image" />
              </div>
              {/* RIGHT COLUMN - FORM (on desktop right, on mobile on top) */}
              <div className="col-lg-6">
                <div className="mediic-section-title2">
                  <h4>SIGNUP ACCOUNT</h4>
                  <h3 className="cursor-scale small">Sign up to your account</h3>
                </div>
                <div className="contact-form-box">
                  <form onSubmit={handleSignup} id="signup-form">
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <div className="form-box">
                          <input type="text" name="introRegNo" placeholder="Sponsor ID*" value={formData.referrer_Id} onChange={handleChange} required />
                        </div>
                      </div>
                      <div className="col-lg-12 col-md-12">
                        <div className="form-box">
                          <input type="text" value={formData.sponsorName} readOnly placeholder="Sponsor Name" className="readonly-input" />
                        </div>
                      </div>
                      <div className="col-lg-12 col-md-12">
                        <div className="form-box">
                          <input type="text" name="fName" placeholder="Full Name*" value={formData.fName} onChange={handleChange} required />
                        </div>
                      </div>
                      <div className="col-lg-12 col-md-12">
                        <div className="form-box">
                          <input type="email" name="email" placeholder="Email Address*" value={formData.email} onChange={handleChange} required />
                        </div>
                      </div>
                      <div className="col-lg-12 col-md-12">
                        <div className="form-box d-flex" style={{ gap: "10px" }}>
                          <span style={{ padding: "1px 15px", background: "#f0f0f0", borderRadius: "8px", marginBottom: "11px" }}>+91</span>
                          <input type="text" name="mobile" placeholder="Mobile Number*" maxLength="10" value={formData.mobile} onChange={handleChange} required style={{ flex: 1 }} />
                        </div>
                      </div>
                      <div className="col-lg-12 col-md-12">
                        <div className="form-box">
                          <input type="password" name="password" placeholder="Create Password*" value={formData.password} onChange={handleChange} required />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <p className="signup-footer-text">
                          Already have an account? <a href="/login" onClick={(e) => { e.preventDefault(); navigate("/login"); }}>Login Here</a>
                        </p>
                      </div>
                      <div className="col-lg-12 col-md-6">
                        <div className="submit-button">
                          <button type="submit" className="submit-btn cursor-scale small" disabled={loading}>
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
      </div>
    </>
  );
};

export default Signup;