// import React, { useState, useEffect } from "react";
// import {
//   FaUsers,
//   FaThLarge,
//   FaChartBar,
//   FaUndo,
// } from "react-icons/fa";
// import { RiP2pFill } from "react-icons/ri";
// import { PiTreeView } from "react-icons/pi";
// import { useNavigate, useLocation } from "react-router-dom";
// import "../../../assets/dashboardcss/css/Dashboard.css";

// const menuItems = [
//   { icon: <FaThLarge />, title: "Dashboard", path: "/dashboard" },
//   { icon: <FaUsers />, title: "Downline-Team", path: "/dashboard/downline-team" },
//   { icon: <RiP2pFill />, title: "Deposit To Deposit", path: "/dashboard/deposit2deposit" },
//   { icon: <FaChartBar />, title: "Rewards Royalty", path: "/dashboard/Royalty" },
//   { icon: <FaUndo />, title: "Rewards", path: "/dashboard/rewards" },
//   { icon: <PiTreeView />, title: "TreeView", path: "/dashboard/TreeView" },
// ];

// const Sidebar = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth <= 768);
//     };
//     checkMobile();
//     window.addEventListener("resize", checkMobile);
//     return () => window.removeEventListener("resize", checkMobile);
//   }, []);

//   return (
//     <aside className="pro-sidebar">
//       <div className="pro-sidebar-header">
//         <img
//           src="https://th.bing.com/th/id/OIP.QcwGS8N7YkTFkSEX-GE87gHaHa?w=168&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"
//           className="pro-logo"
//           alt="logo"
//         />
//       </div>

//       <ul className="pro-menu">
//         {menuItems.map((item, index) => (
//           <li
//             key={index}
//             className={`pro-item ${
//               location.pathname === item.path ? "active" : ""
//             }`}
//             onClick={() => navigate(item.path)}
//             title={!isMobile ? item.title : ""}  
//           >
//             {item.icon}
//           </li>
//         ))}
//       </ul>
//     </aside>
//   );
// };

// export default Sidebar;




import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaThLarge,
  FaChartBar,
  FaUndo,
} from "react-icons/fa";
import { RiP2pFill } from "react-icons/ri";
import { PiTreeView, PiHandWithdrawBold } from "react-icons/pi";
import { useNavigate, useLocation } from "react-router-dom";
import "../../../assets/dashboardcss/css/Dashboard.css";

const menuItems = [
  { icon: <FaThLarge />, title: "Dashboard", path: "/dashboard" },
  { icon: <FaUsers />, title: "Downline-Team", path: "/dashboard/downline-team" },
  { icon: <RiP2pFill />, title: "Deposit To Deposit", path: "/dashboard/deposit2deposit" },
  { icon: <FaChartBar />, title: "Rewards Royalty", path: "/dashboard/Royalty" },
  { icon: <FaUndo />, title: "Rewards", path: "/dashboard/rewards" },
  { icon: <PiHandWithdrawBold />,title: "Capital Payout", path: "/dashboard/capitalpayout" },
  { icon: <PiTreeView />, title: "TreeView", path: "/dashboard/TreeView" },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
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
            <img
              src="https://th.bing.com/th/id/OIP.QcwGS8N7YkTFkSEX-GE87gHaHa?w=168"
              className="pro-logo"
              alt="logo"
            />
          </div>

          <ul className="pro-menu">
            {menuItems.map((item, index) => (
              <li
                key={index}
                className={`pro-item ${location.pathname === item.path ? "active" : ""
                  }`}
                onClick={() => navigate(item.path)}
                title={!isMobile ? item.title : ""}
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

          <div className="pro-item" onClick={() => navigate("/dashboard")}>
            <FaThLarge />
             <span className="nav-text">Dashboard</span>
          </div>

          <div className="pro-item me-5" onClick={() => navigate("/dashboard/downline-team")}>
            <FaUsers />
            <span className="nav-text">Team</span>
          </div>

          {/* ✅ Floating Animated Menu */}
          <div className={`floating-menu ${menuOpen ? "show" : ""}`}>
            <div className="float-icon" onClick={() => navigate("/dashboard/deposit2deposit")}>
              <RiP2pFill />
            </div>

            <div className="float-icon" onClick={() => navigate("/dashboard/Royalty")}>
              <FaChartBar />
            </div>

            <div className="float-icon" onClick={() => navigate("/dashboard/capitalpayout")}>
              <PiHandWithdrawBold />
            </div>
          </div>

          {/* ✅ Center Button */}
          <div className="center-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? "✕" : "+"}
          </div>

          <div className="pro-item" onClick={() => navigate("/dashboard/rewards")}>
            <FaUndo />
            <span className="nav-text">Rewards</span>
          </div>

          <div className="pro-item" onClick={() => navigate("/dashboard/TreeView")}>
            <PiTreeView />
            <span className="nav-text">Tree</span>
          </div>

        </div>
      )}
    </>
  );
};

export default Sidebar;