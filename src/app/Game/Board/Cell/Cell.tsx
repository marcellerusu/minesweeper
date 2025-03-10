import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { Cell, Point } from "@/app/types";
import { cx } from "@/shared/utils";
import { click, tryExpand, space } from "@/app/state/game";
import { mineCountFor } from "@/app/state/game";
import { RootState } from "@/app/store";
import ICONS from "./icons";
import "./Cell.css";

function Cell({ x, y }: Point) {
  let dispatch = useDispatch();
  let cell = useSelector(({ game: { board } }: RootState) => board[y][x]!);
  let mineCount = useSelector(({ game: { board } }: RootState) =>
    mineCountFor(board, cell)
  );
  let position = useSelector(({ game: { position } }: RootState) => {
    if (position?.x === x && position?.y === y) return position;
  });
  return (
    <div
      onMouseDown={(e) => {
        if (e.button === 2) {
          e.preventDefault();
          dispatch(space());
        } else {
          dispatch(click({ x, y }));
        }
      }}
      onDoubleClick={() => dispatch(tryExpand())}
      onContextMenu={(e) => e.preventDefault()}
      className={`cell ${cx({
        active: position?.x === x && position?.y === y,
        open: cell.isOpen,
        flagged: cell.isFlagged,
        mine: cell.isMine,
      })}`}
      // for space controls
      data-x={cell.x}
      data-y={cell.y}
    >
      {mineCount > 0 && ICONS[mineCount]}
      {cell.isMine && ICONS.mine}
      {ICONS.flag}
    </div>
  );
}

export default Cell;
