import "./Board.css";
import React from "react";
import Cell from "./Cell/Cell";

function Board() {
  return (
    <div className="board">
      {Array.from({ length: 9 }).map((_, y) => (
        <span key={`row-${y}`}>
          {Array.from({ length: 9 }).map((_, x) => (
            <Cell key={`cell-${x}-${y}`} x={x} y={y} />
          ))}
        </span>
      ))}
    </div>
  );
}

export default Board;
