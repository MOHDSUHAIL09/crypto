import React from 'react';
import { Link } from 'react-router-dom';
import { FaHandHoldingMedical } from 'react-icons/fa';
import { BiSolidAnalyse } from "react-icons/bi";
import { BsFillBoxSeamFill } from "react-icons/bs";

// Import images
import secTitleImg from '../assets/images01/shapes/sec-title-s-2.png'; 
import investprosess from '../assets/images01/resource/investprosess.jpg'


const ChooseUsSection = () => {
  const features = [
    {
      id: 1,
      icon: <FaHandHoldingMedical/>,
      title: "Medical Due Diligence",
      text: " Data-driven pharmaceutical investment evaluation focused on clinical and regulatory success."
    },
    {
      id: 2,
      icon: <BsFillBoxSeamFill/>,
      title: "Continuous Monitoring",
      text: "Continuous tracking of FDA approvals, clinical trials, and healthcare policy impacts on investments"
    },
    {
      id: 3,
      icon: <BiSolidAnalyse/>,
      title: "Sector Analysis",
      text: "We identify promising healthcare investments through market analysis and regulatory insights."
    }
  ];

  return (
    <section className="choose-us-two">
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="choose-us-two__left">
              <div className="choose-us-two__thumb">
                <div className="choose-us-two__thumb__item">
                  <img src={investprosess} alt="laboix" className='choose-us-two01'/>
                </div>
                <div className="choose-us-two__thumb__shape">
                  {/* <img src={shape1} alt="laboix" /> */}
                </div>
                <div className="choose-us-two__thumb__shape choose-us-two__thumb__shape--two">
                  {/* <img src={shape2} alt="laboix" /> */}
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="choose-us-two__right">
              <div className="choose-us-two__top">
                <div className="sec-title sec-title--two text-start wow fadeInUp" data-wow-duration="700ms">
                  <h6 className="sec-title__tagline">
                    <img src={secTitleImg} alt="Why choose us" className="sec-title__img" />
                    Investment Process
                  </h6>
                  <h3 className="sec-title__title">
                    Our Healthcare Investment Process
                  </h3>
                </div>
                <p className="choose-us-two__top__text">
                  We analyze healthcare trends, regulatory environments, and market gaps to identify high-potential investment opportunities
                </p>
              </div>
              <ul className="choose-us-two__list list-unstyled">
                {features.map((feature) => (
                  <li className="choose-us-two__list__item" key={feature.id}>
                    <div className="choose-us-two__icon">
                      {feature.icon}
                    </div>
                    <div className="choose-us-two__content">
                      <h4 className="choose-us-two__title">{feature.title}</h4>
                      <p className="choose-us-two__text">{feature.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

    
    </section>
  );
};

export default ChooseUsSection;