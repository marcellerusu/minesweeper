import "./Timer.css";
import SevenSegmentDigit from "@/shared/SevenSegmentDigit/SevenSegmentDigit";
import React, { useEffect, useState } from "react";

function Timer({ status }: { status: "playing" | "stopped" | "reset" }) {
  let [time, setTimer] = useState(0);

  // s/o to minesweeperonline.com
  time = Math.min(time, 999);

  // this code is kind of nasty to handle game status changes
  //   - if you won, or lost -> stop the timer
  //   - if you started a new game -> reset to 0, but pause the timer
  //   - if you put your first move -> start the timer
  useEffect(() => {
    if (status === "reset") setTimer(0);
    let interval = setInterval(() => {
      if (status === "playing") setTimer((time) => time + 1);
    }, 1000);
    return () => {
      // if we are currently stopped, and cleaning up
      // it means we are getting ready to play again
      if (status === "stopped") setTimer(0);

      clearInterval(interval);
    };
  }, [status]);

  // convert time from number 123 -> [1, 2, 3],
  // taking into account for smaller numbers like 1 -> [0, 0, 1]
  let [a, b, c] = time.toString().padStart(3, "0").split("").map(Number);

  return (
    <div className="timer">
      <SevenSegmentDigit number={a} />
      <SevenSegmentDigit number={b} />
      <SevenSegmentDigit number={c} />
    </div>
  );
}

export default Timer;
