import React, { useState, useEffect } from "react";
import { useNavigate, Link, NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import { CgMenuGridR } from "react-icons/cg";
import "../../assets/Css/Auth.css";
import apiClient from "../../api/apiClient";

// Import images (same as Signup/Login)
import logoImg from "../../assets/images/logo.png";
import logo2Img from "../../assets/images/logo2.png";
import signupImage from "../../assets/images/resource/appoinment.png";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [loginId, setLoginId] = useState("");
  const [loading, setLoading] = useState(false);

  // UI states for header, sidebar, mobile menu
  const [isSticky, setIsSticky] = useState(false);
  const [isInfoGroupActive, setIsInfoGroupActive] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedId = loginId.trim();
    if (!trimmedId) {
      toast.error("Please enter your Login ID / Email");
      return;
    }
    setLoading(true);
    try {
      const response = await apiClient.post("/Authentication/forget-password", trimmedId, {});
      const responseData = response.data || response;
      if (responseData.result === "true" || responseData.success === true) {
        toast.success(responseData.message || "Password recovery instructions sent");
        navigate("/login");
      } else {
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

  // Sticky header effect
  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.classList.add('loaded');
    return () => document.body.classList.remove('loaded');
  }, []);


  return (
    <>
           <div className="bd-bg">
             {/* Main Header - identical to Signup */}
             <div id="sticky-header" className={`mediic_nav_manu ${isSticky ? 'sticky' : ''}`}>
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
     
                         <div className="mediic-button">
                           <Link to={localStorage.getItem("isLoggedIn") === "true" ? "/dashboard" : "/login"} className="wallet-header">
                             Loginy
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
                             <span><i><CgMenuGridR /></i></span>
                           </div>
                         </div>
                       </div>
                     </nav>
                   </div>

              {/* Mobile Menu Toggle Button */}
              <div className="col-6 d-lg-none text-end">
                <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                  <i className="fa-solid fa-bars"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Info Group Sidebar */}
        <div className={`xs-sidebar-group info-group ${isInfoGroupActive ? 'isActive' : ''}`}>
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
                    <p>Mango Wealth Planner specializes in healthcare and pharmaceutical investments, combining financial expertise with deep sector knowledge to build resilient, growth-oriented portfolios in the essential healthcare sector</p>
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
              <img className='logomenu' src={logoImg} alt='logo'></img>

              <nav className="mediic_menu">
                <ul className="nav_scroll ">
                  <li className="mt-2">
                    <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</NavLink>
                  </li>
                  <li><NavLink to="/about" onClick={() => setIsMobileMenuOpen(false)}>About</NavLink></li>
                  <li>
                    <NavLink to="#">Pages</NavLink>
                  </li>
                  <li>
                    <NavLink to="#">Services</NavLink>
                  </li>
                  <li>
                    <NavLink to="#">Blog</NavLink>
                  </li>
                  <li><NavLink to="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact Us</NavLink></li>

                  <div className="mediic-button">
                    <Link to={localStorage.getItem("isLoggedIn") === "true" ? "/dashboard" : "/login"} className="wallet-header">
                      Login

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

                </ul>
              </nav>
            </div>
          </div>
        )}

        {/* Forgot Password Form Section (same layout as Signup/Login) */}
        <div className="mediic-appoinment">
          <div className="container">
            <div className="row appoinment align-items-center">
              <div className="col-lg-6 signup-left-col">
                <img src={signupImage} alt="Signup Illustration" className="signup-side-image" />
              </div>
              <div className="col-lg-6" data-aos="zoom-in-left">
                <div className="mediic-section-title2">
                  <h4>FORGOT PASSWORD</h4>
                  <h3 className="cursor-scale small">Recover your account</h3>
                </div>
                <div className="contact-form-box">
                  <form onSubmit={handleSubmit} id="forgot-form">
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <div className="form-box">
                          <input
                            type="text"
                            placeholder="Enter Login ID / Email"
                            className="fp-input"
                            value={loginId}
                            onChange={(e) => setLoginId(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <p className="signup-footer-text">
                          Remember password?{" "}
                          <a href="/login" onClick={(e) => { e.preventDefault(); navigate("/login"); }}>
                            Back to Login
                          </a>
                        </p>
                      </div>
                      <div className="col-lg-12 col-md-6">
                        <div className="submit-button">
                          <button type="submit" className="submit-btn cursor-scale small" disabled={loading}>
                            {loading ? "Sending..." : "Recover Password"} <svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" fill="currentColor" class="bi bi-arrow-return-right" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.5 1.5A.5.5 0 0 0 1 2v4.8a2.5 2.5 0 0 0 2.5 2.5h9.793l-3.347 3.346a.5.5 0 0 0 .708.708l4.2-4.2a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 8.3H3.5A1.5 1.5 0 0 1 2 6.8V2a.5.5 0 0 0-.5-.5" /></svg>
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

export default ForgotPassword;