// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import "../../assets/Css/Auth.css";
// import apiClient from "../../api/apiClient";
// import { useUser } from "../../context/UserContext";

// const LoginPage = () => {

//   const navigate = useNavigate();
//   const { loginUser } = useUser();

//   const [loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     loginId: "",
//     password: "",
//     deviceId: "web-browser"
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };


//   const handleLogin = async (e) => {

//     e.preventDefault();
//     setLoading(true);

//     const payload = {
//       loginId: formData.loginId,
//       password: formData.password,
//       deviceId: formData.deviceId
//     };

//     try {

//       const response = await apiClient.post("/Authentication/login", payload);

//       console.log("🔥 Full Backend Response:", response.data);

//       if (response.data.success === true || response.data.statusCode === 200) {

//         const user = response.data.data;
//         const token = response.data.token;

//         loginUser(user, token);

//         toast.success("Login Successful!");

//         setTimeout(() => {
//           navigate("/dashboard");
//         }, 500);

//       } else {

//         toast.error(response.data.message || "Invalid Login Details");

//       }

//     } catch (error) {

//       console.error("Login Error:", error.response);

//       const errorMsg =
//         error.response?.data?.message ||
//         "Login Failed: Server Error";

//       toast.error(errorMsg);

//     } finally {

//       setLoading(false);

//     }

//   };


//   return (

//     <div className="login-v2-page-wrapper">

//       <div className="login-v2-main-container">

//         {/* Left Card */}
//         <div className="login-v2-card-box">

//           <h2 className="login-v2-title">Login</h2>
//           <p className="login-v2-subtitle">Enter your details to continue</p>

//           <form onSubmit={handleLogin} className="login-v2-form">

//             <div className="login-v2-input-group">
//               <input
//                 type="text"
//                 name="loginId"
//                 placeholder="Enter Login ID"
//                 value={formData.loginId}
//                 onChange={handleChange}
//                 required
//                 className="login-v2-input"
//               />
//             </div>

//             <div className="login-v2-input-group">
//               <input
//                 type="password"
//                 name="password"
//                 placeholder="Enter Password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//                 className="login-v2-input"
//               />
//             </div>

//             <button
//               type="submit"
//               className="login-v2-submit-btn"
//               disabled={loading}
//             >
//               {loading ? "Logging in..." : "Login Now"}
//             </button>

//           </form>

//           <div className="login-v2-footer">

// <span 
//   className="login-v2-forgot"
//   onClick={() => navigate("/forgotpassword")}
//   style={{ cursor: "pointer" }}
// >
//   Forgot password?
// </span>

//             <p className="login-v2-redirect">
//               New user?
//               <span onClick={() => navigate("/signup")}>
//                 Create Account
//               </span>
//             </p>

//           </div>

//         </div>


//         {/* Right Image */}
//         <div className="login-v2-hero-section">

//           <img
//             src="https://mangowealthplanner.com/img/hero-img.png"
//             alt="Login Illustration"
//             className="login-v2-hero-img"
//           />

//         </div>

//       </div>

//     </div>

//   );

// };

// export default LoginPage;















import React, { useState, useEffect } from "react";
import { useNavigate, Link, NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import { CgMenuGridR } from "react-icons/cg";
import "../../assets/Css/Auth.css";
import apiClient from "../../api/apiClient";
import { useUser } from "../../context/UserContext";

// Import images (same as Signup)
import logoImg from "../../assets/images/logo.png";
import logo2Img from "../../assets/images/logo2.png";
import signupImage from "../../assets/images/resource/appoinment.png";

const Login = () => {
  const navigate = useNavigate();
  const { loginUser } = useUser(); // from context
  const [loading, setLoading] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isInfoGroupActive, setIsInfoGroupActive] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      if (response.data.success === true || response.data.statusCode === 200) {
        const user = response.data.data;
        const token = response.data.token;
        loginUser(user, token); // context updates
        toast.success("Login Successful!");
        setTimeout(() => navigate("/dashboard"), 500);
      } else {
        toast.error(response.data.message || "Invalid Login Details");
      }
    } catch (error) {
      console.error("Login Error:", error.response);
      const errorMsg = error.response?.data?.message || "Login Failed: Server Error";
      toast.error(errorMsg);
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

                  <Link
                    to={localStorage.getItem("isLoggedIn") === "true" ? "/dashboard" : "/login"}
                    className="wallet-header01"
                  >
                    <div className="mediic-button01">

                      Login

                      <div className="mediic-hover-btn hover-btn"></div>
                      <div className="mediic-hover-btn hover-btn2"></div>
                      <div className="mediic-hover-btn hover-btn3"></div>
                      <div className="mediic-hover-btn hover-btn4"></div>

                    </div></Link>


                  <div className="mediic-button01">
                    <Link
                      to={localStorage.getItem("isLoggedIn") === "true" ? "/dashboard" : "/Signup"}
                      className="wallet-header01"
                    >
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

        {/* Login Form Section - replaces signup form */}
        <div className="mediic-appoinment">
          <div className="container">
            <div className="row appoinment align-items-center">
              <div className="col-lg-6 signup-left-col">
                <img src={signupImage} alt="Signup Illustration" className="signup-side-image" />
              </div>
              <div className="col-lg-6" data-aos="zoom-in-left">
                <div className="mediic-section-title2">
                  <h4>LOGIN ACCOUNT</h4>
                  <h3 className="cursor-scale small">Login to your account</h3>
                </div>
                <div className="contact-form-box">
                  <form onSubmit={handleLogin} id="login-form">
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <div className="form-box">
                          <input
                            type="text"
                            name="loginId"
                            placeholder="Login ID*"
                            value={formData.loginId}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-lg-12 col-md-12">
                        <div className="form-box">
                          <input
                            type="password"
                            name="password"
                            placeholder="Password*"
                            value={formData.password}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <p className="signup-footer-text">
                          Forgot password?{" "}
                          <a href="/forgot-password" onClick={(e) => { e.preventDefault(); navigate("/forgotpassword"); }}>
                            Reset Here
                          </a>
                        </p>
                      </div>
                      <div className="col-lg-12">
                        <p className="signup-footer-text">
                          Don't have an account?{" "}
                          <a href="/signup" onClick={(e) => { e.preventDefault(); navigate("/signup"); }}>
                            Create Account
                          </a>
                        </p>
                      </div>
                      <div className="col-lg-12 col-md-6">
                        <div className="submit-button">
                          <button type="submit" className="submit-btn cursor-scale small" disabled={loading}>
                            {loading ? "Logging in..." : "Login Now"} <i className="bi bi-arrow-return-right"></i>
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

export default Login;