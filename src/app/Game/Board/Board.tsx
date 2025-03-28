import "./Board.css";
import React from "react";
import { useSelector } from "@/app/store";
import Cell from "./Cell/Cell";

function Board() {
  let { width, height } = useSelector(({ settings }) => settings);
  return (
    <div className="board">
      {Array.from({ length: height }).map((_, y) => (
        <span key={`row-${y}`}>
          {Array.from({ length: width }).map((_, x) => (
            <Cell key={`cell-${x}-${y}`} x={x} y={y} />
          ))}
        </span>
      ))}
    </div>
  );
}

export default Board;
