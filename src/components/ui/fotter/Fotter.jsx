import React from 'react'
import { Link } from 'react-router-dom'

// Import images
import logo2Img from '../../..//assets/images/logo2.png'
import footerImg1 from '../../..//assets/images/resource/footer-img-1.png'
import footerImg2 from '../../../assets/images/resource/footer-img-2.png'

const Footer = () => {
  return (
    <>
      <div className="footer-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-5">
              <div className="widget widgets-company-info">
                <div className="company-logo cursor-scale small">
                  <Link to="/">
                    <img className='logo1' src={logo2Img} alt="logo" />
                  </Link>
                </div>
                <div className="company-info-desc">
                  <p>
                    Mango Wealth Planner specializes in healthcare and pharmaceutical investments, combining financial expertise with deep sector knowledge to build resilient, growth-oriented portfolios in the essential healthcare sector.
                  </p>
                </div>
                <div className="mediic-info">
                  <h3>+123 (4567) - 890</h3>
                  <p><span>Email us :</span> healthcare@mangowealthplanner.com</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="widget widget-nav-menu">
                <h4 className="widget-title">Healthcare Investment Areas</h4>
                <div className="menu-quick-link-content">
                  <ul className="footer-menu">
                    <li>
                      <i className="bi bi-star-fill"></i>
                      <Link to="/about"> Hospital Infrastructure </Link>
                    </li>
                    <li>
                      <i className="bi bi-star-fill"></i>
                      <Link to="/team"> Pharmaceuticals </Link>
                    </li>
                    <li>
                      <i className="bi bi-star-fill"></i>
                      <Link to="/blog-grid"> Biotechnology </Link>
                    </li>
                    <li>
                      <i className="bi bi-star-fill"></i>
                      <Link to="/contact"> Medical Devices </Link>
                    </li>
                    <li>
                      <i className="bi bi-star-fill"></i>
                      <Link to="/testimonial"> Healthcare Technology </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* <div className="col-lg-2 col-md-6">
              <div className="widget widget-nav-menu">
                <h4 className="widget-title">Services</h4>
                <div className="menu-quick-link-content">
                  <ul className="footer-menu">
                    <li>
                      <i className="bi bi-star-fill"></i>
                      <Link to="/service"> Our Service </Link>
                    </li>
                    <li>
                      <i className="bi bi-star-fill"></i>
                      <Link to="#"> Privacy </Link>
                    </li>
                    <li>
                      <i className="bi bi-star-fill"></i>
                      <Link to="/appointment"> Appointment </Link>
                    </li>
                    <li>
                      <i className="bi bi-star-fill"></i>
                      <Link to="#"> Partners </Link>
                    </li>
                    <li>
                      <i className="bi bi-star-fill"></i>
                      <Link to="/faq"> FAQ </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div> */}


{/* col-2 == 4 */}
             <div className="col-lg-4 col-md-6">
              <div className="widget widget-nav-menu">
                <h4 className="widget-title">Contact Our Healthcare Team</h4>
                <div className="menu-quick-link-content">
                  <ul className="footer-menu">
                    <li>
                      {/* <i className="bi bi-star-fill"></i>  */}
                      <Link to="/service"> <div className='fotter-addresh'>Ground Floor, The Sotheby Building, Rodney Village, Rodney Bay, Gros-Islet, Saint Lucia</div></Link>
                    </li>

                  </ul>
                </div>
              </div>
            </div>







            {/* <div className="col-lg-3 col-md-6 pr-0 pl-0">
              <div className="mediic-address">
                <h4 className="widget-title">Contact Our Healthcare   Team</h4>
                <div className="footer-mediic-contact">
                  <ul className="mediic-service-times">
                    <li className="mediic-border">
                      Monday to Friday : <span>9:00 - 20:00</span>
                    </li>
                    <li>Saturday - Sunday : <span>Closed</span></li>
                  </ul>
                  <form action="https://formspree.io/f/myyleorq" method="POST" id="dreamit-form">
                    <div className="subscribe_form">
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter Your E-Mail"
                      />
                      <div className="subscribe_form_send">
                        <button type="submit" className="submits-btn">
                          <i className="bi bi-arrow-up-right"></i>
                        </button>
                      </div>
                    </div>
                    <div id="status"></div>
                    <label className="widget-check">
                      <input type="checkbox" />
                      Agree Terms and Condition
                      <span className="checkmark01"></span>
                    </label>
                  </form>
                </div>
              </div>
            </div> */}
            <div className="foorer-shape">
              <div className="footer-thumb">
                <img src={footerImg1} alt="" />
              </div>
              <div className="footer-thumb1">
                <img src={footerImg2} alt="" />
              </div>
            </div>
          </div>
          <div className="row footer-btm">
            <div className="col-lg-6 col-md-6">
              <div className="mediic-social-icon cursor-scale small">
                <a href="#">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#">
                  <i className="fa-brands fa-linkedin-in"></i>
                </a>
                <a href="#">
                  <i className="fa-brands fa-x-twitter"></i>
                </a>
                <a href="#">
                  <i className="fab fa-pinterest-p"></i>
                </a>
              </div>
            </div>
            <div className="col-lg-6 col-md-6">
              <div className="mediic-company-desc text-right">
                <p>
                      ©2026 Mango Wealth Planner - Healthcare Investment Specialists
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Footer