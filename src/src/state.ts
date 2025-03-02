import type { Cell, Board } from "./types";
import type { Point } from "./types";
import { createContext, Dispatch } from "react";

const WIDTH = 9,
  HEIGHT = 9,
  TOTAL_MINES = 9;

type BoardState = {
  board: Cell[][];
  status: "initial" | "active";
};

function emptyCell(x: number, y: number): Cell {
  return { isMine: false, isOpen: false, isFlagged: false, x, y };
}

export function emptyBoard(): BoardState {
  return {
    board: Array.from({ length: HEIGHT }, (_, y) =>
      Array.from({ length: WIDTH }, (_, x) => emptyCell(x, y))
    ),
    status: "initial",
  };
}

export const BoardContext = createContext<[BoardState, Dispatch<BoardAction>]>([
  emptyBoard(),
  (_action: BoardAction) => {},
]);

/**
 * Given an empty board, fill it up with `TOTAL_MINES` worth of mines
 */
function generateMinesFor(board: Board, opening: Point) {
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

/**
 * get the neighboring cells on the board given a point
 */
function neighborsOf(board: Board, { x, y }: Point): Cell[] {
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

/**
 * # of mines in the neighbors
 */
export function mineCountFor(board: Board, cell: Point): number {
  return neighborsOf(board, cell).filter((c) => c.isMine).length;
}

/**
 * # of flagged cells in the neighbors
 */
function flagCountFor(board: Board, cell: Point): number {
  return neighborsOf(board, cell).filter((c) => c.isFlagged).length;
}

function open(board: Board, { x, y }: Point) {
  return board.with(y, board[y].with(x, { ...board[y][x], isOpen: true }));
}

/**
 * expand the neighbors of a given cell
 * - if a neighbor also has 0 mine neighbors, expand that neighbor
 * - does not expand flagged cells
 */
function expand(board: Board, cell: Point, ignore: Point[] = []): Board {
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

/**
 * # handle cell click
 * open the current cell, and expand if no neighboring mines
 *
 * - if the game hasn't started, the first click will generate the mines for board
 */
function handleClick({ board, status }: BoardState, cell: Cell): BoardState {
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
function handleSpace(board: Board, mouse: Point): Board {
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
  | { type: "click"; cell: Cell }
  | { type: "space"; mouse: Point };

export function boardReducer(
  state: BoardState,
  action: BoardAction
): BoardState {
  switch (action.type) {
    case "click":
      return handleClick(state, action.cell);
    case "space":
      return { ...state, board: handleSpace(state.board, action.mouse) };
  }
}
