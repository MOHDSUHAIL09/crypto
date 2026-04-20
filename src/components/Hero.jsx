// src/components/Hero.jsx
import React from 'react';
import { Link } from 'react-router-dom';

// Image imports
import heroThumb from '../assets/images/slider/thunb.png';
import tickIcon from '../assets/images/slider/tick.png';
import arrowIcon from '../assets/images/resource/arrow.png';
import shape1 from '../assets/images/slider/shape1.png';
import heartIcon from '../assets/images/slider/heart.png';

const Hero = () => {
  return (
    <div className="hero-section d-flex align-items-center">
      <div className="container">
        <div className="row hero-bg align-items-center">
          {/* Left Content */}
          <div className="col-lg-6 col-md-6">
            <div className="hero-content">
              <h5 className="cursor-scale small">WELCOME TO OUR WEB</h5>
              <h1 className="cursor-scale">
                Building Wealth Through Healthcare &<span> Pharmaceutical Investments</span>
              </h1>
              <div className="mediic-btn cursor-scale small">
                <Link to="/about">
                  Start Healthcare Investing
                  <img src={arrowIcon} alt="icon" />
                </Link>
              </div>
              <div className="hero-mediic-service">
                <div className="mediic-service-bx">
                  <div className="mediic-service-inner-bx">
                    <div className="mediic-hero-icon cursor-scale small">
                      <img src={tickIcon} alt="icon" />
                    </div>
                    <div className="mediic-hero-content">
                      <h4 className="cursor-scale small">Best Medical</h4>
                      <p>Rapidiously reinvent long-term</p>
                    </div>
                  </div>
                </div>
                <div className="video__content">
                  <a
                    className="video-vemo-icon venobox vbox-item"
                    href="https://youtu.be/BS4TUd7FJSg"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="play-now">WATCH A VIDEO</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content with Images */}
          <div className="col-lg-6 col-md-6">
            <div className="hero-thumb">
              <img src={heroThumb} alt="hero" />
            </div>
            <div className="hero-all-shape">
              <div className="hero-shape">
                <img src={shape1} alt="shape" />
              </div>
              <div className="hero-shape2">
                <span className="wood-animation">
                  <img src={heartIcon} alt="heart" />
                </span>
              </div>
              <div className="hero-shape3">
                <div className="button">
                  <span>30+ research center</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

