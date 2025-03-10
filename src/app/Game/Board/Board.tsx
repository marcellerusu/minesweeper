import "./Board.css";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import Cell from "./Cell/Cell";

function Board() {
  let height = useSelector(({ game }: RootState) => game.settings.height);
  let width = useSelector(({ game }: RootState) => game.settings.width);
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
