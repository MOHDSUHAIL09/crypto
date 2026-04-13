import React, { useState, useEffect, useRef } from "react";
import {
  FaUsers,
  FaThLarge,
  FaChartBar,
  FaUndo,
} from "react-icons/fa";
import { RiP2pFill } from "react-icons/ri";
import { PiTreeView, PiHandWithdrawBold } from "react-icons/pi";
import { useNavigate, useLocation } from "react-router-dom";
import { MdSupportAgent } from "react-icons/md";
import logo from "../../../assets/images/mango_logo.png";
import "../../../assets/dashboardcss/css/Dashboard.css";

const menuItems = [
  { icon: <FaThLarge />, title: "Dashboard", path: "/dashboard" },
  { icon: <FaUsers />, title: "Downline-Team", path: "/dashboard/downline-team" },
  { icon: <RiP2pFill />, title: "Deposit To Deposit", path: "/dashboard/deposit2deposit" },
  { icon: <FaChartBar />, title: "Rewards Royalty", path: "/dashboard/Royalty" },
  { icon: <FaUndo />, title: "Rewards", path: "/dashboard/rewards" },
  { icon: <PiHandWithdrawBold />, title: "Capital Payout", path: "/dashboard/capitalpayout" },
  { icon: <PiTreeView />, title: "TreeView", path: "/dashboard/TreeView" },
  { icon: <MdSupportAgent />, title: "Support", path: "/dashboard/Support" },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const floatingRef = useRef(null);

  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ Function to close floating menu
  const closeMenu = () => {
    setMenuOpen(false);
  };

  // ✅ Handle navigation + close menu
  const handleNavigate = (path) => {
    navigate(path);
    closeMenu();
  };

  // ✅ Detect click outside floating menu to close (optional but good UX)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuOpen &&
        floatingRef.current &&
        !floatingRef.current.contains(event.target) &&
        !event.target.closest(".center-btn") // exclude center button
      ) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      {/* ✅ Desktop Sidebar */}
      {!isMobile && (
        <aside className="pro-sidebar">
          <div className="pro-sidebar-header">
            <img src={logo} className="pro-logo" alt="logo" />
          </div>
          <ul className="pro-menu">
            {menuItems.map((item, index) => (
              <li
                key={index}
                className={`pro-item ${location.pathname === item.path ? "active" : ""}`}
                onClick={() => navigate(item.path)}
                title={item.title}
              >
                {item.icon}
              </li>
            ))}
          </ul>
        </aside>
      )}

      {/* ✅ Mobile Bottom Navbar */}
      {isMobile && (
        <div className="mobile-bottom-nav">
          {/* Dashboard */}
          <div className="pro-item" onClick={() => handleNavigate("/dashboard")}>
            <FaThLarge />
            <span className="nav-text">Dashboard</span>
          </div>

          {/* Downline Team */}
          <div className="pro-item me-5" onClick={() => handleNavigate("/dashboard/downline-team")}>
            <FaUsers />
            <span className="nav-text">Team</span>
          </div>

          {/* ✅ Floating Animated Menu – with ref to detect outside clicks */}
          <div ref={floatingRef} className={`floating-menu ${menuOpen ? "show" : ""}`}>
            <div className="float-icon" onClick={() => handleNavigate("/dashboard/deposit2deposit")}>
              <RiP2pFill />
              <span className="float-text">P2P</span>
            </div>
            <div className="float-icon" onClick={() => handleNavigate("/dashboard/Royalty")}>
              <FaChartBar />
              <span className="float-text">Royalty</span>
            </div>
            <div className="float-icon" onClick={() => handleNavigate("/dashboard/capitalpayout")}>
              <PiHandWithdrawBold />
              <span className="float-text">Withdraw</span>
            </div>
            <div className="float-icon" onClick={() => handleNavigate("/dashboard/Support")}>
              <MdSupportAgent />
              <span className="float-text">Support</span>
            </div>
          </div>

          {/* Center Button */}
          <div className="center-btn" onClick={() => setMenuOpen(!menuOpen)}>
            
            <button className="modal-close01">✕</button>
            
          </div>

          {/* Rewards */}
          <div className="pro-item" onClick={() => handleNavigate("/dashboard/rewards")}>
            <FaUndo />
            <span className="nav-text">Rewards</span>
          </div>

          {/* TreeView */}
          <div className="pro-item" onClick={() => handleNavigate("/dashboard/TreeView")}>
            <PiTreeView />
            <span className="nav-text">Tree</span>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;