import "./Game.css";
import React, { useEffect } from "react";
import Board from "./Board/Board";
import { useDispatch, useSelector } from "react-redux";
import { space } from "./state/game";
import { RootState } from "./store";

function Game() {
  let dispatch = useDispatch();
  let isGameLost = useSelector(({ game: { board } }: RootState) =>
    board.some((row) => row.some((cell) => cell.isMine && cell.isOpen))
  );
  let isGameWon = useSelector(({ game: { board } }: RootState) =>
    board.every((row) =>
      row.every(
        (cell) =>
          ((cell.isMine || cell.isFlagged) && !cell.isOpen) || cell.isOpen
      )
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

  return (
    <div className="game">
      <Board />
      {isGameLost && <span className="game-over-msg">You lost</span>}
      {isGameWon && <span className="game-won-msg">You won</span>}
    </div>
  );
}

export default Game;
