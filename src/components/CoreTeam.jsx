import React from 'react';
import team3 from "../assets/images/team-3.jpg";
import team4 from "../assets/images/team-4.jpg";
import team5 from "../assets/images/team-5.jpg";
import team6 from "../assets/images/team-6.jpg";
import team7 from "../assets/images/team-7.jpg";
import team8 from "../assets/images/team-8.jpg";

export const CoreTeam = () => {
  return (
    <>
      <div className="team-minimal-section p-b black-bg white-sec">
        <div className="container">
          <div className="text-center">
            <h2 className="section-heading">
              <span>Core Team</span>
            </h2>
          </div>
          <div className="row">
            <div className="col-md-4 col-sm-6">
              <div className="team-box">
                <div className="team-img">
                  <img src={team7} alt="Helen Ansley" />
                  <div className="team-social">
                    <ul>
                      <li>
                        <a href="https://www.linkedin.com/">
                          <i className="fab fa-linkedin-in"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="text">
                  <h4>Helen Ansley</h4>
                  <span>Head of Investor</span>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-sm-6">
              <div className="team-box">
                <div className="team-img">
                  <img src={team4} alt="Cecil Casey" />
                  <div className="team-social">
                    <ul>
                      <li>
                        <a href="https://www.linkedin.com/">
                          <i className="fab fa-linkedin-in"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="text">
                  <h4>Cecil Casey</h4>
                  <span>Head of Marketing</span>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-sm-6">
              <div className="team-box">
                <div className="team-img">
                  <img src={team3} alt="Sylvia Neal" />
                  <div className="team-social">
                    <ul>
                      <li>
                        <a href="https://www.linkedin.com/">
                          <i className="fab fa-linkedin-in"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="text">
                  <h4>Sylvia Neal</h4>
                  <span>ICO Specialist</span>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-sm-6">
              <div className="team-box">
                <div className="team-img">
                  <img src={team8} alt="Teresa Pacheco" />
                  <div className="team-social">
                    <ul>
                      <li>
                        <a href="https://www.linkedin.com/">
                          <i className="fab fa-linkedin-in"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="text">
                  <h4>Teresa Pacheco</h4>
                  <span>Community Manager</span>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-sm-6">
              <div className="team-box">
                <div className="team-img">
                  <img src={team5} alt="Elvin Poe" />
                  <div className="team-social">
                    <ul>
                      <li>
                        <a href="https://www.linkedin.com/">
                          <i className="fab fa-linkedin-in"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="text">
                  <h4>Elvin Poe</h4>
                  <span>Marketing Officer</span>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-sm-6">
              <div className="team-box">
                <div className="team-img">
                  <img src={team6} alt="Jorge Meza" />
                  <div className="team-social">
                    <ul>
                      <li>
                        <a href="https://www.linkedin.com/">
                          <i className="fab fa-linkedin-in"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="text">
                  <h4>Jorge Meza</h4>
                  <span>Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};