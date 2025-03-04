import "./MineCounter.css";
import React from "react";
import SevenSegmentDigit from "@/shared/SevenSegmentDigit/SevenSegmentDigit";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";

function MineCounter() {
  let numberOfFlags = useSelector(
    ({ game: { board } }: RootState) =>
      board.flat().filter((cell) => cell.isFlagged).length
  );
  let numberOfMines = useSelector(
    ({ game: { board } }: RootState) =>
      board.flat().filter((cell) => cell.isMine).length
  );

  let numberOfMinesLeft = numberOfMines - numberOfFlags;

  // convert time from number 123 -> [1, 2, 3],
  // taking into account for smaller numbers like 1 -> [0, 0, 1]
  let [a, b, c] = numberOfMinesLeft
    .toString()
    .padStart(3, "0")
    .split("")
    .map(Number);

  return (
    <div className="mine-counter">
      <SevenSegmentDigit number={a} />
      <SevenSegmentDigit number={b} />
      <SevenSegmentDigit number={c} />
    </div>
  );
}

export default MineCounter;
