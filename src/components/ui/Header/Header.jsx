// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import lightLogo from "../../../assets/images/logo.png";
// import darkLogo from "../../../assets/images/dark-logo.png";

// const Header = () => {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const navigate = useNavigate();


//   useEffect(() => {
//     const handleScroll = () => {
//       const header = document.querySelector("header");
//       if (!header) return;

//       if (window.scrollY > 50) header.classList.add("fixed");
//       else header.classList.remove("fixed");
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <header className="header">


//       <div className="logo">
//          <img className="light" src={lightLogo} alt="logo" />
//          <img className="dark" src={darkLogo} alt="logo" /> 
//       </div>


//       <div className="main-menu">

//         <div
//           className={`menu-icon ${menuOpen ? "active" : ""}`}
//           onClick={() => setMenuOpen(!menuOpen)}
//         >
//           <span></span>
//           <span></span>
//           <span></span>   
//         </div>

//         <nav className={`onepage ${menuOpen ? "show" : ""}`}>  
//           <ul>
//             <li className="active"><a href="#top">Home</a></li>
//             <li><a href="#about">About ico</a></li>
//             <li><a href="#token">Token</a></li>
//             <li><a href="#roadmap">Roadmap</a></li>
//             <li><a href="#team">Team</a></li>
//             <li><a href="#press">Press</a></li>

//             {/* 🔥 DASHBOARD BUTTON */}
//             <li className="nav-btn">
//               <button
//                 onClick={() => {
//                   const isLoggedIn =
//                     localStorage.getItem("isLoggedIn") === "true";

//                   if (isLoggedIn) {
//                     navigate("/dashboard");  
//                   } else {
//                     navigate("/login");      
//                   }
//                 }}
//                 className="wallet-header"
//               >
//                 Dashboard
//               </button>
//             </li>

//           </ul>
//         </nav>
//       </div>
//     </header>
//   );
// };

// export default Header;








// src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { CgMenuGridR } from "react-icons/cg";

// CSS imports
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../../../assets/Css/Main.css';
import '../../../assets/Css/mainmenu.css'
import '../../../assets/Css/responsive.css'

// Image imports
import logoImg from '../../../assets/images/logo.png';
import logo2Img from '../../../assets/images/logo2.png';
import arrowImg from '../../../assets/images/resource/arrow.png';

