import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { Cell, Point } from "@/app/types";
import { click } from "@/app/state/game";
import { mineCountFor } from "@/app/state/game";
import { RootState } from "@/app/store";
import ICONS, { Svg } from "./icons";
import "./Cell.css";

function Cell({ x, y, isGameWon }: Point & { isGameWon: boolean }) {
  let cell = useSelector(
    ({ game: { board } }: RootState) =>
      board.flat().find((cell) => cell.x === x && cell.y === y)!
  );
  let mineCount = useSelector(({ game: { board } }: RootState) =>
    mineCountFor(board, cell)
  );
  let dispatch = useDispatch();
  return (
    <div
      onMouseDown={() => dispatch(click(cell))}
      className="cell"
      data-is-open={cell.isOpen}
      // the game can be over with unflagged cells
      // these are all the mines, so we'll flag it to make it
      // visually appealing
      data-is-flagged={cell.isFlagged || (isGameWon && !cell.isOpen)}
      data-is-mine={cell.isMine}
      data-x={cell.x}
      data-y={cell.y}
    >
      {mineCount > 0 && <Svg>{ICONS[mineCount]}</Svg>}
      {cell.isMine && <Svg>{ICONS.mine}</Svg>}
      <Svg>{ICONS.flag}</Svg>
    </div>
  );
}

export default Cell;
