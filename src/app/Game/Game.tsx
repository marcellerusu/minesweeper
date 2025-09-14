import React from "react";
import type { Point } from "@/app/types";
import { useWindowEvent } from "@/shared/events";
import { reset, space } from "@/app/state/game";
import { useDispatch } from "@/app/store";
import Board from "./Board/Board";
import Header from "./Header/Header";

// we don't want to track this stuff in react state
let cellSize = localStorage.getItem("--cell-size") ?? "40";
document.body.style.setProperty("--cell-size", `${cellSize}px`);
let mouse: Point;

function Game() {
  let dispatch = useDispatch();
  useWindowEvent("keydown", (e) => {
    if (e.key === " ") {
      e.preventDefault();
      dispatch(space(mouse));
    } else if (e.key === "r") {
      dispatch(reset());
    }
  });
  useWindowEvent("mouseover", (e) => {
    let cellHtml = (e.target as any).closest(".cell[data-x][data-y]");
    if (!cellHtml) return;
    // guaranteed to exist since the .closest(".cell[data-x][data-y]")
    mouse = { x: Number(cellHtml.dataset.x), y: Number(cellHtml.dataset.y) };
  });
  return (
    <div className="game">
      <Header />
      <Board />
    </div>
  );
}

export default Game;
