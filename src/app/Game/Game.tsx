import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { hover, space } from "@/app/state/game";
import Board from "./Board/Board";
import Header from "./Header/Header";

/**
 * This is to be able to flag / expand a cell by pressing space while
 * hovering a cell with the mouse.
 *
 * we can't use traditional events on the given cell, since we aren't
 * directly interacting with the cell
 *
 * instead, we track the mouse movement and `hover` the given cell
 * by examining the cell html element at the mouse position
 * and grabbing it's x/y coordinates sorted in data attributes
 * this is significantly easier & faster than trying to figure this all out
 * via react state.
 *
 * once a space is pressed, we flag / expand the currently hovered cell
 *
 * an optimization we could do is to not `hover` the cell on each mouse move
 * but i like seeing the white border around the cell the mouse is under
 * and as far as i can tell it has negligible performance cost
 */
function useSpaceControls() {
  let dispatch = useDispatch();

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
}

function Game() {
  useSpaceControls();
  return (
    <div className="game">
      <Header />
      <Board />
    </div>
  );
}

export default Game;
