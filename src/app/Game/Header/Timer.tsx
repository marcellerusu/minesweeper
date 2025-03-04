import React, { useEffect, useState } from "react";
import SevenSegmentDisplay from "@/shared/SevenSegmentDisplay/SevenSegmentDisplay";

function Timer({ status }: { status: "playing" | "stopped" | "reset" }) {
  let [time, setTimer] = useState(0);

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

  return <SevenSegmentDisplay number={Math.min(time, 999)} />;
}

export default Timer;
