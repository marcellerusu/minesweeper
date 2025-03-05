import { createSlice } from "@reduxjs/toolkit";
import type { Cell, Board, Point } from "@/app/types";

const DEFAULT_WIDTH = 9,
  DEFAULT_HEIGHT = 9,
  DEFAULT_TOTAL_MINES = 9;

type GameState = {
  board: Cell[][];
  settings: {
    width: number;
    height: number;
    numberOfMines: number;
    difficulty: "beginner" | "intermediate" | "expert";
  };
  position: Point | null;
  status: "initial" | "active";
};

function emptyCell(x: number, y: number): Cell {
  return { isMine: false, isOpen: false, isFlagged: false, x, y };
}

export function emptyGame({
  width,
  height,
  numberOfMines,
  difficulty,
}: GameState["settings"]): GameState {
  return {
    board: Array.from({ length: height }, (_, y) =>
      Array.from({ length: width }, (_, x) => emptyCell(x, y))
    ),
    status: "initial",
    settings: { width, height, numberOfMines, difficulty },
    position: null,
  };
}

/**
 * Given an empty board, fill it up with `TOTAL_MINES` worth of mines
 */
function generateMinesFor({ board, settings }: GameState, opening: Point) {
  let numberOfMinesLeft = settings.numberOfMines;
  while (numberOfMinesLeft > 0) {
    // generate a point and make sure that it doesn't exist in the board
    let x = Math.floor(Math.random() * settings.width),
      y = Math.floor(Math.random() * settings.height);
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
  initialState: emptyGame({
    width: Number(localStorage.getItem("width") ?? DEFAULT_WIDTH),
    height: Number(localStorage.getItem("height") ?? DEFAULT_HEIGHT),
    numberOfMines: Number(
      localStorage.getItem("number-of-mines") ?? DEFAULT_TOTAL_MINES
    ),
    difficulty:
      (localStorage.getItem(
        "difficulty"
      ) as GameState["settings"]["difficulty"]) ?? "beginner",
  }),
  reducers: {
    /**
     * # handle cell click
     * open the current cell, and expand if no neighboring mines
     *
     * - if the game hasn't started, the first click will generate the mines for board
     */
    click(state) {
      if (!state.position) return;
      let { x, y } = state.position;
      let cell = state.board[y][x]!;
      state.position = { x, y };
      if (cell.isFlagged) return;
      switch (state.status) {
        case "initial":
          generateMinesFor(state, cell);
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
    space(state) {
      if (!state.position) return;

      let { x, y } = state.position;
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

    movePosition(
      state,
      action: {
        payload: { dir: "left" | "right" | "up" | "down"; jump: boolean };
      }
    ) {
      if (!state.position) return;

      let dist = action.payload.jump ? 2 : 1;

      switch (action.payload.dir) {
        case "left":
          state.position.x = Math.max(state.position.x - dist, 0);
          break;
        case "right":
          state.position.x = Math.min(
            state.position.x + dist,
            state.settings.width - 1
          );
          break;
        case "up":
          state.position.y = Math.max(state.position.y - dist, 0);
          break;
        case "down":
          state.position.y = Math.min(
            state.position.y + dist,
            state.settings.height - 1
          );
          break;
      }
    },

    reset(state) {
      for (let cell of state.board.flat()) {
        cell.isOpen = false;
        cell.isFlagged = false;
        cell.isMine = false;
      }
      state.status = "initial";
    },

    changeDifficulty(
      state,
      action: { payload: "beginner" | "intermediate" | "expert" }
    ) {
      switch (action.payload) {
        case "beginner":
          state.settings.height = 9;
          state.settings.width = 9;
          state.settings.numberOfMines = 10;
          break;
        case "intermediate":
          state.settings.height = 16;
          state.settings.width = 16;
          state.settings.numberOfMines = 40;
          break;
        case "expert":
          state.settings.height = 16;
          state.settings.width = 30;
          state.settings.numberOfMines = 99;
          break;
      }
      localStorage.setItem("width", state.settings.width.toString());
      localStorage.setItem("height", state.settings.height.toString());
      localStorage.setItem(
        "number-of-mines",
        state.settings.numberOfMines.toString()
      );
      localStorage.setItem("difficulty", action.payload);
      state.board = emptyGame(state.settings).board;
      state.settings.difficulty = action.payload;
      state.status = "initial";
    },

    hover(state, { payload }: { payload: Point | null }) {
      if (payload?.x === state.position?.x && payload?.y === state.position?.y)
        return;
      state.position = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { click, space, reset, changeDifficulty, movePosition, hover } =
  gameSlice.actions;

export default gameSlice.reducer;