const Header = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isInfoGroupActive, setIsInfoGroupActive] = useState(false);
  // const [isCartGroupActive, setIsCartGroupActive] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sticky header on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Loader: add 'loaded' class to body after component mount
  useEffect(() => {
    document.body.classList.add('loaded');
    return () => {
      document.body.classList.remove('loaded');
    };
  }, []);

  // Toggle search popup (add/remove 'search-active' class on body)
  useEffect(() => {
    if (isSearchActive) {
      document.body.classList.add('search-active');
    } else {
      document.body.classList.remove('search-active');
    }
  }, [isSearchActive]);

  // Close search popup on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsSearchActive(false);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);


  
  return (
    <>
      {/* Main Header */}
      <div id="sticky-header" className={`mediic_nav_manu ${isSticky ? 'sticky' : ''}`}>
        <div className="container-fluid">
          <div className="row align-items-center">
            {/* Logo */}
            <div className="col-lg-2 col-6">
              <div className="logo cursor-scale small">
                <Link className="logo_img" to="/" title="mediic">
                  <img className='logo1' src={logoImg} alt="logo" />
                </Link>
                <Link className="main_sticky" to="/" title="mediic">
                  <img className='logo1' src={logo2Img} alt="logo" />
                </Link>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="col-lg-10 d-none d-lg-block">
              <nav className="mediic_menu">
                <ul className="nav_scroll">
                  {/* Home Dropdown */}
                  <li>
                    <NavLink className="mdy-hover cursor-scale small" to="/">Home</NavLink>
                  </li>
                  <li><NavLink className="mdy-hover cursor-scale small" to="/about">Why Healthcare?</NavLink></li>
                  <li>
                    <NavLink className="mdy-hover cursor-scale small" to="#">Our Approach</NavLink>
                    {/* <ul className="sub-menu">
                      <li><Link to="/about">About Us</Link></li>
                      <li><Link to="/service">Our Service</Link></li>
                      <li><Link to="/team">Our Team</Link></li>
                      <li><Link to="/team-details">Team Details</Link></li>
                      <li><Link to="/project">Project</Link></li>
                      <li><Link to="/project-details">Project Details</Link></li>
                      <li><Link to="/appointment">Appointment</Link></li>
                      <li><Link to="/testimonial">Testimonial</Link></li>
                      <li><Link to="/404">404</Link></li>
                      <li><Link to="/faq">Faqs</Link></li>
                      <li><Link to="/contact">Contact Us</Link></li>
                    </ul> */}
                  </li>
                  <li>
                    <NavLink className="mdy-hover cursor-scale small" to="#">Services</NavLink>
                    <ul className="sub-menu">
                      <li><Link to="/service">Our Service</Link></li>
                      <li><Link to="/service-details">Certifications</Link></li>
                    </ul>
                  </li>
                  <li>

                  </li>
                  <li><NavLink className="mdy-hover cursor-scale small" to="/contact">Contact Us</NavLink></li>
                </ul>

                <div className="mediic-right-side cursor-scale small">
                  {/* Search Button */}
                  <div className="search-box-btn search-box-outer" onClick={() => setIsSearchActive(true)}>
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </div>








                  {/* Appointment Button */}
                  <div className="mediic-button">
                    <Link
                      to={localStorage.getItem("isLoggedIn") === "true" ? "/dashboard" : "/login"}
                      className="wallet-header"
                    >
                      Get Dashboard
                      <img src={arrowImg} alt="" />
                      <div className="mediic-hover-btn hover-btn"></div>
                      <div className="mediic-hover-btn hover-btn2"></div>
                      <div className="mediic-hover-btn hover-btn3"></div>
                      <div className="mediic-hover-btn hover-btn4"></div>
                    </Link>
                  </div>

                  {/* Sidebar (info-group) Button */}
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

      {/* Search Popup (exact HTML from original) */}
      <div className={`search-popup ${isSearchActive ? 'search-active' : ''}`}>
        <button className="close-search style-two" onClick={() => setIsSearchActive(false)}>
          <span className="flaticon-multiply"><i className="fa-solid fa-xmark"></i></span>
        </button>
        <form method="get" action="#">
          <div className="form-group">
            <input type="search" name="search-field" value="" placeholder="Search..." required />
            <button type="submit"><i className="fa fa-search"></i></button>
          </div>
        </form>
      </div>

      {/* Info Group Sidebar (xs-sidebar-group) */}
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
              {/* Sidebar content as per original */}
              <div className="sidebar-info-contents">
                <div className="content-thumb-box">
                  <img src="assets/images/resource/sidebar-thumb.png" alt="" />
                </div>
                <div className="contact-info">
                  <h2>About Company</h2>
                  <p>Rapidiously expedite strategic expertise with customer directed synergy. Appropriately restore performance based manufactured products.</p>
                  <ul className="list-style-one">
                    <li><span className="icon fa-phone"></span>+1 800 123 456 789</li>
                    <li><span className="icon fa-envelope"></span>info@example.com</li>
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


      {/* Mobile Menu Drawer (meanmenu replacement) */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-drawer-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="mobile-menu-drawer" onClick={e => e.stopPropagation()}>
            <button className="close-mobile-menu" onClick={() => setIsMobileMenuOpen(false)}>✕</button>
            <nav className="mediic_menu">
              <ul className="nav_scroll">
                <li>
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


               <div className="mediic-button01">
                    <Link
                      to={localStorage.getItem("isLoggedIn") === "true" ? "/dashboard" : "/login"}
                      className="wallet-header01"
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

      

      {/* Original mobile-menu-area (for meanmenu) - hide because we use custom drawer */}
      <div className="mobile-menu-area d-none"></div>
    </>
  );
};

export default Header;