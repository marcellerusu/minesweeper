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

  return (
    <div
      onClick={(e) => {
        if (e.button === 2) {
          e.preventDefault();
          dispatch(space({ x, y }));
        } else {
          dispatch(click({ x, y }));
        }
      }}
      onDoubleClick={() => dispatch(tryExpand({ x, y }))}
      onContextMenu={(e) => e.preventDefault()}
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
