import React, { useEffect, useReducer } from "react";
import Board from "./Board/Board";
import { BoardContext, boardReducer, emptyBoard } from "./state";

function Game() {
  let [state, dispatch] = useReducer(boardReducer, emptyBoard());

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
    <BoardContext.Provider value={[state, dispatch]}>
      <Board />
    </BoardContext.Provider>
  );
}

export default Game;
