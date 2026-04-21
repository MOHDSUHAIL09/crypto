import React from "react";
import investmentImg from "../assets/images/resource/bot.jpg";
import shap1 from '../assets/images/resource/shape1.png'

const AiPoweredInvestment = () => {
  return (
    <>
      <div className="team-section ">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="top-mediic-section text-center">
                <div className="mediic-section-title">
                  <h4>HEALTHCARE INVESTMENT SUCCESS</h4>
                  <h1>AI-POWERED HEALTHCARE INVESTMENT ANALYSIS</h1>
                </div>
              </div>
            </div>
            <div className="mediic-shape">
              <img src={shap1} alt="shape" />
            </div>
          </div>
          <div className="row">
            {/* Main feature box - using same team-single-box style */}
            <div className="col-lg-6 col-md-6">
              <div className="team-single-box.">
                <div className="team0-thumb">
                  <img className="team0-thumb1" src={investmentImg} alt="AI Investment Analysis" />
                </div>
              </div>
            </div>

            {/* Description box – using column to hold the text content */}
            <div className="col-lg-6 col-md-6">
              <div className="team-single-box" style={{ padding: "30px" }}>
                <div className="team-content">
                  <h4>Real-time AI Insights</h4>
                  <span>Clinical trials · Approvals · Trends</span>
                  <p style={{ marginTop: "20px", color: "#555" }}>
                    MANGO WEALTH PLANNER utilizes advanced AI algorithms to analyze
                    healthcare markets, predict pharmaceutical approvals, and optimize
                    hospital investment portfolios. Our proprietary Med-Analytica
                    platform provides real-time insights into clinical trial data,
                    regulatory changes, and healthcare spending trends.
                  </p>
                  <div className="team-icon" style={{ marginTop: "20px" }}>
                    <i className="fa-solid fa-chart-line"></i>
                  </div>
                </div>
                {/* keep same hover boxes for consistency */}
                <div className="mediic-hover-box hover-bx"></div>
                <div className="mediic-hover-box hover-bx2"></div>
                <div className="mediic-hover-box hover-bx3"></div>
                <div className="mediic-hover-box hover-bx4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AiPoweredInvestment;