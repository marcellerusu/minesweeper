import { createSlice } from "@reduxjs/toolkit";
import type { Cell, Board } from "../types";
import type { Point } from "../types";

const WIDTH = 9,
  HEIGHT = 9,
  TOTAL_MINES = 9;

type GameState = {
  board: Cell[][];
  status: "initial" | "active";
};

function emptyCell(x: number, y: number): Cell {
  return { isMine: false, isOpen: false, isFlagged: false, x, y };
}

export function emptyGame(): GameState {
  return {
    board: Array.from({ length: HEIGHT }, (_, y) =>
      Array.from({ length: WIDTH }, (_, x) => emptyCell(x, y))
    ),
    status: "initial",
  };
}

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
    board[y][x].isMine = true;
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

/**
 * expand the neighbors of a given cell
 * - if a neighbor also has 0 mine neighbors, expand that neighbor
 * - does not expand flagged cells
 */
function expand(board: Board, cell: Point, ignore: Point[] = []) {
  let neighbors = neighborsOf(board, cell)
    .filter((a) => !ignore.some((b) => b.x === a.x && b.y === a.y))
    .filter(({ isFlagged, isOpen }) => !isFlagged && !isOpen);

  ignore = [...ignore, cell, ...neighbors];

  for (let cell of neighbors) {
    board[cell.y][cell.x].isOpen = true;
    if (mineCountFor(board, cell) === 0) expand(board, cell, ignore);
  }
}

let gameSlice = createSlice({
  name: "board",
  initialState: emptyGame(),
  reducers: {
    /**
     * # handle cell click
     * open the current cell, and expand if no neighboring mines
     *
     * - if the game hasn't started, the first click will generate the mines for board
     */
    click(state, action: { payload: Point }) {
      let { x, y } = action.payload;
      let cell = state.board[y][x]!;
      if (cell.isFlagged) return;
      switch (state.status) {
        case "initial":
          generateMinesFor(state.board, cell);
          cell.isOpen = true;
          expand(state.board, cell);
          state.status = "active";
          break;
        case "active":
          if (cell.isMine) {
            cell.isOpen = true;
          } else if (!cell.isOpen) {
            cell.isOpen = true;
            if (mineCountFor(state.board, cell) === 0)
              expand(state.board, cell);
          }
      }
    },

    /**
     * pressing space on top of a cell means one of the following
     * - open the neighboring mines (if the cell is open, and # flag == mine count for cell)
     * - flag/unflag the cell (if the cell is unopened)
     */
    space(state, action: { payload: { mouse: Point } }) {
      let { mouse } = action.payload;
      // get the cell dom element based on current mouse position
      let cellHtml = document
        .elementsFromPoint(mouse.x, mouse.y)
        .find((elem) =>
          elem.matches(".cell[data-x][data-y]")
        ) as HTMLDivElement;

      // in case the mouse isn't on top of a cell
      if (!cellHtml) return;

      // guaranteed to exist since the .matches(".cell[data-x][data-y]")
      let x = Number(cellHtml.dataset.x),
        y = Number(cellHtml.dataset.y);

      // find the cell in react state <- if it doesn't exist, we got a big problem
      // it is better to crash than ignore the issue here
      let cell = state.board.flat().find((c) => c.x === x && c.y === y)!;

      if (cell.isOpen) {
        if (
          mineCountFor(state.board, cell) === flagCountFor(state.board, cell)
        ) {
          expand(state.board, cell);
        } else {
        }
      } else {
        cell.isFlagged = !cell.isFlagged;
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { click, space } = gameSlice.actions;

export default gameSlice.reducer;
