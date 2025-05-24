import React from "react";
import "../styles/Loader.css";

export default function Loader() {
  return (
    <div className="loader-backdrop">
      <svg width="80" height="80" viewBox="0 0 80 80">
        <ellipse
            cx="40"
            cy="70"
            rx="28"
            ry="8"
            fill="black"
            opacity="0.7"
            filter="url(#blurFilter)"
        />

        <defs>
            <filter id="blurFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" />
            </filter>
        </defs>

        <g className="wheel-spin">
          <circle
            cx="40"
            cy="40"
            r="32"
            fill="#fff"
            stroke="#111"
            strokeWidth="12"
            strokeDasharray="7,7"
            strokeLinecap="round"
          />
          <circle
            cx="40"
            cy="40"
            r="20"
            fill="#3f3f3f1f"
            stroke="#111"
            strokeWidth="3"
          />
          {[...Array(8)].map((_, i) => {
            const angle = (i * 45) * (Math.PI / 180);
            const x1 = 40;
            const y1 = 40;
            const x2 = 40 + 16 * Math.cos(angle);
            const y2 = 40 + 16 * Math.sin(angle);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#222"
                strokeWidth="4"
                strokeLinecap="round"
              />
            );
          })}
          <circle
            cx="40"
            cy="40"
            r="7"
            fill="#3f3f3f1f"
            stroke="#111"
            strokeWidth="2"
          />
        </g>
        </svg>

    </div>
  );
}