import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import SevenSegmentDisplay from "@/shared/SevenSegmentDisplay/SevenSegmentDisplay";

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

  return <SevenSegmentDisplay number={numberOfMinesLeft} />;
}

export default MineCounter;
