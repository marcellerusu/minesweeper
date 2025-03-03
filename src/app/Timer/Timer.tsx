import React, { useEffect, useState } from "react";

function Timer({ status }: { status: "playing" | "stopped" | "reset" }) {
  let [time, setTimer] = useState(0);

  // this code is kind of nasty
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

  return <div className="timer">{time}</div>;
}

export default Timer;
