import React from 'react';
import testiImg from '../assets/images/resource/testi.png';
import quoteImg from '../assets/images/resource/quote3.png';

const InvestmentProcess = () => {
  return (
    <>
      <div className="testimonial-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="top-mediic-section section-border">
                <div className="mediic-section-title white">
                  <h4>Healthcare feedback</h4>
                  <h1>Why Choose Mango Wealth Planner for Healthcare?</h1>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4 pr-0">
              <div className="testimonial-thumb">
                <img src={testiImg} alt="testimonial" />
              </div>
            </div>
            <div className="col-lg-1 pl-0 pr-0"></div>
            <div className="col-lg-7 pl-0">
              <div className="row">
                <div className="col-lg-12">
                  <div className="testimonial-single-slide">
                    <div className="testi-icon">
                      <img src={quoteImg} alt="quote" />
                    </div>
                    <div className="testi-desc">
                      <p>
                        <span>Sector Specialization</span> Our team includes healthcare analysts, former pharmaceutical executives, and hospital administrators who understand industry dynamics.                  
                      </p>
                      <p><span>Due Diligence Excellence</span>We conduct thorough FDA approval tracking, clinical trial analysis, and regulatory pathway assessments for all investments.
                      </p>
                      <p><span>Impact + Returns</span>We identify investments that deliver both competitive financial returns and positive social impact in healthcare accessibility and innovation.
                      </p>
                    </div>
                    <div className="authors-info">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvestmentProcess;