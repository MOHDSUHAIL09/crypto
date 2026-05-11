import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay, Pagination } from 'swiper/modules';

// Styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

// Assets (Keep your existing imports)
import sliderBg1 from '../assets/images01/backgrounds/slider-1-1.png';
import sliderBg2 from '../assets/images01/backgrounds/slider-1-2.jpg';
import sliderBg3 from '../assets/images01/backgrounds/slider-1-3.jpg';
import heroShape1 from '../assets/images01/shapes/hero-1-1.png';
import heroShape2 from '../assets/images01/shapes/hero-1-2.png';
import heroShape3 from '../assets/images01/shapes/hero-1-3.png';
import heroShape4 from '../assets/images01/shapes/hero-1-4.png';

const MainSlider = () => {
  const slides = [
    { id: 1, bgImage: sliderBg1, subTitle: 'Innovative healthcare investment solutions', title: 'Building Wealth Through Healthcare & Pharmaceutical Investments' },
    { id: 2, bgImage: sliderBg2, subTitle: 'Advanced solutions for healthcare wealth creation', title: 'Profiting from Healthcare and Pharmaceutical Opportunities' },
    { id: 3, bgImage: sliderBg3, subTitle: 'Strategic investment opportunities in healthcare', title: 'Creating Long-Term Wealth with Healthcare & Pharma Investments' },
  ];

  return (
    <section className="main-slider-one">
      <Swiper
        modules={[EffectFade, Autoplay, Pagination]}
        effect="fade"
        loop={true}
        speed={1000}
        autoplay={{ delay: 7000, disableOnInteraction: false }}
        navigation={{
          nextEl: '.main-slider-nav__next',
          prevEl: '.main-slider-nav__prev',
        }}
        pagination={{
          el: '.main-slider-one__dots',
          clickable: true,
          // Swiper uses 'swiper-pagination-bullet', we map it to your CSS 'owl-dot'
          bulletClass: 'owl-dot', 
          bulletActiveClass: 'active',
          renderBullet: (index, className) => `<button class="${className}"></button>`,
        }}
        className="main-slider-one__carousel"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            {/* 
               The 'isActive' state provided by SwiperSlide 
               lets us inject the .active class your CSS needs
            */}
            {({ isActive }) => (
              <div className={`main-slider-one__item ${isActive ? 'active' : ''}`}>
                <div
                  className="main-slider-one__bg"
                  style={{ backgroundImage: `url(${slide.bgImage})` }}
                ></div>
                <div className="container">
                  <div className="row">
                    <div className="col-lg-7">
                      <div className="main-slider-one__content">
                        <h5 className="main-slider-one__sub-title">{slide.subTitle}</h5>
                        <h2 className="main-slider-one__title">{slide.title}</h2>
                        <div className="main-slider-one__btn">
                          <Link to="/login" className="laboix-btn laboix-btn--base">Get Started</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="main-slider-one__shape main-slider-one__shape--one">
                  <img src={heroShape1} alt="shape" className='heroShape1' />
                </div>
                <div className="main-slider-one__shape main-slider-one__shape--two">
                  <img src={heroShape2} alt="shape" />
                </div>
                <div className="main-slider-one__shape main-slider-one__shape--three">
                  <img src={heroShape3} alt="shape" className="heroShape3" />
                </div>
                <div className="main-slider-one__shape main-slider-one__shape--fore">
                  <img src={heroShape4} alt="shape" />
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}

        <div className="main-slider-nav">
          <div className="main-slider-nav__prev"><i className="fa fa-angle-left"></i></div>
          <div className="main-slider-nav__next"><i className="fa fa-angle-right"></i></div>
        </div>

      </Swiper>
    </section>
  );
};

export default MainSlider;
