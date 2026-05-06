import React, { useState, useEffect } from "react";
import { useNavigate, Link, NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import { CgMenuGridR } from "react-icons/cg";
import { FaCopy, FaCheck, FaUser, FaEnvelope, FaIdCard } from "react-icons/fa";
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
  
  // ADD THESE STATES - YEH MISSING THA
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

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
    }
  }, []);

  // ========== 2. JAB SPONSOR ID CHANGE HO, SPONSOR NAME FETCH KARO ==========
  useEffect(() => {
    const fetchSponsor = async () => {
      const loginId = formData.referrer_Id;
      if (loginId) {
        try {
          const res = await apiClient.get(`/User/check-user?loginid=${loginId}`);
          if (res.data?.success && res.data.data) {
            const sponsor = res.data.data.Name;
            const regno = res.data.data.regno;
            setFormData(prev => ({
              ...prev,
              sponsorName: sponsor,
              introRegNo: regno,
            }));
          } else {
            setFormData(prev => ({ ...prev, sponsorName: "Invalid Sponsor", introRegNo: "" }));
          }
        } catch (err) {
          console.error("Sponsor fetch error:", err);
          setFormData(prev => ({ ...prev, sponsorName: "Not Found", introRegNo: "" }));
        }
      } else {
        setFormData(prev => ({ ...prev, sponsorName: "", introRegNo: "" }));
      }
    };
    const timer = setTimeout(fetchSponsor, 500);
    return () => clearTimeout(timer);
  }, [formData.referrer_Id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "introRegNo") {
      setFormData((prev) => ({ ...prev, referrer_Id: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ADD COPY FUNCTION
  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success(`${field} copied!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // ADD MODAL CLOSE FUNCTION
  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate("/dashboard");
  };

  const handleSignup = async (e) => {
    e.preventDefault();
        console.log("🔴 Signup button clicked!"); // YEH ADD KAR
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
        
        // SET REGISTERED USER FOR MODAL - YEH IMPORTANT THA
        setRegisteredUser({
          regno: userData.Regno,
          loginId: userData.LoginId || userData.loginid || formData.mobile,
          name: userData.Name || formData.fName,
          email: userData.Email || formData.email,
          mobile: userData.Mobile || formData.mobile,
          sponsorId: formData.referrer_Id,
          sponsorName: formData.sponsorName,
          password: formData.password,
        });
        
        // SHOW MODAL - REDIRECT HATAYA
        setShowSuccessModal(true);
        toast.success("Registration Successful!");
        
        // NO NAVIGATE HERE - MODAL SHOW KARO
        // setTimeout(() => navigate("/dashboard"), 800); // YE HATANA HAI
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

  // Scroll effects
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
      if (e.key === "Escape" && showSuccessModal) setShowSuccessModal(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [showSuccessModal]);

  return (
    <>
      <div className="bd-bg">
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
                    <li><NavLink to="/contact">Contact U</NavLink></li>
                  </ul>

                  <div className="mediic-right-side">
                    <div className="mediic-button">
                      <Link to= "/login"className="wallet-header">
                        login
                      </Link>
                    </div>
                    <div className="mediic-button">
                      <Link to="/signup" className="wallet-header">
                        signup
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

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-drawer-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="mobile-menu-drawer" onClick={e => e.stopPropagation()}>
            <button className="close-mobile-menu" onClick={() => setIsMobileMenuOpen(false)}>✕</button>
            <img className='logomenu' src={logoImg} alt='logo'></img>
            <nav className="mediic_menu">
              <ul className="nav_scroll">
                <li className="mt-2">
                  <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</NavLink>
                </li>
                <li><NavLink to="/about" onClick={() => setIsMobileMenuOpen(false)}>About</NavLink></li>
                <li><NavLink to="/pages" onClick={() => setIsMobileMenuOpen(false)}>Pages</NavLink></li>
                <li><NavLink to="/service" onClick={() => setIsMobileMenuOpen(false)}>services</NavLink></li>
                <li><NavLink to="/bloges" onClick={() => setIsMobileMenuOpen(false)}>BLOG</NavLink></li>
                <li><NavLink to="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact Us</NavLink></li>
                <div className="mediic-button01">
                  <Link to="/login" className="wallet-header01">Login</Link>
                </div>
                <Link to="/signup" className="wallet-header01">
                  <div className="mediic-button01">signup</div>
                </Link>
              </ul>
            </nav>
          </div>
        </div>
      )}

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
                        <input type="text" value={formData.sponsorName} readOnly placeholder="Sponsor Name" className="readonly-input" style={{ color: "#008202",fontWeight: "600" }} />
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
                        <div className="mt-3">
                        <span style={{ padding: "20pxpx 20px", background: "#f0f0f0", borderRadius: "10px" }}>+91</span></div>
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

      {/* Success Modal - YEH ANDAR AAYEGA RETURN KE */}
      {showSuccessModal && registeredUser && (
        <div className="modal-overlay" onClick={handleModalClose}>
          <div className="success-modal02" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header02">
              <div className="success-icon02">✓</div>
              <div className="Registration-text">Registration Successfully</div>
              <button className="modal-close02" onClick={handleModalClose}>×</button>
            </div>
            
            <div className="modal-body02">
          
              
              <div className="user-details-card02">
                <div className="Account-text"><FaIdCard /> Your Account Details</div>


                                <div className="detail-row02">
                  <div className="detail-label02">
                    <FaUser /> Sponsor ID:
                  </div>
                  <div className="detail-value02">
                    {registeredUser.sponsorId}
                    <button className="copy-btn02" onClick={() => handleCopy(registeredUser.sponsorId, "Sponsor ID")}>
                      {copiedField === "Sponsor ID" ? <FaCheck /> : <FaCopy />}
                    </button>
                  </div>
                </div>

                <div className="detail-row02">
                  <div className="detail-label02">
                    <FaUser /> Sponsor Name:
                  </div>
                  <div className="detail-value02">
                    {registeredUser.sponsorName}
                  </div>
                </div>

                <div className="detail-row02">
                  <div className="detail-label02">
                    <FaUser /> Login ID:
                  </div>
                  <div className="detail-value02">
                    {registeredUser.loginId || registeredUser.mobile}
                    <button className="copy-btn02" onClick={() => handleCopy(registeredUser.loginId || registeredUser.mobile, "Login ID")}>
                      {copiedField === "Login ID" ? <FaCheck /> : <FaCopy />}
                    </button>
                  </div>
                </div>

                <div className="detail-row02">
                  <div className="detail-label02">
                    <FaEnvelope /> Email:
                  </div>
                  <div className="detail-value02">
                    {registeredUser.email}
                    <button className="copy-btn02" onClick={() => handleCopy(registeredUser.email, "Email")}>
                      {copiedField === "Email" ? <FaCheck /> : <FaCopy />}
                    </button>
                  </div>
                </div>


              </div>
              
              <div className="modal-actions02">
                <Link to="login">
                <button className="btn-dashboard02" onClick={handleModalClose}>
                  LOGIN
                </button>  
                </Link>          
              </div>  
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Signup;