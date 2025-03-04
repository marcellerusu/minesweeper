import "./Board.css";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import Cell from "./Cell/Cell";

function Board({ isGameWon }: { isGameWon: boolean }) {
  let height = useSelector(({ game: { board } }: RootState) => board.length);
  let width = useSelector(({ game: { board } }: RootState) => board[0].length);
  return (
    <div className="board">
      {Array.from({ length: height }).map((_, y) => (
        <span key={`row-${y}`}>
          {Array.from({ length: width }).map((_, x) => (
            <Cell key={`cell-${x}-${y}`} x={x} y={y} isGameWon={isGameWon} />
          ))}
        </span>
      ))}
    </div>
  );
}

export default Board;
