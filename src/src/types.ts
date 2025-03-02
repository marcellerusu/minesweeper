export type Point = { x: number; y: number };

export type Cell = {
  isMine: boolean;
  isOpen: boolean;
  isFlagged: boolean;
} & Point;

export type Board = Cell[][];
