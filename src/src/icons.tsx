import React from "react";
// viewbox = 0 0 10 10

export function Svg({ children }: { children: React.ReactNode }) {
  return <svg viewBox="0 0 10 10">{children}</svg>;
}

export default {
  1: (
    <polygon
      points="2,9 8,9 8,7 6,7 6,1 4,1 2,4 4,4 4,7 2,7"
      style={{ fill: "#00a" }}
    />
  ),
  2: (
    <polygon
      points="2,9 8,9 8,7 5,7 8,5 8,2.5 6.5,1 3.5,1 2,2.5 2,4.5 4,4.5 4,3.5 4.5,3 5.5,3 6,3.5 6,4.5 2,7"
      style={{ fill: "#005200" }}
    />
  ),
  3: (
    <polygon
      points="2,9 7,9 8,8 8,6 7,5 8,4 8,2 7,1 2,1 2,3 5.25,3 5.75,3.25 5.75,4 5.25,4.25 3,4.25 3,5.75 5.25,5.75 5.75,6 5.75,6.75 5.25,7 2,7"
      style={{ fill: "#a00" }}
    />
  ),
  4: (
    <polygon
      points="4.5,9 6.5,9 6.5,7 8,7 8,5 6.5,5 6.5,1 4.5,1 1,5 3.5,5 4.5,3.5 4.5,5 1,5 1,7 4.5,7"
      style={{ fill: "#000052" }}
    />
  ),
  5: (
    <polygon
      points="2,9 7,9 8,8 8,5 7,4 4,4 4,3 8,3 8,1 2,1 2,5.75 6,5.75 6,7 2,7"
      style={{ fill: "#520000" }}
    />
  ),
  6: (
    <polygon
      points="4,7 4,5.75 2,5 2,8 3,9 7,9 8,8 8,5 7,4 4,4 4,3 7.5,3 7.5,1 3,1 2,2 2,5.75 6,5.75 6,7 2,7"
      style={{ fill: "#005252" }}
    />
  ),
  7: (
    <polygon
      points="3,9 5,9 8,3.5 8,1 2,1 2,2.75 6,2.75 6,3.5"
      style={{ fill: "#0f0f0f" }}
    />
  ),
  8: (
    <>
      <polygon
        points="3,9 7,9 8,8 8,6 7,5 8,4 8,2 7,1 3,1 2,2 2,4 3,5 2,6 2,8"
        style={{ fill: "#525252" }}
      />
      <polygon
        points="4,7.5 6,7.5 6.5,7 6.5,6.5 6,6 4,6 3.5,6.5 3.5,7"
        style={{ fill: "grey" }}
      />
      <polygon
        points="4,4 6,4 6.5,3.5 6.5,3 6,2.5 4,2.5 3.5,3 3.5,3.5"
        style={{ fill: "grey" }}
      />
    </>
  ),
  flag: (
    <>
      <polygon
        className="flag"
        points="2,9 8,9 8,8 6.5,7 6.5,1 5.5,1 5.5,7 2,8"
        style={{ fill: "black" }}
      />
      <polygon
        className="flag"
        points="2,3 5.5,1 5.5,5"
        style={{ fill: "#a00" }}
      />
    </>
  ),
  mine: (
    <>
      <line
        className="mine"
        x1="5"
        y1="1"
        x2="5"
        y2="9"
        stroke="black"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <line
        className="mine"
        x1="1"
        y1="5"
        x2="9"
        y2="5"
        stroke="black"
        strokeLinecap="round"
        strokeWidth="2"
      />

      <line
        className="mine"
        x1="2.5"
        y1="7.5"
        x2="7.5"
        y2="2.5"
        stroke="#222"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <line
        className="mine"
        x1="2.5"
        y1="2.5"
        x2="7.5"
        y2="7.5"
        stroke="#222"
        strokeLinecap="round"
        strokeWidth="1.5"
      />

      <circle className="mine" cx="5" cy="5" r="3.25" fill="black" />

      <rect x="3.5" y="3.5" width="1.5" height="1.5" rx="0.5" fill="white" />
    </>
  ),
} as Record<string | number, React.ReactNode>;
