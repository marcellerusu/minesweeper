import React from "react";
import "./SevenSegmentDigit.css";

function SevenSegmentDigit({ number }: { number: number }) {
  return (
    <svg className="seven-segment" viewBox="0 0 5 10" data-number={number}>
      <polygon className="bottom" points="0.1,10 4.9,10 4,9.1 1,9.1" />
      <polygon className="bottom-left" points="0,5.1 0,9.9 0.9,9 0.9,6.1" />
      <polygon className="top-left" points="0,0.1 0,4.9 0.9,3.9 0.9,1.1" />
      <polygon className="top" points="0.1,0 4.9,0 4,0.9 1,0.9" />
      <polygon className="top-right" points="5,0.1 5,4.9 4.1,3.9 4.1,1.1" />
      <polygon className="bottom-right" points="5,5.1 5,9.9 4.1,9 4.1,6.1" />
      <polygon
        className="center"
        points="0.2,5.1  0.2,4.9 1,4.1 4,4.1 4.8,4.9 4.8,5.1 4,5.9 1,5.9"
      />
    </svg>
  );
}

export default SevenSegmentDigit;
