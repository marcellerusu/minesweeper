import "./Board.css";
import React, { useContext } from "react";
import Cell from "../Cell/Cell";
import { BoardContext } from "../state";

function Board() {
  let [{ board }] = useContext(BoardContext);
  return (
    <div className="board">
      {board.map((row, y) => (
        <span key={`row-${y}`}>
          {row.map((cell) => (
            <Cell key={`cell-${cell.x}-${cell.y}`} cell={cell} />
          ))}
        </span>
      ))}
    </div>
  );
}

export default Board;
