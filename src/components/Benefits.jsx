import React from 'react'
import benefitIcon from "../assets/images/benefit-icon-1.png";
import icon1 from "../assets/images/benefit-icon-1.png";
import icon2 from "../assets/images/benefit-icon-2.png";
import icon3 from "../assets/images/benefit-icon-3.png";
import icon4 from "../assets/images/benefit-icon-4.png";
import icon5 from "../assets/images/benefit-icon-5.png";
import icon6 from "../assets/images/benefit-icon-6.png";


export const Benefits = () => {
  return (
   <>
   
   <div className="benefits p-tb black-bg white-sec diamond-layout">
                <div id="gold-tech-bg"></div>
                <div className="container">
                    <div className="text-center"><h2 className="section-heading1"><span>Benefits of Using Our Solution</span></h2></div>
                    <div className="sub-txt mw-850 text-center">
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean cursus tincidunt ultrices. Ut quis blandit dolor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean cursus tincidunt ultrices. Ut quis blandit dolor.</p>
                    </div>
                    <div className="row">
                        <div className="col-lg-4 col-md-6">
                            <div className="benefit-box text-center">
                                <div className="benefit-icon">
                            
                                    <img src={benefitIcon} className="flip-img" alt="flip" />
                                </div>
                                <div className="text">
                                    <h4>Safe and Secure</h4>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean cursus tincidunt ultrices. Ut quis blandit dolor. Ut laoreet sagittis arcu eu tristique.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="benefit-box text-center">
                                <div className="benefit-icon">
                                    <img src={icon2} className="flip-img" alt="Instant Exchange" />
                                </div>
                                <div className="text">
                                    <h4>Instant Exchange</h4>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean cursus tincidunt ultrices. Ut quis blandit dolor. Ut laoreet sagittis arcu eu tristique.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="benefit-box text-center">
                                <div className="benefit-icon">
                                    <img src={icon3} className="flip-img" alt="img" />
                                </div>
                                <div className="text">
                                    <h4>World Coverage</h4>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean cursus tincidunt ultrices. Ut quis blandit dolor. Ut laoreet sagittis arcu eu tristique.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="benefit-box text-center">
                                <div className="benefit-icon">
                                    <img src={icon4} className="flip-img" alt="Mobile Apps" />
                                </div>
                                <div className="text">
                                    <h4>Mobile Apps</h4>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean cursus tincidunt ultrices. Ut quis blandit dolor. Ut laoreet sagittis arcu eu tristique.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="benefit-box text-center">
                                <div className="benefit-icon">
                                    <img src={icon5} className="flip-img" alt="Strong Network" />
                                </div>
                                <div className="text">
                                    <h4>Strong Network</h4>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean cursus tincidunt ultrices. Ut quis blandit dolor. Ut laoreet sagittis arcu eu tristique.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="benefit-box text-center">
                                <div className="benefit-icon">
                                    <img src={icon6} className="flip-img" alt="Margin Trading" />
                                </div>
                                <div className="text">
                                    <h4>Margin Trading</h4>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean cursus tincidunt ultrices. Ut quis blandit dolor. Ut laoreet sagittis arcu eu tristique.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
   
   
   </>
  )
}
