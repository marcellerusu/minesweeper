import "./style.css";

class Game {
  #board: { is_mine: boolean; is_open: boolean }[][];
  constructor(readonly WIDTH = 4, readonly HEIGHT = 4, readonly MINES = 1) {
    this.#board = Array.from({ length: HEIGHT }, (_) =>
      Array.from({ length: WIDTH }, (_) => ({ is_mine: false, is_open: false }))
    );
  }

  load_mines() {
    let number_of_mines_left = this.MINES;
    while (number_of_mines_left > 0) {
      let x = Math.floor(Math.random() * this.WIDTH);
      let y = Math.floor(Math.random() * this.HEIGHT);
      if (this.#board[y][x].is_mine) continue;
      this.#board[y][x].is_mine = true;
      number_of_mines_left--;
    }
  }

  is_mine(x: number, y: number): boolean {
    return this.#board[y][x].is_mine;
  }

  is_open(x: number, y: number): boolean {
    return this.#board[y][x].is_open;
  }

  // just for testing
  load_mine_unsafe(x: number, y: number) {
    if (x < 0 || x >= this.WIDTH || y < 0 || y >= this.HEIGHT)
      throw "out of bounds";
    this.#board[y][x].is_mine = true;
  }

  open_unsafe(x: number, y: number) {
    if (x < 0 || x >= this.WIDTH || y < 0 || y >= this.HEIGHT)
      throw "out of bounds";
    this.#board[y][x].is_open = true;
  }

  serialize() {
    let str = "";
    for (let row of this.#board) {
      for (let { is_mine, is_open } of row)
        if (is_mine) str += "m ";
        else if (!is_open) str += "- ";
        else str += "_ ";
      str += "\n";
    }
    return str.trim();
  }

  number_of_mines_near(x: number, y: number): number {
    let count = 0;

    // is there a mine above?
    if (this.#board[y - 1]?.[x]?.is_mine) count++;
    // is there a mine below?
    if (this.#board[y + 1]?.[x]?.is_mine) count++;
    // is there a mine to the left?
    if (this.#board[y]?.[x - 1]?.is_mine) count++;
    // is there a mine to the right?
    if (this.#board[y]?.[x + 1]?.is_mine) count++;
    // is there a mine to the top left?
    if (this.#board[y - 1]?.[x - 1]?.is_mine) count++;
    // is there a mine to the top right?
    if (this.#board[y - 1]?.[x + 1]?.is_mine) count++;
    // is there a mine to the bottom left?
    if (this.#board[y + 1]?.[x - 1]?.is_mine) count++;
    // is there a mine to the bottom right?
    if (this.#board[y + 1]?.[x + 1]?.is_mine) count++;

    return count;
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

    // is there a mine above?
    if (this.#board[y - 1]?.[x]?.is_mine) return "open";
    // is there a mine below?
    if (this.#board[y + 1]?.[x]?.is_mine) return "open";
    // is there a mine to the left?
    if (this.#board[y]?.[x - 1]?.is_mine) return "open";
    // is there a mine to the right?
    if (this.#board[y]?.[x + 1]?.is_mine) return "open";
    // is there a mine to the top left?
    if (this.#board[y - 1]?.[x - 1]?.is_mine) return "open";
    // is there a mine to the top right?
    if (this.#board[y - 1]?.[x + 1]?.is_mine) return "open";
    // is there a mine to the bottom left?
    if (this.#board[y + 1]?.[x - 1]?.is_mine) return "open";
    // is there a mine to the bottom right?
    if (this.#board[y + 1]?.[x + 1]?.is_mine) return "open";

    // otherwise we're wide open!
    return "wide_open";
  }

  run_click_at(x: number, y: number, { ignore_bounds = false } = {}) {
    let result = this.#try_click_at(x, y);
    switch (result) {
      case "already_open":
        return;
      case "clicked_on_mine":
        this.#board[y][x].is_open = true;
        throw "game over";
      case "open":
        this.#board[y][x].is_open = true;
        return;
      case "out_of_range":
        if (ignore_bounds) return;
        else throw "out of range!";
      case "wide_open":
        this.#board[y][x].is_open = true;

        // time to expand in each direction

        // above
        this.run_click_at(x, y - 1, { ignore_bounds: true });
        // below
        this.run_click_at(x, y + 1, { ignore_bounds: true });
        // left
        this.run_click_at(x - 1, y, { ignore_bounds: true });
        // right
        this.run_click_at(x + 1, y, { ignore_bounds: true });
        // top left
        this.run_click_at(x - 1, y - 1, { ignore_bounds: true });
        // top right
        this.run_click_at(x + 1, y - 1, { ignore_bounds: true });
        // bottom left
        this.run_click_at(x - 1, y + 1, { ignore_bounds: true });
        // bottom right
        this.run_click_at(x + 1, y + 1, { ignore_bounds: true });
        return;
    }
  }

  is_game_over() {
    return this.#board.every((row) =>
      row.every(({ is_mine, is_open }) => is_mine || is_open)
    );
  }
}

function mine() {
  let mine = document.createElement("div");
  mine.classList.add("mine");
  let horizontal = document.createElement("div");
  horizontal.classList.add("horizontal");
  let vertical = document.createElement("div");
  vertical.classList.add("vertical");
  let horizontal_diagonal = document.createElement("div");
  horizontal_diagonal.classList.add("horizontal-diagonal");
  let vertical_diagonal = document.createElement("div");
  vertical_diagonal.classList.add("vertical-diagonal");
  let ball = document.createElement("div");
  ball.classList.add("ball");
  let white = document.createElement("div");
  white.classList.add("white");
  mine.append(
    horizontal,
    vertical,
    horizontal_diagonal,
    vertical_diagonal,
    ball,
    white
  );
  return mine;
}

function number() {
  let num = document.createElement("div");
  num.classList.add("number");
  let a = document.createElement("div");
  a.classList.add("a");
  let b = document.createElement("div");
  b.classList.add("b");
  let c = document.createElement("div");
  c.classList.add("c");
  let d = document.createElement("div");
  d.classList.add("d");
  let e = document.createElement("div");
  e.classList.add("e");
  let f = document.createElement("div");
  f.classList.add("f");
  let g = document.createElement("div");
  g.classList.add("g");
  let h = document.createElement("div");
  h.classList.add("h");
  let i = document.createElement("div");
  i.classList.add("i");
  let j = document.createElement("div");
  j.classList.add("j");
  let k = document.createElement("div");
  k.classList.add("k");
  let l = document.createElement("div");
  l.classList.add("l");
  num.append(a, b, c, d, e, f, g, h, i, j, k, l);
  return num;
}

function create_board_html(game: Game) {
  let board = document.createElement("div");
  board.classList.add("board");
  for (let y = 0; y < game.HEIGHT; y++) {
    let row = document.createElement("span");
    for (let x = 0; x < game.WIDTH; x++) {
      let cell = document.createElement("div");
      cell.classList.add("cell");
      let is_mine = game.is_mine(x, y);
      cell.dataset.isMine = is_mine.toString();
      cell.dataset.isOpen = game.is_open(x, y).toString();
      cell.dataset.mineCount = game.number_of_mines_near(x, y).toString();
      cell.dataset.x = x.toString();
      cell.dataset.y = y.toString();
      if (is_mine) cell.append(mine());
      else cell.append(number());
      row.append(cell);
    }
    board.append(row);
  }
  return board;
}

function update_board_html(game: Game, board: HTMLDivElement) {
  for (let cell of board.querySelectorAll(
    ".cell"
  ) as NodeListOf<HTMLDivElement>) {
    let { x, y } = (cell as HTMLDivElement).dataset;
    cell.dataset.isOpen = game.is_open(Number(x), Number(y)).toString();
  }
}

let game = new Game(10, 10, 10);

game.load_mines();

let board = create_board_html(game);
document.querySelector("#app")?.append(board);

board.addEventListener("click", (e) => {
  let cell = (e.target as HTMLElement).closest(".cell") as HTMLDivElement;
  try {
    game.run_click_at(Number(cell.dataset.x), Number(cell.dataset.y));
  } catch {}
  update_board_html(game, board);
});
