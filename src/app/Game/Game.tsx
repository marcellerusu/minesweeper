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
