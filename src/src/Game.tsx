import React, { useEffect, useReducer, useState } from "react";
import type * as Types from "./types";
import Cell from "./Cell/Cell";
import Board from "./Board/Board";

type BoardState = {
  board: Types.Cell[][];
  status: "initial" | "active";
};

const WIDTH = 9,
  HEIGHT = 9,
  TOTAL_MINES = 9;

function emptyCell(x: number, y: number): Types.Cell {
  return {
    isMine: false,
    isOpen: false,
    isFlagged: false,
    x,
    y,
  };
}

function emptyBoard(): BoardState {
  return {
    board: Array.from({ length: HEIGHT }, (_, y) =>
      Array.from({ length: WIDTH }, (_, x) => emptyCell(x, y))
    ),
    status: "initial",
  };
}

function generateMinesFor(board: Types.Board, opening: Types.Point) {
  let newBoard = board;
  let numberOfMinesLeft = TOTAL_MINES;
  while (numberOfMinesLeft > 0) {
    // generate a point and make sure that it doesn't exist in the board
    let mineX = Math.floor(Math.random() * WIDTH);
    let mineY = Math.floor(Math.random() * HEIGHT);
    // ensure that you always start with a wide open first move
    if (Math.abs(mineX - opening.x) <= 1 && Math.abs(mineY - opening.y) <= 1)
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

function neighborsOf(
  board: Types.Board,
  x: number,
  y: number
): Readonly<Cell>[] {
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

    // need to filter incase we ask for neighbors at the edges of the board
  ].filter((item) => typeof item !== "undefined");
}

function mineCountFor(board: Types.Board, { x, y }: Types.Point): number {
  return neighborsOf(board, x, y).filter((c) => c.isMine).length;
}

function flagCountFor(board: Types.Board, { x, y }: Types.Point): number {
  return neighborsOf(board, x, y).filter((c) => c.isFlagged).length;
}

function open(board: Types.Board, { x, y }: Types.Point) {
  return board.with(y, board[y].with(x, { ...board[y][x], isOpen: true }));
}

function expand(
  board: Types.Board,
  { x, y }: Types.Point,
  ignore: { x: number; y: number }[] = []
): Types.Board {
  let neighbors = neighborsOf(board, x, y)
    .filter((cell) => !ignore.some((c) => c.x === cell.x && c.y === cell.y))
    .filter((cell) => !cell.isFlagged);

  ignore = [...ignore, { x, y }, ...neighbors];

  for (let cell of neighbors) {
    board = open(board, cell);
    if (mineCountFor(board, cell) === 0) board = expand(board, cell, ignore);
  }

  return board;
}

function handleClick(
  { board, status }: BoardState,
  cell: Types.Cell
): BoardState {
  switch (status) {
    case "initial":
      board = generateMinesFor(board, cell);
      board = open(board, cell);
      return {
        board: expand(board, cell),
        status: "active",
      };
    case "active":
      if (cell.isMine) {
        return { board: open(board, cell), status };
      } else if (!cell.isOpen) {
        board = open(board, cell);

        if (mineCountFor(board, cell) === 0) board = expand(board, cell);

        return { board, status };
      } else {
        return { board, status };
      }
  }
}

function handleSpace(
  board: Types.Board,
  mouse: { x: number; y: number }
): Types.Board {
  let cellHtml = document
    .elementsFromPoint(mouse.x, mouse.y)
    .find((elem) => elem.matches(".cell[data-x][data-y]")) as HTMLDivElement;

  if (!cellHtml) return board;

  let x = Number(cellHtml.dataset.x),
    y = Number(cellHtml.dataset.y);

  let cell = board.flat().find((c) => c.x === x && c.y === y);
  if (!cell) return board;

  if (cell.isOpen && mineCountFor(board, cell) === flagCountFor(board, cell))
    return expand(board, cell);
  else
    return board.with(
      cell.y,
      board[cell.y].with(cell.x, {
        ...cell,
        isFlagged: !board[cell.y][cell.x].isFlagged,
      })
    );
}

export type BoardAction =
  | { type: "open"; x: number; y: number }
  | { type: "space"; mouse: { x: number; y: number } }
  | { type: "click"; cell: Types.Cell };

function boardReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case "open":
      return { ...state, board: open(state.board, action) };
    case "click":
      return handleClick(state, action.cell);
    case "space":
      return { ...state, board: handleSpace(state.board, action.mouse) };
  }
}

function Game() {
  let [{ board }, dispatch] = useReducer(boardReducer, emptyBoard());
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
    <Board board={board} mineCountFor={mineCountFor} dispatch={dispatch} />
  );
}

export default Game;
