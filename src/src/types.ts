export type Cell = {
  isMine: boolean;
  isOpen: boolean;
  isFlagged: boolean;
  x: number;
  y: number;
};

export type Board = Cell[][];
