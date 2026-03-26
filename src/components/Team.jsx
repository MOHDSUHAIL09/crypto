import React from 'react'
import { CoreTeam } from './CoreTeam'

import team1 from "../assets/images/team-9.jpg";
import team2 from "../assets/images/team-10.jpg";
import team3 from "../assets/images/team-12.jpg";
import team4 from "../assets/images/team-11.jpg";

export const Team = () => {
  return (
    <>
      <div className="team-section p-tb light-gray-bg diamond-layout" id="team">
        <div className="container">
          <div className="text-center">
            <h2 className="section-heading1">Advisory Team</h2>
          </div>

          <div className="row">

            <TeamBox img={team1} name="Andy Sant" role="Founder & CEO" />
            <TeamBox img={team2} name="Dan Kaul" role="Co-founder & CTO" />
            <TeamBox img={team3} name="Saru Matt" role="Marketing Officer" />
            <TeamBox img={team4} name="Cyrus Nato" role="Lead Product Manager" />

          </div>
        </div>
      </div>

      <CoreTeam />
    </>
  )
}

const TeamBox = ({ img, name, role }) => (
  <div className="col-md-6 col-lg-3">
    <div className="team-box">
      <div className="team-img">
        <img src={img} alt={name} />
        <div className="team-social">
          <ul>
            <li><a href="https://facebook.com/"><i className="fab fa-facebook-f"></i></a></li>
            <li><a href="https://twitter.com/"><i className="fab fa-twitter"></i></a></li>
            <li><a href="https://www.linkedin.com/"><i className="fab fa-linkedin-in"></i></a></li>
          </ul>
        </div>
      </div>
      <div className="text">
        <h4>{name}</h4>
        <span>{role}</span>
      </div>
    </div>
  </div>
);