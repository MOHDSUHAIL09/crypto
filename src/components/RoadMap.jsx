import React from 'react'
import icon1 from "../assets/images/timeline-icon-1.png";
import icon2 from "../assets/images/timeline-icon-2.png";
import icon3 from "../assets/images/timeline-icon-3.png";
import icon4 from "../assets/images/timeline-icon-4.png";
import icon5 from "../assets/images/timeline-icon-5.png";
import icon6 from "../assets/images/timeline-icon-6.png";

const Road = () => {
  return (
    <>
      <div className="roadmap-sec p-tb diamond-layout" id="roadmap">
          <div className="horizontal-roadmap">
                <div className="container">
                    <div className="text-center"><h2 className="section-heading1">Road Map</h2></div>
                    <div className="sub-txt text-center">
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean cursus tincidunt ultrices. Ut quis blandit dolor. Ut laoreet sagittis arcu eu tristique.</p>
                    </div>
                    <div className="horizontal-roadmap owl-carousel">
                        <div className="roadmap-item odd">
                            <div className="roadmap-icon">
                                <img src={icon1} alt="" />

                            </div>
                            <div className="roadmap-text">
                                <div className="roadmap-day">
                                    April 2020
                                </div>
                                <div className="roadmap-item-text">
                                    <h4>Inotial Coin Distribution</h4>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                                </div>
                            </div>
                        </div>
                        <div className="roadmap-item even">
                            <div className="roadmap-icon">
                                <img src={icon2} alt="" />
                            </div>
                            <div className="roadmap-text">
                                <div className="roadmap-day">
                                    <span>May 2020</span>
                                </div>
                                <div className="roadmap-item-text">
                                    <h4>Exchange Cryptocash</h4>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                                </div>
                            </div>
                        </div>
                        <div className="roadmap-item odd">
                            <div className="roadmap-icon">
                                <img src={icon3} alt="" />
                            </div>
                            <div className="roadmap-text">
                                <div className="roadmap-day">
                                    <span>June 2020</span>
                                </div>
                                <div className="roadmap-item-text">
                                    <h4>BTCC mode of payment</h4>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                                </div>
                            </div>
                        </div>
                        <div className="roadmap-item even">
                            <div className="roadmap-icon">
                                <img src={icon4} alt="" />
                            </div>
                            <div className="roadmap-text">
                                <div className="roadmap-day">
                                    <span>July 2020</span>
                                </div>
                                <div className="roadmap-item-text">
                                    <h4>Send-Receive coin</h4>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                                </div>
                            </div>
                        </div>
                        <div className="roadmap-item odd">
                            <div className="roadmap-icon">
                                <img src={icon5} alt="" />
                            </div>
                            <div className="roadmap-text">
                                <div className="roadmap-day">
                                    <span>August 2020</span>
                                </div>
                                <div className="roadmap-item-text">
                                    <h4>World Coin Index</h4>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                                </div>
                            </div>
                        </div>
                        <div className="roadmap-item even">
                            <div className="roadmap-icon">
                                <img src={icon6} alt="" />
                            </div>
                            <div className="roadmap-text">
                                <div className="roadmap-day">
                                    <span>August 2020</span>
                                </div>
                                <div className="roadmap-item-text">
                                    <h4>Online & Trading ICO</h4>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>

    
    </>
  )
}

export default Road