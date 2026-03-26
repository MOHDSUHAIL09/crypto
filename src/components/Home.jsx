import React from 'react'
import { Link } from 'react-router-dom'
import bannerImg from "../assets/images/banner-4.jpg";
import mobileImg from "../assets/images/diamond-animation-mobile.png";

const Home = () => {
  return (
    <>
          
                 <div className="hero-main diamond-layout white-sec" style={{ backgroundImage: `url(${bannerImg})` }}>
                <div className="container-fluid">
                    <div className="row align-items-center">
                        <div className="col-sm-12 col-md-6">
                            <h1>Coinpool The Future of ICO <span>Best Trending platform!</span></h1>
                            <p className="lead">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu mauris bibendum, tincidunt mauris at, tempor nunc.</p>
                            <div className="hero-btns">
                                <Link to="/auth" className="primary-btn">SIGN UP TO JOIN</Link>                              
                                <Link to="/signup" className="primary-btn btn3">Tokens Distribution</Link>

                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6" data-wow-delay="0.5s">
                            <div className="diamond-animation   mobile-hidden">

                                <div className="diamond-grid"></div>
                                <div className="diamond-grid-2"></div>
                                <div className="outer-Orbit ">
                                    <div className="Orbit">
                                        <div className="rotate">
                                            <div className="OrbitSquare">
                                                <div className="inner">A</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="main">
                                    <div className="top-coin"><span></span></div>
                                    <div className="lines">
                                        <span className="l-1"></span>
                                        <span className="l-2"></span>
                                        <span className="l-3"></span>
                                        <span className="l-4"></span>
                                        <span className="l-5"></span>
                                        <span className="l-6"></span>
                                        <span className="l-7"></span>
                                        <span className="l-8"></span>
                                        <span className="l-9"></span>
                                        <span className="l-10"></span>
                                        <span className="l-11"></span>
                                        <span className="l-12"></span>
                                        <span className="l-13"></span>
                                        <span className="l-14"></span>
                                        <span className="l-15"></span>
                                    </div>
                                    <div className="inside-bitcoin"></div>
                                    <div className="gris2"></div>
                                    <div className="square-1"></div>
                                </div>
                                <div className="base">
                                </div>
                            </div>
                            <div className="mobile-visible text-center">
                               <img src={mobileImg} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    </>
  )
}

export default Home