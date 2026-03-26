  import React from "react";
  import {
    FaUsers,
    FaThLarge,
    FaChartBar,
    FaUndo,
  } from "react-icons/fa";
  import { RiP2pFill } from "react-icons/ri";
  import { PiTreeView } from "react-icons/pi";
  import { useNavigate, useLocation } from "react-router-dom";
  import "../../../assets/dashboardcss/css/Dashboard.css";

  const menuItems = [
    { icon: <FaThLarge />, title: "Dashboard", path: "/dashboard" },
    { icon: <FaUsers />, title: "Downline-Team", path: "/dashboard/downline-team" },
    { icon: <RiP2pFill />, title: "Deposit To Deposit", path: "/dashboard/deposit2deposit" },
    { icon: <FaChartBar />, title: "Rewards Royalty", path: "/dashboard/Royalty" },
    { icon: <FaUndo />, title: "Rewards", path: "/dashboard/rewards" },
    { icon: <PiTreeView />, title: "TreeView", path: "/dashboard/TreeView" },
  ];

  const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation(); // current route

    return (
      <aside className="pro-sidebar">
        <div className="pro-sidebar-header">
          <img
            src="https://th.bing.com/th/id/OIP.QcwGS8N7YkTFkSEX-GE87gHaHa?w=168&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"
            className="pro-logo"
          />
        </div>

        <ul className="pro-menu">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={`pro-item ${
                location.pathname === item.path ? "active" : ""
              }`}
              onClick={() => navigate(item.path)}
              title={item.title}
            >
              {item.icon}
            </li>
          ))}
        </ul>
      </aside>
    );
  };

  export default Sidebar;