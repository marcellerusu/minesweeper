import "./Board.css";
import React, { useEffect, useReducer, useState } from "react";
import type * as Types from "../types";
import Cell from "../Cell/Cell";

type Board = Types.Cell[][];

type BoardState = {
  board: Types.Cell[][];
  status: "initial" | "active";
};

function emptyBoard(width: number, height: number): BoardState {
  return {
    board: Array.from({ length: height }, (_, y) =>
      Array.from({ length: width }, (_, x) => ({
        isMine: false,
        isOpen: false,
        isFlagged: false,
        x,
        y,
      }))
    ),
    status: "initial",
  };
}

function generateMinesFor(
  board: Board,
  totalNumberOfMines: number,
  boardWidth: number,
  boardHeight: number,
  openingX: number,
  openingY: number
): Board {
  let newBoard = board;
  let numberOfMinesLeft = totalNumberOfMines;
  while (numberOfMinesLeft > 0) {
    let mineX = Math.floor(Math.random() * boardWidth);
    let mineY = Math.floor(Math.random() * boardHeight);
    // ensure that you always start with a wide open first move
    if (Math.abs(mineX - openingX) <= 1 && Math.abs(mineY - openingY) <= 1)
      continue;
    if (newBoard[mineY][mineX].isMine) continue;
    newBoard = newBoard.with(
      mineY,
      newBoard[mineY].with(mineX, { ...newBoard[mineY][mineX], isMine: true })
    );
    numberOfMinesLeft--;
  }
  return newBoard;
}

function neighborsOf(board: Board, x: number, y: number): Readonly<Cell>[] {
  return [
    // above
    board[y - 1]?.[x],
    // below
    board[y + 1]?.[x],
    // to the left
    board[y]?.[x - 1],
    // to the right
    board[y]?.[x + 1],
    // to the top left
    board[y - 1]?.[x - 1],
    // to the top right
    board[y - 1]?.[x + 1],
    // to the bottom left
    board[y + 1]?.[x - 1],
    // to the bottom right
    board[y + 1]?.[x + 1],
  ].filter((item) => typeof item !== "undefined");
}

function mineCountFor(board: Board, cell: Cell): number {
  return neighborsOf(board, cell.x, cell.y).filter((c) => c.isMine).length;
}

function flagCountFor(board: Board, cell: Cell): number {
  return neighborsOf(board, cell.x, cell.y).filter((c) => c.isFlagged).length;
}

function open(board: Board, x: number, y: number) {
  return board.with(y, board[y].with(x, { ...board[y][x], isOpen: true }));
}

function expand(
  board: Board,
  x: number,
  y: number,
  ignore: { x: number; y: number }[] = []
): Board {
  let neighbors = neighborsOf(board, x, y)
    .filter((cell) => !ignore.some((c) => c.x === cell.x && c.y === cell.y))
    .filter((cell) => !cell.isFlagged);

  ignore = [...ignore, { x, y }, ...neighbors];

  for (let cell of neighbors) {
    board = open(board, cell.x, cell.y);
    if (mineCountFor(board, cell) === 0)
      board = expand(board, cell.x, cell.y, ignore);
  }

  return board;
}

export type BoardAction =
  | {
      type: "open";
      x: number;
      y: number;
    }
  | {
      type: "space";
      mouse: { x: number; y: number };
    }
  | { type: "click"; cell: Types.Cell };

function boardReducer(
  { board, status }: BoardState,
  action: BoardAction
): BoardState {
  switch (action.type) {
    case "open":
      return {
        board: board.with(
          action.y,
          board[action.y].with(action.x, {
            ...board[action.y][action.x],
            isOpen: true,
          })
        ),
        status,
      };

    case "click":
      if (status === "initial") {
        board = generateMinesFor(board, 9, 9, 9, action.cell.x, action.cell.y);
        board = open(board, action.cell.x, action.cell.y);
        return {
          board: expand(board, action.cell.x, action.cell.y),
          status: "active",
        };
      } else if (status === "active") {
        if (action.cell.isMine) {
          return { board: open(board, action.cell.x, action.cell.y), status };
        } else if (!action.cell.isOpen) {
          board = open(board, action.cell.x, action.cell.y);

          if (mineCountFor(board, action.cell) === 0)
            board = expand(board, action.cell.x, action.cell.y);

          return { board, status };
        }
      }
      return { board, status };
    case "space":
      let { mouse } = action;
      let cellHtml = document
        .elementsFromPoint(mouse.x, mouse.y)
        .find((elem) =>
          elem.matches(".cell[data-x][data-y]")
        ) as HTMLDivElement;
      if (!cellHtml) return { board, status };
      let x = Number(cellHtml.dataset.x),
        y = Number(cellHtml.dataset.y);

      let cell = board.flat().find((c) => c.x === x && c.y === y);
      if (!cell) return { board, status };

      if (
        cell.isOpen &&
        mineCountFor(board, cell) === flagCountFor(board, cell)
      ) {
        board = expand(board, cell.x, cell.y);
      } else {
        board = board.with(
          cell.y,
          board[cell.y].with(cell.x, {
            ...cell,
            isFlagged: !board[cell.y][cell.x].isFlagged,
          })
        );
      }

      return {
        board,
        status,
      };
  }
}

function Board() {
  let [{ board }, dispatch] = useReducer(boardReducer, emptyBoard(9, 9));
  let [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let track = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", track);
    return () => window.removeEventListener("mousemove", track);
  }, []);

  useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      if (e.key === " ") dispatch({ type: "space", mouse });
    }
    window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown);
  }, [mouse, board]);

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
