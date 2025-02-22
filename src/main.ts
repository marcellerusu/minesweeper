import "./style.css";

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

  is_mine(x: number, y: number): boolean {
    return this.#board[y][x].is_mine;
  }

  is_flagged(x: number, y: number): boolean {
    return this.#board[y][x].is_flagged;
  }

  is_open(x: number, y: number): boolean {
    return this.#board[y][x].is_open;
  }

  open_unless_flagged(x: number, y: number) {
    if (x < 0 || x >= this.WIDTH || y < 0 || y >= this.HEIGHT) return;
    if (this.#board[y][x].is_flagged) return;
    this.click(x, y);
  }

  neighbors_of(x: number, y: number): Cell[] {
    return [
      // above
      this.#board[y - 1]?.[x],
      // below
      this.#board[y + 1]?.[x],
      // to the left
      this.#board[y]?.[x - 1],
      // to the right
      this.#board[y]?.[x + 1],
      // to the top left
      this.#board[y - 1]?.[x - 1],
      // to the top right
      this.#board[y - 1]?.[x + 1],
      // to the bottom left
      this.#board[y + 1]?.[x - 1],
      // to the bottom right
      this.#board[y + 1]?.[x + 1],
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
    for (let cell of this.neighbors_of(x, y))
      this.open_unless_flagged(cell.x, cell.y);
  }

  #try_click_at(
    x: number,
    y: number
  ):
    | "open"
    | "wide_open"
    | "clicked_on_mine"
    | "already_open"
    | "out_of_range" {
    if (x < 0 || x >= this.WIDTH || y < 0 || y >= this.HEIGHT)
      return "out_of_range";
    if (this.#board[y][x].is_mine) return "clicked_on_mine";
    if (this.#board[y][x].is_open) return "already_open";

    // if there's a neighbor mine, only open the current cell
    if (this.neighbors_of(x, y).some((cell) => cell.is_mine)) return "open";

    // otherwise we're wide open!
    return "wide_open";
  }

  click(x: number, y: number) {
    switch (this.#try_click_at(x, y)) {
      case "already_open":
        return;
      case "clicked_on_mine":
        this.#board[y][x].is_open = true;
        return;
      case "open":
        this.#board[y][x].is_open = true;
        return;
      case "out_of_range":
        throw "out of range!";
      case "wide_open":
        this.#board[y][x].is_open = true;

        // time to expand in each direction
        for (let cell of this.neighbors_of(x, y)) this.click(cell.x, cell.y);
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

// viewbox = 0 0 10 10
const svg_numbers_and_icons = {
  1: `<polygon points="2,9 8,9 8,7 6,7 6,1 4,1 2,4 4,4 4,7 2,7" style="fill: #00a" />`,
  2: `<polygon points="2,9 8,9 8,7 5,7 8,5 8,2.5 6.5,1 3.5,1 2,2.5 2,4.5 4,4.5 4,3.5 4.5,3 5.5,3 6,3.5 6,4.5 2,7" style="fill: #005200" />`,
  3: `<polygon points="2,9 7,9 8,8 8,6 7,5 8,4 8,2 7,1 2,1 2,3 5.25,3 5.75,3.25 5.75,4 5.25,4.25 3,4.25 3,5.75 5.25,5.75 5.75,6 5.75,6.75 5.25,7 2,7" style="fill: #a00" />`,
  4: `<polygon points="4.5,9 6.5,9 6.5,7 8,7 8,5 6.5,5 6.5,1 4.5,1 1,5 3.5,5 4.5,3.5 4.5,5 1,5 1,7 4.5,7" style="fill: #000052" />`,
  5: `<polygon points="2,9 7,9 8,8 8,5 7,4 4,4 4,3 8,3 8,1 2,1 2,5.75 6,5.75 6,7 2,7" style="fill: #520000" />`,
  6: `<polygon points="4,7 4,5.75 2,5 2,8 3,9 7,9 8,8 8,5 7,4 4,4 4,3 7.5,3 7.5,1 3,1 2,2 2,5.75 6,5.75 6,7 2,7" style="fill: #005252" />`,
  7: `<polygon points="3,9 5,9 8,3.5 8,1 2,1 2,2.75 6,2.75 6,3.5" style="fill: #0f0f0f" />`,
  8: `
    <polygon points="3,9 7,9 8,8 8,6 7,5 8,4 8,2 7,1 3,1 2,2 2,4 3,5 2,6 2,8" style="fill: #525252" />
    <polygon points="4,7.5 6,7.5 6.5,7 6.5,6.5 6,6 4,6 3.5,6.5 3.5,7" style="fill: grey" />
    <polygon points="4,4 6,4 6.5,3.5 6.5,3 6,2.5 4,2.5 3.5,3 3.5,3.5" style="fill: grey" />
  `,
  flag: `
    <polygon class="flag" points="2,9 8,9 8,8 6.5,7 6.5,1 5.5,1 5.5,7 2,8" style="fill: black" />
    <polygon class="flag" points="2,3 5.5,1 5.5,5" style="fill: #a00" />
  `,
  mine: `
    <line class="mine" x1="5" y1="1" x2="5" y2="9" stroke="black" stroke-linecap="round" stroke-width="2" />
    <line class="mine" x1="1" y1="5" x2="9" y2="5" stroke="black" stroke-linecap="round" stroke-width="2" />

    <line class="mine" x1="2.5" y1="7.5" x2="7.5" y2="2.5" stroke="#222" stroke-linecap="round" stroke-width="1.5" />
    <line class="mine" x1="2.5" y1="2.5" x2="7.5" y2="7.5" stroke="#222" stroke-linecap="round" stroke-width="1.5" />

    <circle class="mine" cx="5" cy="5" r="3.25" fill="black" />
  
    <rect x="3.5" y="3.5" width="1.5" height="1.5" rx="0.5" fill="white" />
  `,
} as Record<string | number, string>;

function svg_for(svg: string) {
  return `<svg viewbox="0 0 10 10">${svg}</svg>`;
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
    let is_mine = game.is_mine(x, y);
    let mine_count = game.number_of_mines_near(x, y);
    let is_flagged = game.is_flagged(x, y);
    cell.dataset.isMine = is_mine.toString();
    cell.dataset.isOpen = game.is_open(x, y).toString();
    cell.dataset.mineCount = mine_count.toString();
    cell.dataset.isFlagged = is_flagged.toString();
    cell.dataset.x = x.toString();
    cell.dataset.y = y.toString();
    if (is_mine) cell.innerHTML += svg_for(svg_numbers_and_icons.mine);
    else if (mine_count !== 0)
      cell.innerHTML += svg_for(svg_numbers_and_icons[mine_count]);

    cell.innerHTML += svg_for(svg_numbers_and_icons.flag);
  }
}

function update_board_html(game: Game, board: HTMLDivElement) {
  for (let cell of board.querySelectorAll(
    ".cell"
  ) as NodeListOf<HTMLDivElement>) {
    let { x, y } = cell.dataset;
    cell.dataset.isOpen = game.is_open(Number(x), Number(y)).toString();
    cell.dataset.isFlagged = game.is_flagged(Number(x), Number(y)).toString();
  }
}

let game = new Game(10, 10, 9);

let board = init_board_html(game);
document.querySelector("#app")!.append(board);

board.addEventListener("click", (e) => {
  if (game.is_game_over() || game.is_won()) return;
  let cell = (e.target as HTMLElement).closest(".cell") as HTMLDivElement;
  let x = Number(cell.dataset.x),
    y = Number(cell.dataset.y);

  if (game.is_empty()) {
    game.load_mines(x, y);
    load_mines_html(board, game);
  }
  if (game.is_flagged(x, y)) return;
  game.click(x, y);
  update_board_html(game, board);
  if (game.is_game_over()) board.classList.add("game-over");
  else if (game.is_won()) board.classList.add("game-won");
});

let mouse_x: number, mouse_y: number;

window.addEventListener("mousemove", (e) => {
  mouse_x = e.clientX;
  mouse_y = e.clientY;
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
      if (game.number_of_flagged_near(x, y) === Number(mineCount)) {
        // TODO: handle opening a mine
        game.force_expand(x, y);
      }
    }
    update_board_html(game, board);
    if (game.is_game_over()) board.classList.add("game-over");
    else if (game.is_won()) board.classList.add("game-won");
  }
});
