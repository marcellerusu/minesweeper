import React from "react";
import { useSelector } from "@/app/store";
import { useIsGameWon } from "@/app/state/hooks";
import SevenSegmentDisplay from "@/shared/SevenSegmentDisplay/SevenSegmentDisplay";

function MineCounter() {
  let isGameWon = useIsGameWon();
  let numberOfFlags = useSelector(
    ({ board }) => board.flat().filter((cell) => cell.isFlagged).length
  );
  let numberOfMines = useSelector(
    ({ board }) => board.flat().filter((cell) => cell.isMine).length
  );
  let isEmpty = useSelector(({ board }) =>
    board.every((row) => row.every((cell) => !cell.isOpen))
  );
  let totalMines = useSelector(({ settings }) => settings.numberOfMines);

  if (isGameWon) return <SevenSegmentDisplay number={0} />;
  if (isEmpty) return <SevenSegmentDisplay number={totalMines} />;

  let numberOfMinesLeft = numberOfMines - numberOfFlags;

  return <SevenSegmentDisplay number={numberOfMinesLeft} />;
}

export default MineCounter;
