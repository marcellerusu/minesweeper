import "./Cell.css";
import type { Cell, Point } from "@/app/types";
import React from "react";
import ICONS, { Svg } from "./icons";
import { useDispatch } from "react-redux";
import { click } from "@/app/state/game";
import { useSelector } from "react-redux";
import { mineCountFor } from "@/app/state/game";
import { RootState } from "@/app/store";

function Cell({ x, y }: Point) {
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
      data-is-flagged={cell.isFlagged}
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
