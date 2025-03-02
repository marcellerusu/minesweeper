import "./Cell.css";
import type { Cell } from "../types";
import React from "react";
import ICONS, { Svg } from "../icons";

function Cell({
  cell,
  mineCount,
  onPress,
}: {
  cell: Cell;
  mineCount: number;
  onPress: () => void;
}) {
  return (
    <div
      onMouseDown={onPress}
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
