import { useSelector } from "@/app/store";

export function useIsGameWon() {
  return useSelector(({ game: { board } }) =>
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
}
