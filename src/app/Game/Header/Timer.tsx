import React, { useEffect, useState } from "react";
import SevenSegmentDisplay from "@/shared/SevenSegmentDisplay/SevenSegmentDisplay";
import { useSelector } from "@/app/store";

function Timer({ isGameOver }: { isGameOver: boolean }) {
  let [time, setTimer] = useState(0);
  let isEmpty = useSelector(({ game: { board } }) =>
    board.every((row) => row.every((cell) => !cell.isOpen))
  );
  let isPlaying = !isEmpty && !isGameOver;

  useEffect(() => {
    if (isEmpty) setTimer(0);
    let interval = setInterval(() => {
      if (isPlaying) setTimer((time) => time + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isEmpty, isPlaying]);

  return <SevenSegmentDisplay number={Math.min(time, 999)} />;
}

export default Timer;
