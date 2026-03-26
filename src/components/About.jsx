import React, { useState } from "react";
import coinImg from "../assets/images/coinpool-c.png";

const About = () => {
  const [activeTab, setActiveTab] = useState("mission");

  return (
    <div className="about-section p-tb diamond-layout" id="about">
      <div className="container-fluid">
        <div className="row">
          {/* LEFT */}
          <div className="col-lg-5 col-md-12">
            <div className="diamond-icon">
             <img src={coinImg} alt="Coinpool" />
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-lg-7 col-md-12">
            <h2 className="section-heading1">About ICO</h2>
            <h4>Why to choose Coinpool Diamond?</h4>
            <h5>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis at
              dictum risus, non suscipit arcu.
            </h5>

            {/* Tabs */}
            <div className="tab-section">
              <ul className="nav nav-tabs text-uppercase">
                <li className="nav-item">
                  <span
                    className={`nav-link ${
                      activeTab === "mission" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("mission")}
                  >
                    Our Mission
                  </span>
                </li>
                <li className="nav-item">
                  <span
                    className={`nav-link ${
                      activeTab === "vision" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("vision")}
                  >
                    Our Vision
                  </span>
                </li>
                <li className="nav-item">
                  <span
                    className={`nav-link ${
                      activeTab === "guarantees" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("guarantees")}
                  >
                    Guarantees
                  </span>
                </li>
              </ul>

              {/* Tab Content */}
              <div className="tab-content">
                {activeTab === "mission" && (
                  <div className="tab-pane active">
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Voluptatum ab repellat repudiandae accusamus eligendi
                      incidunt beatae rerum.
                    </p>
                  </div>
                )}

                {activeTab === "vision" && (
                  <div className="tab-pane active">
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Proin vel rutrum quam, sed bibendum turpis.
                    </p>
                    <p>
                      Suspendisse quis ex non massa fringilla convallis.
                    </p>
                  </div>
                )}

                {activeTab === "guarantees" && (
                  <div className="tab-pane active">
                    <ul>
                      <li>Lorem ipsum dolor sit amet.</li>
                      <li>Donec lacinia ipsum vitae blandit dictum.</li>
                      <li>In cursus odio vitae ligula vulputate.</li>
                      <li>Nullam in leo quis orci suscipit semper.</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="button-wrapper">
              <a className="btn" href="#">
                Read More
              </a>

              <a className="watch-link" href="#">
                <i className="fas fa-play"></i>
                <span>
                  <strong>Watch video</strong>
                  What and How it work
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
