// src/components/Service.jsx
import React from 'react';
import { Link } from 'react-router-dom';

// Image imports
import shapeImg from '../assets/images/resource/shape1.png';
import serviceBg from '../assets/images/resource/service-bg.png';
import serviceSmallBg from '../assets/images/resource/service-small-bg.png';
import serviceIcon1 from '../assets/images/resource/service-icon.png';
import serviceIcon2 from '../assets/images/resource/service-icon2.png';
import serviceIcon3 from '../assets/images/resource/service-icon3.png';
import serviceIcon4 from '../assets/images/resource/service-icon4.jpg';
// import serviceIcon5 from '../assets/images/resource/service-icon5.png';
import arrowImg from '../assets/images/resource/arrow.png';

const Service = () => {
  // Service data array with title, icon, paragraph, and className
  const services = [
    {
      title: 'Essential Services',
      icon: serviceIcon1,
      paragraph: 'Healthcare remains essential regardless of economic conditions, providing stable returns and consistent growth. The aging global population and rising chronic diseases ensure sustained demand.',
      className: ''
    },
    {
      title: 'Innovation Driven',
      icon: serviceIcon2,
      paragraph: 'Pharmaceutical R&D and biotech innovations create breakthrough investment opportunities. The global pharmaceutical market is projected to reach $1.5 trillion by 2025.',
      className: ''
    },
    {
      title: 'Global Expansion',
      icon: serviceIcon3,
      paragraph: 'Emerging markets present significant growth opportunities as healthcare access expands. Developing countries are increasing healthcare spending at double-digit rates annual',
      className: ''
    },
    {
      title: 'Regulated Security',
      icon: serviceIcon4,
      paragraph: 'Stringent regulations and patent protections provide investment security and competitive advantages in pharmaceutical and medical device sectors.',
      className: 'update'
    },
    // {
    //   title: 'Internal Medicine',
    //   icon: serviceIcon5,
    //   paragraph: 'Comprehensive adult healthcare focusing on prevention, diagnosis, and management of chronic diseases such as diabetes, hypertension, and heart conditions.',
    //   className: 'update'
    // },
  ];

  return (
    <div className="service-section">
      <div className="container-fluid">
        <div className="row">
          <div className="top-mediic-section">
            <div className="mediic-section-title text-center">
              <h4>our mediic services</h4>
              <h1>Investment advantages</h1>
            </div>
          </div>
        </div>
        <div className="mediic-shape">
          <img src={shapeImg} alt="shape" />
        </div>
     
        <div className="row service-bg p-4"> 
          <section className="mediic-service-box">
            <div className="category_container">
              {services.map((service, idx) => (
                <div key={idx} className={`content ${service.className}`}>
                  <img src={serviceBg} className="professio_image" alt="Profession" />
                  <img src={serviceSmallBg} className="profile_image" alt="Profile" />
                  <div className="service-content">
                    <div className="medical-icon">
                      <img className='medical-icon1' src={service.icon}  alt="icon" style={{width: "80px"}} />
                    </div>
                    <h3 className="service-title">{service.title}</h3>
                  </div>
                  <div className="wrapper">
                    <div className="profile_quote">
                      <p>{service.paragraph}</p>
                      <div className="mediic-button">
                        <Link to="/appointment">
                          Read More
                          <img src={arrowImg} alt="icon" />
                          <div className="mediic-hover-btn hover-btn"></div>
                          <div className="mediic-hover-btn hover-btn2"></div>
                          <div className="mediic-hover-btn hover-btn3"></div>
                          <div className="mediic-hover-btn hover-btn4"></div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <div className="service-bottom text-center">
            <span>
              <p>Click any of the above services to learn more</p>
              <Link to="/service-details">View Our All Services</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Service;