// src/components/Medical.jsx
import React from 'react';
import { Link } from 'react-router-dom';

// Image imports
// import serviceIcon1 from '../assets/images/resource/service-icn.png';
import serviceIcon2 from '../assets/images/resource/service-icn3.png';
import serviceIcon3 from '../assets/images/resource/service-icn2.png';
import arrowImg from '../assets/images/resource/arrow.png';

const Medical = () => {
  return (
    <div className="services-section">
      <div className="container">
        <div className="row">
          <div className="top-mediic-section">
            <div className="mediic-section-title white text-center">
              <h4>Investment opportunities</h4>
              <h1>Investment opportunities</h1>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-4 col-md-6">
            <div className="service-single-box">
              <div className="service-head">
                <div className="serivce-icon">

                  <i className="fa-solid fa-lightbulb" style={{ fontSize: "45px", color: "#fff", marginTop: "20px", opacity: 0.8 }}></i>
                </div>
                <div className="service-category">
                  <a href="#">INVEST</a>
                </div>
              </div>
              <div className="service-content">
                <h4>INFRASTRUCTURE</h4>
                <p>
                  Investing in modern hospital facilities and healthcare infrastructure projects is essential for improving the overall quality, accessibility, and efficiency of healthcare services.
                </p>
              </div>
              <div className="mediic-button">
                <Link to="/signup">
                  Read More
                  <img src={arrowImg} alt="arrow" />
                  <div className="mediic-hover-btn hover-btn"></div>
                  <div className="mediic-hover-btn hover-btn2"></div>
                  <div className="mediic-hover-btn hover-btn3"></div>
                  <div className="mediic-hover-btn hover-btn4"></div>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="service-single-box">
              <div className="service-head">
                <div className="serivce-icon">
                  <img src={serviceIcon2} alt="icon" />
                </div>
                <div className="service-category">
                  <a href="#">INVEST</a>
                </div>
              </div>
              <div className="service-content">
                <h4>PHARMACEUTICALS</h4>
                <p>
                  Strategic investments in drug development and pharmaceutical manufacturing play a crucial role in strengthening the healthcare system and ensuring.
                </p>
              </div>
              <div className="mediic-button">
                <Link to="/appointment">
                  Read More
                  <img src={arrowImg} alt="arrow" />
                  <div className="mediic-hover-btn hover-btn"></div>
                  <div className="mediic-hover-btn hover-btn2"></div>
                  <div className="mediic-hover-btn hover-btn3"></div>
                  <div className="mediic-hover-btn hover-btn4"></div>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="service-single-box">
              <div className="service-head">
                <div className="serivce-icon">
                  <img src={serviceIcon3} alt="icon" />
                </div>
                <div className="service-category">
                  <a href="#">INVEST</a>
                </div>
              </div>
              <div className="service-content">
                <h4>BIOTECH VENTURES</h4>
                <p>
                  Early-stage investments in innovative biotechnology and medical research are vital for driving breakthroughs in healthcare and improving long-term patient outcomes.
                </p>
              </div>
              <div className="mediic-button">
                <Link to="/appointment">
                  Read More
                  <img src={arrowImg} alt="arrow" />
                  <div className="mediic-hover-btn hover-btn"></div>
                  <div className="mediic-hover-btn hover-btn2"></div>
                  <div className="mediic-hover-btn hover-btn3"></div>
                  <div className="mediic-hover-btn hover-btn4"></div>
                </Link>
              </div>
            </div>
          </div>
          {/* <div className="col-lg-3 col-md-6">
            <div className="service-single-box">
              <div className="service-head">
                <div className="serivce-icon">
                  <img src={serviceIcon3} alt="icon" />
                </div>
                <div className="service-category">
                  <a href="#">INVEST</a>
                </div>
              </div>
              <div className="service-content">
                <h4>HEALTH TECH</h4>
                <p>
                  Investing in digital health solutions, telemedicine, and healthcare technology innovations is essential for making healthcare more accessible, efficient, and patient-centric.
                </p>
              </div>
              <div className="mediic-button">
                <Link to="/appointment">
                  Read More
                  <img src={arrowImg} alt="arrow" />
                  <div className="mediic-hover-btn hover-btn"></div>
                  <div className="mediic-hover-btn hover-btn2"></div>
                  <div className="mediic-hover-btn hover-btn3"></div>
                  <div className="mediic-hover-btn hover-btn4"></div>
                </Link>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Medical;