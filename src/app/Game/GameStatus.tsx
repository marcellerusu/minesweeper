import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "@/app/store";

function GameStatus(){
  let dispatch = useDispatch();
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

  if (isGameLost)
    return         <div onClick={() => dispatch(reset())} className="game-over-msg lost">
            You lost
            <button>play again</button>
          </div>
  if (
       isGameWon) return (
          <div onClick={() => dispatch(reset())} className="game-over-msg won">
            You won
            <button>play again</button>
          </div>
        )}
}

export default GameStatus