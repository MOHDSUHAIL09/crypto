import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Import images (adjust the paths based on your project structure)
import blogImg1 from '../assets/images/resource/blog.png';
import blogImg2 from '../assets/images/resource/blog2.png';
import blogImg3 from '../assets/images/resource/blog3.png';
import blogImg4 from '../assets/images/resource/blog4.png';
import shapeImg from '../assets/images/resource/shape1.png';

const Investmentprocess = () => {
  const slidesData = [
    {
      id: 1,
      img: blogImg1,
      title: 'Sector Analysis',
      description: 'We analyze healthcare trends, regulatory environments, and market gaps to identify high-potential investment opportunities',
    },
    {
      id: 2,
      img: blogImg2,
      title: 'Medical Due Diligence',
      description: 'Comprehensive evaluation of clinical data, regulatory pathways, and intellectual property for pharmaceutical investments',
    },
    {
      id: 3,
      img: blogImg3,
      title: 'Portfolio Construction',
      description: 'We build diversified healthcare portfolios balancing hospital infrastructure, pharmaceutical stocks, and biotech venture capital',
    },
    {
      id: 4,
      img: blogImg4,
      title: 'Continuous Monitoring',
      description: 'Ongoing tracking of FDA approvals, clinical trial results, and healthcare policy changes that impact investment performance',
    },
  ];

  return (
    <>
      <div className="blog-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="top-mediic-section section-border">
                <div className="mediic-section-title">
                  <h4>Investment</h4>
                  <h1>Our Healthcare Investment Process</h1>
                </div>
              </div>
            </div>
            <div className="mediic-shape">
              <img src={shapeImg} alt="shape" />
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <Swiper
                modules={[Autoplay, Pagination]}
                spaceBetween={30}
                slidesPerView={1}
      
                pagination={{ clickable: true }}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                breakpoints={{
                  640: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 2   },
                }}
                className="blog-list"
              >
                {slidesData.map((slide) => (
                  <SwiperSlide key={slide.id}>
                    <div className="blog-single-box">
                      <div className="blog-thumb">
                        <img className='blog-thumb-im' src={slide.img} alt="blog" />
                      </div>
                      <div className="blog-content">
                        <div className="blogs-category">    
                        </div>
                        <div className="blog-title">
                          <h2 className="cursor-scale small">
                            <a href="blog-details.html">{slide.title}</a>
                          </h2>
                        </div>
                        <div className="blog-description">
                          <p>{slide.description}</p>
                        </div>
                        <div className="blog-icons">
                          <a href="blog-details.html">
                            <i className="fa-solid fa-arrow-right-long"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Investmentprocess;