// src/components/Adventure.jsx
import React, { useEffect, useRef } from 'react';
import Swiper from 'swiper';
import { Mousewheel, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import '../assets/Css/Main.css'


// Image imports
import aboutImg from '../assets/images/resource/about-3.webp';
import aboutIcon from '../assets/images/resource/about-icon.png';
import aboutIcon2 from '../assets/images/resource/about-icon2.png';

const Adventure = () => {
  const swiperRef = useRef(null);

  useEffect(() => {
    const swiper = new Swiper(swiperRef.current, {
      modules: [Mousewheel, Pagination],   // ← mousewheel ke liye zaroori
      direction: 'vertical',
      slidesPerView: 2,
      spaceBetween: 30,
      mousewheel: true,                    // ← mouse scroll enable
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });

    return () => {
      if (swiper) swiper.destroy(true, true);
    };
  }, []);

  return (
    <div className="about-section">
      <div className="container">
        <div className="row about-bg align-items-center">
          <div className="col-lg-6 pl-0">
            <div className="about-thumb">
              <img className='about-thumb2' src={aboutImg} alt="about" />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="top-mediic-section">
              <div className="mediic-section-title">
                <h4>about our medical</h4>
                <h1>Why Invest in </h1>
                <h1><span className='span1'>Healthcare?</span></h1>
              </div>
              <div className="mediic-desc">
                <p>
               The healthcare sector offers recession-resistant growth, consistent demand, and significant innovation potential. Our strategic approach focuses on:
                </p>
              </div>
            </div>

            {/* Swiper Slider */}
            <div className="swiper about" ref={swiperRef}>
              <div className="swiper-wrapper">
                {/* Slide 1 */}
                <div className="swiper-slide">
                  <div className="about-mediic-service">
                    <div className="about-icon">
                      <img src={aboutIcon2} alt="icon" />
                    </div>
                    <div className="about-content">
                      <h3>Infection Prevention</h3>
                      <p>
                        Professional intellectual capital without enterprise
                        users Seamlessly matrix value e-commerce
                      </p>
                    </div>
                  </div>
                </div>
                {/* Slide 2 */}
                <div className="swiper-slide">
                  <div className="about-mediic-service">
                    <div className="about-icon upp">
                      <img src={aboutIcon} alt="icon" />
                    </div>
                    <div className="about-content">
                      <h3>Technological Advancements</h3>
                      <p>
                       Innovations like telemedicine, AI diagnostics, and modern equipment are transforming the industry.
                      </p>
                    </div>
                  </div>
                </div>
                {/* Slide 3 */}
                <div className="swiper-slide">
                  <div className="about-mediic-service">
                    <div className="about-icon">
                      <img src={aboutIcon2} alt="icon" />
                    </div>
                    <div className="about-content">
                      <h3>High Return Potential</h3>
                      <p>
                       With rising demand, healthcare investments often offer strong long-term returns.
                      </p>
                    </div>
                  </div>
                </div>
                {/* Slide 4 */}
                <div className="swiper-slide">
                  <div className="about-mediic-service">
                    <div className="about-icon">
                      <img src={aboutIcon2} alt="icon" />
                    </div>
                    <div className="about-content">
                      <h3>Social Impact</h3>
                      <p>
                    Investing in healthcare contributes to saving lives and improving community well-being.
                      </p>
                    </div>
                  </div>
                </div>
                {/* Slide 5 */}
                <div className="swiper-slide">
                  <div className="about-mediic-service">
                    <div className="about-icon upp">
                      <img src={aboutIcon} alt="icon" />
                    </div>
                    <div className="about-content">
                      <h3>Aging Population</h3>
                      <p>
                       Rising elderly population increases demand for medical care and services.e
                      </p>
                    </div>
                  </div>
                </div>
                {/* Slide 6 */}
                <div className="swiper-slide">
                  <div className="about-mediic-service">
                    <div className="about-icon">
                      <img src={aboutIcon2} alt="icon" />
                    </div>
                    <div className="about-content">
                      <h3>Consistent Growth</h3>
                      <p>
                       The healthcare sector continues to expand due to population growth and increasing life expectancy.       
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="swiper-pagination"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Adventure;