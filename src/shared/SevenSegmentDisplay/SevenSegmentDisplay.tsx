import React from "react";
import SevenSegmentDigit from "./SevenSegmentDigit/SevenSegmentDigit";
import "./SevenSegmentDisplay.css";

function SevenSegmentDisplay({ number }: { number: number }) {
  // convert time from number 123 -> [1, 2, 3],
  // taking into account for smaller numbers like 1 -> [0, 0, 1]
  let [a, b, c] = number.toString().padStart(3, "0").split("").map(Number);

  return (
    <div className="seven-segment-display">
      <SevenSegmentDigit number={a} />
      <SevenSegmentDigit number={b} />
      <SevenSegmentDigit number={c} />
    </div>
  );
}

export default SevenSegmentDisplay;
