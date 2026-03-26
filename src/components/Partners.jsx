import React from 'react';
import brandLogo1 from "../assets/images/brand-logo1.png";
import brandLogo2 from "../assets/images/brand-logo2.png";
import brandLogo3 from "../assets/images/brand-logo3.png";
import brandLogo4 from "../assets/images/brand-logo4.png";
import brandLogo5 from "../assets/images/brand-logo5.png";

const Partners = () => {
  return (
    <>
      <div className="partner-logo p-tb white-sec dark-gray-bg">
        <div className="container">
          <div className="text-center">
            <h2 className="section-heading1">
              <span>Partners</span>
            </h2>
          </div>
          
          <div className="partner-logo-grid">
            <div className="item">
              <img src={brandLogo1} alt="Brand Logo 1" />
            </div>
            <div className="item">
              <img src={brandLogo2} alt="Brand Logo 2" />
            </div>
            <div className="item">
              <img src={brandLogo5} alt="Brand Logo 5" />
            </div>
            <div className="item">
              <img src={brandLogo4} alt="Brand Logo 4" />
            </div>
          </div>
          
          <div className="partner-logo-grid">
            <div className="item">
              <img src={brandLogo3} alt="Brand Logo 3" />
            </div>
            <div className="item">
              <img src={brandLogo1} alt="Brand Logo 1" />
            </div>
            <div className="item">
              <img src={brandLogo2} alt="Brand Logo 2" />
            </div>
            <div className="item">
              <img src={brandLogo5} alt="Brand Logo 5" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Partners;