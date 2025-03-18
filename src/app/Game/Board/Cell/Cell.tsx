import React from "react";
import type { Cell, Point } from "@/app/types";
import { cx } from "@/shared/utils";
import { click, tryExpand, space } from "@/app/state/game";
import { mineCountFor } from "@/app/state/game";
import { useDispatch, useSelector } from "@/app/store";
import ICONS from "./icons";
import "./Cell.css";

function Cell({ x, y }: Point) {
  let dispatch = useDispatch();
  let cell = useSelector(({ board }) => board[y][x]!);
  let mineCount = useSelector(({ board }) => mineCountFor(board, cell));

  return (
    <div
      onClick={(_) => dispatch(click({ x, y }))}
      onDoubleClick={(_) => dispatch(tryExpand({ x, y }))}
      onContextMenu={(e) => {
        e.preventDefault();
        dispatch(space({ x, y }));
      }}
      className={`cell ${cx({
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
