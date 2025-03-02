import "./Cell.css";
import type { Cell } from "../types";
import type { BoardAction } from "../Game";
import React, { Dispatch } from "react";
import ICONS, { Svg } from "../icons";

type Props = {
  cell: Cell;
  mineCount: number;
  dispatch: Dispatch<BoardAction>;
};

function Cell({ cell, mineCount, dispatch }: Props) {
  return (
    <div
      onMouseDown={() => dispatch({ type: "click", cell })}
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
