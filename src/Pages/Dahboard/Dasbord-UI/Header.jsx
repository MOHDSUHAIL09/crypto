import React from "react";
import { FaHome, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../context/UserContext";
import "../../../assets/dashboardcss/css/Dashboard.css";

const Header = () => {

  const navigate = useNavigate();
  const { logoutUser } = useUser();

  const handleLogout = () => {

    logoutUser();

    localStorage.clear();
    sessionStorage.clear();

    navigate("/");

  };

  return (
    <header className="topbar">

      <div className="left">
        <FaHome className="Dasboard-icon"/>
        <h4>Dashboard</h4>
      </div>

      <div className="right">
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>

    </header>
  );

};

export default Header;