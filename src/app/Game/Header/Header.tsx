import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { reset } from "@/app/state/game";
import MineCounter from "./MineCounter";
import Timer from "./Timer";
import Settings from "./Settings/Settings";
import "./Header.css";
import Dialog from "@/shared/Dialog/Dialog";

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
      <Dialog
        open={status === "stopped"}
        onClose={() => dispatch(reset())}
        className="game-over"
      >
        {isGameLost && <p className="lost">You Lost</p>}
        {isGameWon && <p className="won">You Won</p>}
        <button type="submit" onClick={(_) => dispatch(reset())}>
          play again
        </button>
      </Dialog>
    </header>
  );
}

export default Header;
