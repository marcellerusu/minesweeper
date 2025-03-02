import React, { useEffect, useReducer } from "react";
import type * as Types from "./types";
import type { Point } from "./types";
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
  return { isMine: false, isOpen: false, isFlagged: false, x, y };
}

function emptyBoard(): BoardState {
  return {
    board: Array.from({ length: HEIGHT }, (_, y) =>
      Array.from({ length: WIDTH }, (_, x) => emptyCell(x, y))
    ),
    status: "initial",
  };
}

function generateMinesFor(board: Types.Board, opening: Point) {
  let numberOfMinesLeft = TOTAL_MINES;
  while (numberOfMinesLeft > 0) {
    // generate a point and make sure that it doesn't exist in the board
    let x = Math.floor(Math.random() * WIDTH),
      y = Math.floor(Math.random() * HEIGHT);
    // ensure that you always start with a wide open first move
    if (Math.abs(x - opening.x) <= 1 && Math.abs(y - opening.y) <= 1) continue;
    if (board[y][x].isMine) continue;
    board = board.with(y, board[y].with(x, { ...board[y][x], isMine: true }));
    numberOfMinesLeft--;
  }
  return board;
}

function neighborsOf(board: Types.Board, { x, y }: Point): Readonly<Cell>[] {
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

function mineCountFor(board: Types.Board, cell: Point): number {
  return neighborsOf(board, cell).filter((c) => c.isMine).length;
}

function flagCountFor(board: Types.Board, cell: Point): number {
  return neighborsOf(board, cell).filter((c) => c.isFlagged).length;
}

function open(board: Types.Board, { x, y }: Point) {
  return board.with(y, board[y].with(x, { ...board[y][x], isOpen: true }));
}

function expand(
  board: Types.Board,
  cell: Point,
  ignore: Point[] = []
): Types.Board {
  let neighbors = neighborsOf(board, cell)
    .filter((a) => !ignore.some((b) => b.x === a.x && b.y === a.y))
    .filter(({ isFlagged }) => !isFlagged);

  ignore = [...ignore, cell, ...neighbors];

  return neighbors.reduce((board, cell) => {
    board = open(board, cell);
    if (mineCountFor(board, cell) === 0) {
      return expand(board, cell, ignore);
    } else {
      return board;
    }
  }, board);
}

function handleClick(
  { board, status }: BoardState,
  cell: Types.Cell
): BoardState {
  switch (status) {
    case "initial":
      board = generateMinesFor(board, cell);
      board = open(board, cell);
      return { board: expand(board, cell), status: "active" };
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

/**
 * pressing space on top of a cell means one of the following
 * - open the neighboring mines (if the cell is open, and # flag == mine count for cell)
 * - flag/unflag the cell (if the cell is unopened)
 */
function handleSpace(board: Types.Board, mouse: Point): Types.Board {
  // get the cell dom element based on current mouse position
  let cellHtml = document
    .elementsFromPoint(mouse.x, mouse.y)
    .find((elem) => elem.matches(".cell[data-x][data-y]")) as HTMLDivElement;

  // in case the mouse isn't on top of a cell
  if (!cellHtml) return board;

  // guaranteed to exist since the .matches(".cell[data-x][data-y]")
  let x = Number(cellHtml.dataset.x),
    y = Number(cellHtml.dataset.y);

  // find the cell in react state <- if it doesn't exist, we got a big problem
  // it is better to crash than ignore the issue here
  let cell = board.flat().find((c) => c.x === x && c.y === y)!;

  if (cell.isOpen) {
    if (mineCountFor(board, cell) === flagCountFor(board, cell)) {
      return expand(board, cell);
    } else {
      return board;
    }
  } else {
    return board.with(
      y,
      board[y].with(x, { ...cell, isFlagged: !cell.isFlagged })
    );
  }
}

export type BoardAction =
  | { type: "open"; cell: Point }
  | { type: "space"; mouse: Point }
  | { type: "click"; cell: Types.Cell };

function boardReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case "open":
      return { ...state, board: open(state.board, action.cell) };
    case "click":
      return handleClick(state, action.cell);
    case "space":
      return { ...state, board: handleSpace(state.board, action.mouse) };
  }
}

function Game() {
  let [{ board }, dispatch] = useReducer(boardReducer, emptyBoard());

  useEffect(() => {
    let mouse = { x: 0, y: 0 };
    function trackMouse(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
    function onKeydown(e: KeyboardEvent) {
      if (e.key === " ") dispatch({ type: "space", mouse });
    }
    window.addEventListener("mousemove", trackMouse);
    window.addEventListener("keydown", onKeydown);
    return () => {
      window.removeEventListener("mousemove", trackMouse);
      window.removeEventListener("keydown", onKeydown);
    };
  }, []);

  return (
    <Board board={board} mineCountFor={mineCountFor} dispatch={dispatch} />
  );
}

export default Game;
