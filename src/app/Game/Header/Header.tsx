import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { reset } from "@/app/state/game";
import MineCounter from "./MineCounter";
import Timer from "./Timer";
import Settings from "./Settings/Settings";
import "./Header.css";

function Header() {
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
  let status: "stopped" | "playing" | "reset";
  if (isEmpty) status = "reset";
  else if (isGameLost || isGameWon) status = "stopped";
  else status = "playing";

  return (
    <header>
      <MineCounter />
      <Settings />
      <Timer status={status} />
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
    </header>
  );
}

export default Header;
