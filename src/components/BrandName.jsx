// src/components/Brand.jsx
import React, { useEffect, useRef } from 'react';
import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/free-mode';

// Image imports
import bran1 from '../assets/images/resource/bran.png';
import bran2 from '../assets/images/resource/bran2.png';
import bran3 from '../assets/images/resource/bran3.png';
import bran4 from '../assets/images/resource/bran4.png';
import bran5 from '../assets/images/resource/bran5.png';


const Brand = () => {
  const swiperRef = useRef(null);

  useEffect(() => {
    // Initialize Swiper for brand slider
    const swiper = new Swiper(swiperRef.current, {
      spaceBetween: 30,
      freeMode: true,
      breakpoints: {
        0: { slidesPerView: 1 },
        480: { slidesPerView: 2 },
        600: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        992: { slidesPerView: 3 },
        1400: { slidesPerView: 5 },
        1920: { slidesPerView: 5 },
      },
    });

    return () => {
      if (swiper) swiper.destroy(true, true);
    };
  }, []);

  // Array of brand images for easier mapping
  const brandImages = [bran1, bran2, bran3, bran4, bran5];

  return (
    <div className="brand-section">
      <div className="container-fluid">
        <div className="row brand-bg">
          <div className="col-lg-12">
            <div className="swiper brand" ref={swiperRef}>
              <div className="swiper-wrapper">
                {/* Loop to create multiple slides (you can adjust count) */}
                {[...Array(10)].map((_, idx) => (
                  <div className="swiper-slide" key={idx}>
                    <div className="brand-single-box">
                      <div className="brand-thumb">
                        <img src={brandImages[idx % brandImages.length]} alt={`brand ${idx + 1}`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Brand;