import React, { useEffect } from "react";
import Board from "./Board/Board";
import { useDispatch } from "react-redux";
import { space } from "./state/game";

function Game() {
  let dispatch = useDispatch();

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

  return <Board />;
}

export default Game;
