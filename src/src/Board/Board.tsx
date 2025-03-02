import "./Board.css";
import React, { Dispatch } from "react";
import Cell from "../Cell/Cell";
import type * as Types from "../types";
import type { BoardAction } from "../Game";

type Props = {
  board: Types.Board;
  mineCountFor: (board: Types.Board, cell: Types.Cell) => number;
  dispatch: Dispatch<BoardAction>;
};

function Board({ board, dispatch, mineCountFor }: Props) {
  return (
    <div className="board">
      {board.map((row, y) => (
        <span key={`row-${y}`}>
          {row.map((cell) => (
            <Cell
              key={`cell-${cell.x}-${cell.y}`}
              cell={cell}
              dispatch={dispatch}
              mineCount={mineCountFor(board, cell)}
            />
          ))}
        </span>
      ))}
    </div>
  );
}

export default Board;
