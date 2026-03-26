import React from "react";
import img1 from "../assets/images/blog-img1.jpg";
import img2 from "../assets/images/blog-img2.jpg";
import img3 from "../assets/images/blog-img3.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

export const MediaSlider = () => {
  // Create an array of slide data for easier management
  const slides = [
    {
      id: 1,
      image: img1,
      category: "category",
      title: "Pay for Purchases Directly with Your Cryptocurrency",
      date: "February 21, 2020",
    },
    {
      id: 2,
      image: img2,
      category: "category",
      title: "First Long-Term Bitcoin Option Price of $10,000 Launched by STMX",
      date: "February 18, 2020",
    },
    {
      id: 3,
      image: img3,
      category: "category",
      title: "Pay for Purchases Directly with Your Cryptocurrency",
      date: "February 05, 2020",
    },
    {
      id: 4,
      image: img1,
      category: "category",
      title: "Pay for Purchases Directly with Your Cryptocurrency",
      date: "January 20, 2020",
    },
    {
      id: 5,
      image: img2,
      category: "category",
      title: "First Long-Term Bitcoin Option Price of $10,000 Launched by STMX",
      date: "February 18, 2020",
    },
    {
      id: 6,
      image: img3,
      category: "category",
      title: "First Long-Term Bitcoin Option Price of $10,000 Launched by STMX",
      date: "January 12, 2020",
    },
  ];

  return (
    <div className="blog-section white-bg p-tb diamond-layout" id="press">
      <div className="container">
        <div className="text-center">
          <h2 className="section-heading1">We are in the Media</h2>
        </div>

        <div className="row blogmain">
          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={30}
            slidesPerView={3}
            loop={true}
            breakpoints={{
              0: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="blog-slider"
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div className="blog-list">
                  <div
                    className="blog-list-img"
                    style={{ backgroundImage: `url(${slide.image})` }}
                  >
                    <a href="#"></a>
                  </div>

                  <div className="blog-list-desc">
                    <span className="blog-category-meta">
                      <a href="#">{slide.category}</a>
                    </span>
                    <h4>
                      <a href="#">{slide.title}</a>
                    </h4>
                    <span className="blog-date-meta">{slide.date}</span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};