import "./Board.css";
import React from "react";
import Cell from "./Cell/Cell";
import { useSelector } from "react-redux";
import { RootState } from "../store";

function Board() {
  let height = useSelector(({ game: { board } }: RootState) => board.length);
  let width = useSelector(({ game: { board } }: RootState) => board[0].length);
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
