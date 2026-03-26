import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import lightLogo from "../../../assets/images/logo.png";
import darkLogo from "../../../assets/images/dark-logo.png";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector("header");
      if (!header) return;

      if (window.scrollY > 50) header.classList.add("fixed");
      else header.classList.remove("fixed");
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="header">

  
      <div className="logo">
         <img className="light" src={lightLogo} alt="logo" />
         <img className="dark" src={darkLogo} alt="logo" /> 
      </div>


      <div className="main-menu">

        <div
          className={`menu-icon ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        <nav className={`onepage ${menuOpen ? "show" : ""}`}>
          <ul>

            <li className="active"><a href="#top">Home</a></li>
            <li><a href="#about">About ico</a></li>
            <li><a href="#token">Token</a></li>
            <li><a href="#roadmap">Roadmap</a></li>
            <li><a href="#team">Team</a></li>
            <li><a href="#press">Press</a></li>

            {/* 🔥 DASHBOARD BUTTON */}
            <li className="nav-btn">
              <button
                onClick={() => {
                  const isLoggedIn =
                    localStorage.getItem("isLoggedIn") === "true";

                  if (isLoggedIn) {
                    navigate("/dashboard");  
                  } else {
                    navigate("/login");      
                  }
                }}
                className="wallet-header"
              >
                Dashboard
              </button>
            </li>

          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;