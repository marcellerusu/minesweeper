import "./Board.css";
import React, { useEffect, useState } from "react";
import type * as Types from "../types";
import Cell from "../Cell/Cell";

type Board = Types.Cell[][];

function emptyBoard(width: number, height: number): Board {
  return Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => ({
      isMine: false,
      isOpen: false,
      isFlagged: false,
      x,
      y,
    }))
  );
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

function Board() {
  let [width, _setWidth] = useState(9);
  let [height, _setHeight] = useState(9);
  let [board, setBoard] = useState(emptyBoard(width, height));
  let [totalNumberOfMines, _setTotalNumberOfMines] = useState(9);
  let [status, setStatus] = useState<"initial" | "active">("initial");
  let [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let track = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", track);
    return () => window.removeEventListener("mousemove", track);
  }, []);

  function currentlyHoveringCell(board: Board): Cell | undefined {
    let cellHtml = document
      .elementsFromPoint(mouse.x, mouse.y)
      .find((elem) => elem.matches(".cell[data-x][data-y]")) as HTMLDivElement;
    if (!cellHtml) return;
    let x = Number(cellHtml.dataset.x),
      y = Number(cellHtml.dataset.y);

    return board.flat().find((c) => c.x === x && c.y === y);
  }

  useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      if (e.key === " ") onSpace();
    }
    window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown);
  }, [mouse, board]);

  function onSpace() {
    setBoard((board) => {
      let cell = currentlyHoveringCell(board);
      if (!cell) return board;

      if (
        cell.isOpen &&
        mineCountFor(board, cell) === flagCountFor(board, cell)
      ) {
        return expand(board, cell.x, cell.y);
      } else {
        return board.with(
          cell.y,
          board[cell.y].with(cell.x, {
            ...cell,
            isFlagged: !board[cell.y][cell.x].isFlagged,
          })
        );
      }
    });
  }

  function handleClickWhenInitial(cell: Cell) {
    setBoard((board) => {
      board = generateMinesFor(
        board,
        totalNumberOfMines,
        width,
        height,
        cell.x,
        cell.y
      );

      board = open(board, cell.x, cell.y);
      return expand(board, cell.x, cell.y);
    });

    setStatus("active");
  }

  function handleClickWhenActive(cell: Cell) {
    if (cell.isMine) {
      setBoard((board) => open(board, cell.x, cell.y));
    } else if (!cell.isOpen) {
      setBoard((board) => {
        board = open(board, cell.x, cell.y);

        if (mineCountFor(board, cell) === 0)
          board = expand(board, cell.x, cell.y);

        return board;
      });
    }
  }

  function click(cell: Cell) {
    if (status === "initial") handleClickWhenInitial(cell);
    else if (status === "active") handleClickWhenActive(cell);
  }

  return (
    <div className="board">
      {board.map((row, y) => (
        <span key={`row-${y}`}>
          {row.map((cell) => (
            <Cell
              key={`cell-${cell.x}-${cell.y}`}
              onPress={() => click(cell)}
              cell={cell}
              mineCount={mineCountFor(board, cell)}
            />
          ))}
        </span>
      ))}
    </div>
  );
}

export default Board;
