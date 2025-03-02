import "./Cell.css";
import type { Cell } from "../types";
import React, { useContext } from "react";
import ICONS, { Svg } from "../icons";
import { BoardContext, mineCountFor } from "../state";

function Cell({ cell }: { cell: Cell }) {
  let [{ board }, dispatch] = useContext(BoardContext);
  let mineCount = mineCountFor(board, cell);

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
