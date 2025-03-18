import React from "react";
import Dialog from "@/shared/Dialog/Dialog";
import { useIsGameWon } from "@/app/state/hooks";
import { useDispatch, useSelector } from "@/app/store";
import { reset } from "@/app/state/game";
import MineCounter from "./MineCounter";
import Settings from "./Settings/Settings";
import Timer from "./Timer";
import "./Header.css";

function Header() {
  let dispatch = useDispatch();
  let isGameLost = useSelector(({ board }) =>
    board.some((row) => row.some((cell) => cell.isMine && cell.isOpen))
  );
  let isGameWon = useIsGameWon();
  return (
    <header>
      <MineCounter />
      <Settings />
      <Timer isGameOver={isGameLost || isGameWon} />
      <Dialog
        open={isGameLost || isGameWon}
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
