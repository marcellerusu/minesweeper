import "./Cell.css";
import type { Cell } from "../types";
import type { BoardAction } from "../Game";
import React, { Dispatch } from "react";
import ICONS, { Svg } from "../icons";

function Cell({
  cell,
  mineCount,
  dispatch,
}: {
  cell: Cell;
  mineCount: number;
  dispatch: Dispatch<BoardAction>;
}) {
  return (
    <div
      onMouseDown={() => dispatch({ type: "click", cell })}
      className="cell"
      data-is-open={cell.isOpen}
      data-is-flagged={cell.isFlagged}
      data-mine-count={mineCount}
      data-x={cell.x}
      data-y={cell.y}
      data-is-mine={cell.isMine}
    >
      {mineCount > 0 && <Svg>{ICONS[mineCount]}</Svg>}
      {cell.isMine && <Svg>{ICONS.mine}</Svg>}
      <Svg>{ICONS.flag}</Svg>
    </div>
  );
}

export default Cell;
