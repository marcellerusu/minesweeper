import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SevenSegmentDisplay from "@/shared/SevenSegmentDisplay/SevenSegmentDisplay";
import { RootState } from "@/app/store";

function Timer({ isGameOver }: { isGameOver: boolean }) {
  let [time, setTimer] = useState(0);
  let isEmpty = useSelector(({ game: { board } }: RootState) =>
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
