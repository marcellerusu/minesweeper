import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { Cell, Point } from "@/app/types";
import { click, space } from "@/app/state/game";
import { mineCountFor } from "@/app/state/game";
import { RootState } from "@/app/store";
import ICONS, { Svg } from "./icons";
import "./Cell.css";

function Cell({ x, y }: Point) {
  let cell = useSelector(
    ({ game: { board } }: RootState) =>
      board.flat().find((cell) => cell.x === x && cell.y === y)!
  );
  let mineCount = useSelector(({ game: { board } }: RootState) =>
    mineCountFor(board, cell)
  );
  let position = useSelector(({ game: { position } }: RootState) => {
    if (position?.x === x && position?.y === y) return position;
  });
  let dispatch = useDispatch();
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
      onContextMenu={(e) => {
        e.preventDefault();
      }}
      className="cell"
      data-is-active={position?.x === x && position?.y === y}
      data-is-open={cell.isOpen}
      // the game can be over with unflagged cells
      // these are all the mines, so we'll flag it to make it
      // visually appealing
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
