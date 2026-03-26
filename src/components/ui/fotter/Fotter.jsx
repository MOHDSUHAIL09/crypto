import React from 'react';
import logo from "../../../assets/images/logo.png"

const Fotter = () => {
  return (
    <>
      <footer className="diamond-footer">
        <div className="footer-widget-area">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-md-4 widget-area">
                <div className="widget widget-html">
                  <div className="footer-logo">
                    <a href="#" title="">
                      <img src={logo} alt="Cp Diamond" />
                    </a>
                  </div>
                  <div className="contact-info">
                    <ul>
                      <li className="email">
                        <a href="#">hello@coinpool.com</a>
                      </li>
                      <li className="phone">
                        <a href="#">+1 800 123 45 67</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-4 widget-area">
                <div className="widget widget-html text-center">
                  <h2 className="widget-title">Stay connected</h2>
                  <div className="socials">
                    <ul>
                      <li>
                        <a href="https://facebook.com/">
                          <i className="fab fa-facebook-f"></i>
                        </a>
                      </li>
                      <li>
                        <a href="https://twitter.com/">
                          <i className="fab fa-twitter"></i>
                        </a>
                      </li>
                      <li>
                        <a href="https://telegram.org/">
                          <i className="fab fa-telegram-plane"></i>
                        </a>
                      </li>
                      <li>
                        <a href="https://bitcoin.com/">
                          <i className="fab fa-btc"></i>
                        </a>
                      </li>
                      <li>
                        <a href="https://www.youtube.com/">
                          <i className="fab fa-youtube"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-4 widget-area">
                <div className="widget widget-html">
                  <h2 className="widget-title">Subscribe</h2>
                  <div className="newsletter">
                    <form method="post">
                      <input
                        type="email"
                        name="Email"
                        placeholder="Your email address"
                      />
                      <button className="btn" name="subscribe">
                        subscribe
                      </button>
                      <label>
                        <input type="radio" name="privacy-policy" />
                        I agree to the <a href="#">Privacy Policy</a>.
                      </label>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="copyright-area">
          <div className="container">
            <div className="row">
              <div className="col-lg-6">
                <ul className="footer-menu horizontal-menu onepage">
                  <li>
                    <a href="#about">About ICO</a>
                  </li>
                  <li>
                    <a href="#mission">Mission</a>
                  </li>
                  <li>
                    <a href="#token">Token</a>
                  </li>
                  <li>
                    <a href="#roadmap">Roadmap</a>
                  </li>
                  <li>
                    <a href="#team">Team</a>
                  </li>
                  <li>
                    <a href="#press">Media</a>
                  </li>
                </ul>
              </div>
              <div className="col-lg-6">
                <div className="copy-text">
                  © 2025 Coinpool. Design & Developed by{" "}
                  <a href="#">StyloxDesign.</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Fotter;