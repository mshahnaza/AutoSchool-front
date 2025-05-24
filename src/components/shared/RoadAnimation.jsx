import React from "react";
import carIcon from "../../assets/icons/image.svg";
import "../styles/RoadAnimation.css";

export default function RoadAnimation() {
  return (
    <div className="road-animation-bg">
      <svg className="road-svg" viewBox="0 0 2500 800" xmlns="http://www.w3.org/2000/svg">
        <path
          id="roadPath"
          d="M 0,400 
             C 300,350 300,100 600,150 
             S 900,450 1200,350 
             S 1500,0 1800,200 
             S 2200,400 2500,350"
          stroke="#a0a0a0"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="20, 10"
        />
      </svg>

      <img src={carIcon} alt="Car" className="car-on-road" />
    </div>
  );
}
