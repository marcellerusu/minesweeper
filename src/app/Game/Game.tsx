import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hover, reset, space } from "@/app/state/game";
import { RootState } from "@/app/store";
import Board from "./Board/Board";
import Header from "./Header/Header";
import "./Game.css";

function Game() {
  let dispatch = useDispatch();
  let isEmpty = useSelector(({ game: { board } }: RootState) =>
    board.every((row) => row.every((cell) => !cell.isOpen))
  );

  useEffect(() => {
    let cellSize = localStorage.getItem("--cell-size") ?? "40";
    document.body.style.setProperty("--cell-size", `${cellSize}px`);

    // all this is to be able to flag / expand a cell by pressing space
    // we can't use traditional events on the given cell, since we aren't
    // directly interacting with the cell
    //
    // instead, we track the mouse movement and `hover` the given cell
    // by examining the cell html element at the mouse position
    // and grabbing it's x/y coordinates sorted in data attributes
    // this is significantly easier & faster than trying to figure this all out
    // via react state.
    //
    // once a space is pressed, we flag / expand the currently hovered cell
    //
    // an optimization we could do is to not `hover` the cell on each mouse move
    // but i like seeing the white border around the cell the mouse is under
    // and as far as i can tell it has negligible performance cost

    function trackMouse(e: MouseEvent) {
      let cellHtml = document
        .elementsFromPoint(e.clientX, e.clientY)
        .find((elem) =>
          elem.matches(".cell[data-x][data-y]")
        ) as HTMLDivElement;
      // in case the mouse isn't on top of a cell
      if (!cellHtml) return dispatch(hover(null));

      // guaranteed to exist since the .matches(".cell[data-x][data-y]")
      let x = Number(cellHtml.dataset.x),
        y = Number(cellHtml.dataset.y);

      dispatch(hover({ x, y }));
    }

    function onKeydown(e: KeyboardEvent) {
      if (e.key === " ") {
        e.preventDefault();
        dispatch(space());
      }
    }

    window.addEventListener("mousemove", trackMouse);
    window.addEventListener("keydown", onKeydown);
    return () => {
      window.removeEventListener("mousemove", trackMouse);
      window.removeEventListener("keydown", onKeydown);
    };
  }, []);

  let isGameLost = useSelector(({ game: { board } }: RootState) =>
    board.some((row) => row.some((cell) => cell.isMine && cell.isOpen))
  );
  let isGameWon = useSelector(({ game: { board } }: RootState) =>
    board.every((row) =>
      row.every((cell) => {
        if (cell.isFlagged) {
          return cell.isMine;
        } else if (cell.isMine) {
          return !cell.isOpen;
        } else {
          return cell.isOpen;
        }
      })
    )
  );
  let status: "stopped" | "playing" | "reset";
  if (isEmpty) status = "reset";
  else if (isGameLost || isGameWon) status = "stopped";
  else status = "playing";

  return (
    <div className="game">
      <Header status={status} />
      <Board isGameWon={isGameWon} />
      {isGameLost && (
        <div onClick={() => dispatch(reset())} className="game-over-msg lost">
          You lost
          <button>play again</button>
        </div>
      )}
      {isGameWon && (
        <div onClick={() => dispatch(reset())} className="game-over-msg won">
          You won
          <button>play again</button>
        </div>
      )}
    </div>
  );
}

export default Game;
