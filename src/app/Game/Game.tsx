import React, { useEffect } from "react";
import type { Point } from "@/app/types";
import { reset, space } from "@/app/state/game";
import { useDispatch } from "@/app/store";
import Board from "./Board/Board";
import Header from "./Header/Header";
import { useKeyPressed } from "@/shared/events";

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
 */
function useSpaceControls() {
  let dispatch = useDispatch();

  useEffect(() => {
    let cellSize = localStorage.getItem("--cell-size") ?? "40";
    document.body.style.setProperty("--cell-size", `${cellSize}px`);
    let mouse: Point;

    function trackMouse(e: MouseEvent) {
      let cellHtml = document
        .elementsFromPoint(e.clientX, e.clientY)
        .find((elem): elem is HTMLDivElement =>
          elem.matches(".cell[data-x][data-y]")
        );

      // in case the mouse isn't on top of a cell
      if (!cellHtml) return;

      // guaranteed to exist since the .matches(".cell[data-x][data-y]")
      mouse = { x: Number(cellHtml.dataset.x), y: Number(cellHtml.dataset.y) };
    }

    function onKeydown(e: KeyboardEvent) {
      if (e.key === " ") {
        e.preventDefault();
        dispatch(space(mouse));
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
  let dispatch = useDispatch();
  useKeyPressed("r", () => dispatch(reset()));
  return (
    <div className="game">
      <Header />
      <Board />
    </div>
  );
}

export default Game;
