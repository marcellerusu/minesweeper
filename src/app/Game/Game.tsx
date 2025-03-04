import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { reset, space } from "../state/game";
import { RootState } from "../store";
import Board from "./Board/Board";
import Header from "./Header/Header";
import "./Game.css";

function Game() {
  let dispatch = useDispatch();
  let isEmpty = useSelector(({ game: { board } }: RootState) =>
    board.every((row) => row.every((cell) => !cell.isOpen))
  );
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

  useEffect(() => {
    let mouse = { x: 0, y: 0 };
    function trackMouse(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
    function onKeydown(e: KeyboardEvent) {
      if (e.key === " ") {
        e.preventDefault();
        dispatch(space({ mouse }));
      }
    }
    window.addEventListener("mousemove", trackMouse);
    window.addEventListener("keydown", onKeydown);
    return () => {
      window.removeEventListener("mousemove", trackMouse);
      window.removeEventListener("keydown", onKeydown);
    };
  }, []);

  let status: "stopped" | "playing" | "reset";
  if (isEmpty) status = "reset";
  else if (isGameLost || isGameWon) status = "stopped";
  else status = "playing";

  return (
    <div className="game">
      <Header status={status} />
      <Board isGameWon={isGameWon} />
      {isGameLost && (
        <span onClick={() => dispatch(reset())} className="game-over-msg">
          You lost
        </span>
      )}
      {isGameWon && (
        <span onClick={() => dispatch(reset())} className="game-won-msg">
          You won
        </span>
      )}
    </div>
  );
}

export default Game;
