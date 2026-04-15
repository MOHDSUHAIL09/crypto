import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import "../../assets/dashboardcss/css/Dashboard.css";

const Income = () => {
  const navigate = useNavigate();

  const { userData, loading } = useUser();

  // Modified function to accept type parameter
  const goToPage = (type) => {
    navigate(`/dashboard/accstatement?type=${type}`);
  };

  

  // Loading state
  if (loading && !userData) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-white">Fetching Income Details...</p>
      </div>
    );
  }

  return (
    <div className="flowchart-container ">
      {/* 🏠 MAIN NODE: All Income */}
      <div
        className="p-3 flowchart-node wallet-buttton"
        onClick={() => goToPage("ALL")}
        style={{ cursor: 'pointer' }}
      >
        All income <br />
        <strong>{(userData.Working || 0).toFixed(2)}</strong>
      </div>

      <div className="flowchart-line-vertical"></div>
      <div className="flowchart-line-horizontal"></div>

      <div className="flowchart-row">

        {/* 🟢 Column 1: Level & Matching */}
        <div className="flowchart-column">
          <div className="flowchart-node flowchart-green" onClick={() => goToPage("LEVEL INCOME")}>
            M-Subscription Level Income <br />
            <span style={{ color: "#105614", fontWeight: "700" }}>
              ${userData?.LevelIncome || 0}
            </span>
          </div>
          <div className="flowchart-line-vertical-small"></div>
          <div className="flowchart-node flowchart-orange" onClick={() => goToPage("MATCHING INCOME")}>
            M-Subscription Matching Income <br />
            <span style={{ color: "#105614", fontWeight: "700" }}>
              ${userData?.MatchingBonus || 0}
            </span>
          </div>
        </div>


        {/* 🟢 Column 2: IB & Reward */}
        <div className="flowchart-column">
          <div className="flowchart-node flowchart-green" onClick={() => goToPage("TRADING PASSIVE INCOME")}>
            Trading Passive Income <br />
            <span style={{ color: "#105614", fontWeight: "700" }}>
              ${userData?.TradingPassiveIncome || 0}
            </span>
          </div>
          <div className="flowchart-line-vertical-small"></div>

          <div className="flowchart-column">
            <div className="flowchart-node flowchart-green" onClick={() => goToPage("LOST IB INCOME")}>
              IB Income <br />
              <span style={{ color: "#105614", fontWeight: "700" }}>
                ${userData?.IBIncome || 0}
              </span>
            </div>
          </div>



        </div>

        {/* 🟢 Column 3: Royalty & Profit */}
        <div className="flowchart-column">
          <div className="flowchart-node flowchart-green" onClick={() => goToPage("ALL")}>
            Royalty Income <br />
            <span style={{ color: "#105614", fontWeight: "700" }}>
              ${userData?.RoyaltyIncome || 0}
            </span>
          </div>
          <div className="flowchart-line-vertical-small"></div>

          <div className="flowchart-node flowchart-orange" onClick={() => goToPage("ALL")}>
            Reward Income <br />
            <span style={{ color: "#105614", fontWeight: "700" }}>
              ${userData?.Reward || 0}
            </span>
          </div>
        </div>

        {/* 🟢 Column 4: Current Bonus & Withdrawal */}
        <div className="flowchart-column">
          <div className="flowchart-node flowchart-green" onClick={() => goToPage("ALL")}>
            Current Bonus <br />
            <span style={{ color: "#105614", fontWeight: "700" }}>
              ${userData?.Remaining || 0}
            </span>
          </div>
          <div className="flowchart-line-vertical-small"></div>
          <div className="flowchart-node flowchart-orange" onClick={() => goToPage("FUND WITHDRAWAL")}>
            Withdrawal <br />
            <span style={{ color: "#105614", fontWeight: "700" }}>
              ${userData?.withdrawal || 0}
            </span>
          </div>
        </div>

        <div className="flowchart-node flowchart-orange" onClick={() => goToPage("ALL")}>
          Company Profit <br />
          <span style={{ color: "#105614", fontWeight: "700" }}>
            ${userData?.notvalue || 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Income;