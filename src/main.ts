import "./style.css";
import ICONS, { svg_for } from "./icons";

type Cell = {
  is_mine: boolean;
  is_open: boolean;
  is_flagged: boolean;
  x: number;
  y: number;
};

class Game {
  #board: Cell[][];
  constructor(
    readonly WIDTH: number,
    readonly HEIGHT: number,
    readonly MINES: number
  ) {
    this.#board = Array.from({ length: HEIGHT }, (_, y) =>
      Array.from({ length: WIDTH }, (_, x) => ({
        is_mine: false,
        is_open: false,
        is_flagged: false,
        x,
        y,
      }))
    );
  }

  load_mines(opening_x: number, opening_y: number) {
    let number_of_mines_left = this.MINES;
    while (number_of_mines_left > 0) {
      let x = Math.floor(Math.random() * this.WIDTH);
      let y = Math.floor(Math.random() * this.HEIGHT);
      // ensure that you always start with a wide open first move
      if (Math.abs(x - opening_x) <= 1 && Math.abs(y - opening_y) <= 1)
        continue;
      if (this.#board[y][x].is_mine) continue;
      this.#board[y][x].is_mine = true;
      number_of_mines_left--;
    }
  }

  is_empty() {
    // no mines
    return this.#board.every((row) => row.every((cell) => !cell.is_mine));
  }

  at(x: number, y: number): Readonly<Cell> | undefined {
    return this.#board[y]?.[x];
  }

  neighbors_of(x: number, y: number): Readonly<Cell>[] {
    return [
      // above
      this.at(x, y - 1),
      // below
      this.at(x, y + 1),
      // to the left
      this.at(x - 1, y),
      // to the right
      this.at(x + 1, y),
      // to the top left
      this.at(x - 1, y - 1),
      // to the top right
      this.at(x + 1, y - 1),
      // to the bottom left
      this.at(x - 1, y + 1),
      // to the bottom right
      this.at(x + 1, y + 1),
    ].filter((item) => typeof item !== "undefined");
  }

  number_of_flagged_near(x: number, y: number): number {
    return this.neighbors_of(x, y).filter((cell) => cell.is_flagged).length;
  }

  number_of_mines_near(x: number, y: number): number {
    return this.neighbors_of(x, y).filter((cell) => cell.is_mine).length;
  }

  toggle_flag(x: number, y: number) {
    this.#board[y][x].is_flagged = !this.#board[y][x].is_flagged;
  }

  force_expand(x: number, y: number) {
    for (let cell of this.neighbors_of(x, y)) {
      if (!cell.is_flagged) this.click(cell.x, cell.y);
    }
  }

  click(x: number, y: number) {
    let cell = this.at(x, y);
    if (!cell) throw "out_of_range";

    if (cell.is_mine) {
      // open, and now the game is over
      this.#board[y][x].is_open = true;
    } else if (!cell.is_open) {
      // open current cell
      this.#board[y][x].is_open = true;
      if (this.number_of_mines_near(x, y) === 0)
        // open up the neighbors
        for (let neighbor of this.neighbors_of(x, y))
          this.click(neighbor.x, neighbor.y);
    }
  }

  is_game_over() {
    return this.#board.some((row) =>
      row.some((cell) => cell.is_mine && cell.is_open)
    );
  }

  is_won() {
    return this.#board.every((row) =>
      row.every((cell) => (cell.is_mine && cell.is_flagged) || cell.is_open)
    );
  }
}

function init_board_html(game: Game) {
  let board = document.createElement("div");
  board.classList.add("board");
  board.style.setProperty("--width", game.WIDTH.toString());
  board.style.setProperty("--height", game.HEIGHT.toString());
  for (let y = 0; y < game.HEIGHT; y++) {
    let row = document.createElement("span");
    for (let x = 0; x < game.WIDTH; x++) {
      let cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.isOpen = "false";
      cell.dataset.isFlagged = "false";
      cell.dataset.x = x.toString();
      cell.dataset.y = y.toString();
      row.append(cell);
    }
    board.append(row);
  }
  return board;
}

function load_mines_html(board: HTMLDivElement, game: Game) {
  for (let cell of board.querySelectorAll(
    ".cell"
  ) as NodeListOf<HTMLDivElement>) {
    let x = Number(cell.dataset.x),
      y = Number(cell.dataset.y);
    let { is_mine, is_flagged, is_open } = game.at(x, y)!;
    let mine_count = game.number_of_mines_near(x, y);
    cell.dataset.isMine = is_mine.toString();
    cell.dataset.isOpen = is_open.toString();
    cell.dataset.mineCount = mine_count.toString();
    cell.dataset.isFlagged = is_flagged.toString();
    cell.dataset.x = x.toString();
    cell.dataset.y = y.toString();
    if (is_mine) cell.innerHTML += svg_for(ICONS.mine);
    else if (mine_count !== 0) cell.innerHTML += svg_for(ICONS[mine_count]);

    cell.innerHTML += svg_for(ICONS.flag);
  }
}

function update_board_html(game: Game, board: HTMLDivElement) {
  for (let cell of board.querySelectorAll(
    ".cell"
  ) as NodeListOf<HTMLDivElement>) {
    let { x, y } = cell.dataset;
    let { is_open, is_flagged } = game.at(Number(x), Number(y))!;
    cell.dataset.isOpen = is_open.toString();
    cell.dataset.isFlagged = is_flagged.toString();
  }
}

function start(game: Game) {
  let board = init_board_html(game);
  document.querySelector("#app")!.append(board);

  let mouse_x: number, mouse_y: number;

  window.addEventListener("mousemove", (e) => {
    mouse_x = e.clientX;
    mouse_y = e.clientY;
  });

  board.addEventListener("click", (e) => {
    if (game.is_game_over() || game.is_won()) return;
    let cell = (e.target as HTMLElement).closest(".cell") as HTMLDivElement;
    let x = Number(cell.dataset.x),
      y = Number(cell.dataset.y);

    if (game.is_empty()) {
      game.load_mines(x, y);
      load_mines_html(board, game);
    }
    if (game.at(x, y)!.is_flagged) return;
    game.click(x, y);
    update_board_html(game, board);
    if (game.is_game_over()) board.classList.add("game-over");
    else if (game.is_won()) board.classList.add("game-won");
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === " ") {
      if (game.is_game_over() || game.is_won()) return;
      e.preventDefault();
      let cell: HTMLDivElement;
      for (let elem of document.elementsFromPoint(mouse_x, mouse_y)) {
        cell = elem.closest(".cell") as HTMLDivElement;
        if (cell) break;
      }
      let { x: string_x, y: string_y, mineCount } = cell!.dataset;
      let x = Number(string_x);
      let y = Number(string_y);

      if (game.is_empty()) {
        game.load_mines(x, y);
        load_mines_html(board, game);
      }

      // if cell is closed, mark as a flag
      if (cell!.dataset.isOpen === "false") {
        game.toggle_flag(x, y);
      } else {
        // if cell is open, and the number of flagged neighbors match the mine count
        // try to open all neighboring cells
        if (game.number_of_flagged_near(x, y) === Number(mineCount))
          game.force_expand(x, y);
      }
      update_board_html(game, board);
      if (game.is_game_over()) board.classList.add("game-over");
      else if (game.is_won()) board.classList.add("game-won");
    }
  });
}

start(new Game(10, 10, 9));
