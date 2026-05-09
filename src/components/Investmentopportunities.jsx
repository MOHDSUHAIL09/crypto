import React from 'react';
import { Link } from 'react-router-dom';

// Import images
import secTitleImg from '../assets/images01/shapes/sec-title-s-1.png';
import serviceBg from '../assets/images01/shapes/service-shape-1-1.png';
import serviceImg1 from '../assets/images01/service/service-1-1.png';
import serviceImg2 from '../assets/images01/service/service-1-2.png';
import serviceImg3 from '../assets/images01/service/service-1-3.png';


import serviceIcon2 from '../assets/images/resource/service-icn3.png';
import serviceIcon3 from '../assets/images/resource/service-icn2.png';
// import shapeService from '../assets/images01/shapes/shape-service.png';

const ServicePage = () => {
  return (
    <section className="service-page service-page--one">
      <div 
        className="service-page__bg" 
        style={{ backgroundImage: `url(${serviceBg})` }}
      ></div>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="sec-title text-center wow fadeInUp" data-wow-duration="1500ms">
              <h6 className="sec-title__tagline">
                <img src={secTitleImg} alt="our Service" className="sec-title__img" />
                Investment opportunities
              </h6>
              <h3 className="sec-title__title">
                Investment opportunities 
              </h3>
            </div>
          </div>
        </div>
        <div className="row gutter-y-30">
          <div className="col-md-6 col-lg-4">
            <div className="service-card wow fadeInUp" data-wow-duration="1500ms" data-wow-delay="400ms">
              <div className="service-card__inner">
                <div className="service-card__top mb-3">
                  <h3 className="service-card__title">
                    <Link to="/service-d-artificial"> INFRASTRUCTURE</Link>
                  </h3>
                  <div className="service-card__icon">
                     <i className="fa-solid fa-lightbulb" style={{ fontSize: "45px", color: "#fff", opacity: 0.8 }}></i>
                  </div>
                </div>
                <div className="service-card__thumb">
                  <div className="service-card__thumb__item">
                    <img src={serviceImg1} alt="Artificial intelligence" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="service-card wow fadeInUp" data-wow-duration="1500ms" data-wow-delay="600ms">
              <div className="service-card__inner">
                <div className="service-card__top mb-3">
                  <h3 className="service-card__title">
                    <Link to="/service-d-diagnoses">PHARMACEUTICALS</Link>
                  </h3>

                  <div className="service-card__icon">       
                   <img src={serviceIcon2} alt="icon" />  
                  </div>
                </div>
                <div className="service-card__thumb">
                  <div className="service-card__thumb__item">
                    <img src={serviceImg2} alt="Specialized genetic tests" />
                  </div>
                  {/* <div className="service-card__thumb__shape">
                    <img src={shapeService} alt="" />
                  </div> */}
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="service-card wow fadeInUp" data-wow-duration="1500ms" data-wow-delay="800ms">
              <div className="service-card__inner">
                <div className="service-card__top mb-3">
                  <h3 className="service-card__title">
                    <Link to="/service-d-genetic-tests">BIOTECH VENTURES</Link>
                  </h3>
                  <div className="service-card__icon">
                    <img src={serviceIcon3} alt="icon" />
                  </div>
                </div>
                <div className="service-card__thumb">
                  <div className="service-card__thumb__item">
                    <img src={serviceImg3} alt="Pathology testing" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicePage;