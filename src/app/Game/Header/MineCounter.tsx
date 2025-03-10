import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { useIsGameWon } from "@/app/state/hooks";
import SevenSegmentDisplay from "@/shared/SevenSegmentDisplay/SevenSegmentDisplay";

function MineCounter() {
  let isGameWon = useIsGameWon();
  let numberOfFlags = useSelector(
    ({ game: { board } }: RootState) =>
      board.flat().filter((cell) => cell.isFlagged).length
  );
  let numberOfMines = useSelector(
    ({ game: { board } }: RootState) =>
      board.flat().filter((cell) => cell.isMine).length
  );

  let numberOfMinesLeft = numberOfMines - numberOfFlags;

  if (isGameWon) return <SevenSegmentDisplay number={0} />;
  return <SevenSegmentDisplay number={numberOfMinesLeft} />;
}

export default MineCounter;
