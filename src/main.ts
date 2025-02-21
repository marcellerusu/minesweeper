import "./style.css";

class Game {
  #board: { is_mine: boolean; is_open: boolean; is_flagged: boolean }[][];
  constructor(readonly WIDTH = 4, readonly HEIGHT = 4, readonly MINES = 1) {
    this.#board = Array.from({ length: HEIGHT }, (_) =>
      Array.from({ length: WIDTH }, (_) => ({
        is_mine: false,
        is_open: false,
        is_flagged: false,
      }))
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

  is_flagged(x: number, y: number): boolean {
    return this.#board[y][x].is_flagged;
  }

  is_open(x: number, y: number): boolean {
    return this.#board[y][x].is_open;
  }

  open_unless_flagged(x: number, y: number) {
    if (x < 0 || x >= this.WIDTH || y < 0 || y >= this.HEIGHT) return;
    if (this.#board[y][x].is_flagged) return;
    this.run_click_at(x, y);
  }

  number_of_flagged_near(x: number, y: number): number {
    let count = 0;

    // is there a flag above?
    if (this.#board[y - 1]?.[x]?.is_flagged) count++;
    // is there a flag below?
    if (this.#board[y + 1]?.[x]?.is_flagged) count++;
    // is there a flag to the left?
    if (this.#board[y]?.[x - 1]?.is_flagged) count++;
    // is there a flag to the right?
    if (this.#board[y]?.[x + 1]?.is_flagged) count++;
    // is there a flag to the top left?
    if (this.#board[y - 1]?.[x - 1]?.is_flagged) count++;
    // is there a flag to the top right?
    if (this.#board[y - 1]?.[x + 1]?.is_flagged) count++;
    // is there a flag to the bottom left?
    if (this.#board[y + 1]?.[x - 1]?.is_flagged) count++;
    // is there a flag to the bottom right?
    if (this.#board[y + 1]?.[x + 1]?.is_flagged) count++;

    return count;
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

  toggle_flag(x: number, y: number) {
    this.#board[y][x].is_flagged = !this.#board[y][x].is_flagged;
  }

  force_expand(x: number, y: number) {
    // expand above
    this.open_unless_flagged(x, y - 1);
    // expand below
    this.open_unless_flagged(x, y + 1);
    // expand to the left
    this.open_unless_flagged(x - 1, y);
    // expand to the right
    this.open_unless_flagged(x + 1, y);
    // expand to the top left
    this.open_unless_flagged(x - 1, y - 1);
    // expand to the top right
    this.open_unless_flagged(x + 1, y - 1);
    // expand to the bottom left
    this.open_unless_flagged(x - 1, y + 1);
    // expand to the bottom right
    this.open_unless_flagged(x + 1, y + 1);
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

// viewbox = 0 0 10 10
const svg_numbers_and_icons = {
  1: `<polygon points="2,9 8,9 8,7 6,7 6,1 4,1 2,4 4,4 4,7 2,7" style="fill: #00a" />`,
  2: `<polygon points="2,9 8,9 8,7 5,7 8,5 8,2.5 6.5,1 3.5,1 2,2.5 2,4.5 4,4.5 4,3.5 4.5,3 5.5,3 6,3.5 6,4.5 2,7" style="fill: #005200" />`,
  3: `<polygon points="2,9 7,9 8,8 8,6 7,5 8,4 8,2 7,1 2,1 2,3 5.25,3 5.75,3.25 5.75,4 5.25,4.25 3,4.25 3,5.75 5.25,5.75 5.75,6 5.75,6.75 5.25,7 2,7" style="fill: #a00" />`,
  4: `<polygon points="4.5,9 6.5,9 6.5,7 8,7 8,5 6.5,5 6.5,1 4.5,1 1,5 3.5,5 4.5,3.5 4.5,5 1,5 1,7 4.5,7" style="fill: #000052" />`,
  5: `<polygon points="2,9 7,9 8,8 8,5 7,4 4,4 4,3 8,3 8,1 2,1 2,5.75 6,5.75 6,7 2,7" style="fill: #520000" />`,
  6: `<polygon points="4,7 4,5.75 2,5 2,8 3,9 7,9 8,8 8,5 7,4 4,4 4,3 7.5,3 7.5,1 3,1 2,2 2,5.75 6,5.75 6,7 2,7" style="fill: #005252" />`,
  7: `<polygon points="3,9 5,9 8,3.5 8,1 2,1 2,2.75 6,2.75 6,3.5" style="fill: #0f0f0f" />`,
  flag: `
    <polygon class="flag" points="2,9 8,9 8,8 6.5,7 6.5,1 5.5,1 5.5,7 2,8" style="fill: black" />
    <polygon class="flag" points="2,3 5.5,1 5.5,5" style="fill: #a00" />
  `,
} as Record<string, string>;

function create_board_html(game: Game) {
  let board = document.createElement("div");
  board.classList.add("board");
  for (let y = 0; y < game.HEIGHT; y++) {
    let row = document.createElement("span");
    for (let x = 0; x < game.WIDTH; x++) {
      let cell = document.createElement("div");
      cell.classList.add("cell");
      let is_mine = game.is_mine(x, y);
      let mine_count = game.number_of_mines_near(x, y);
      let is_flagged = game.is_flagged(x, y);
      cell.dataset.isMine = is_mine.toString();
      cell.dataset.isOpen = game.is_open(x, y).toString();
      cell.dataset.mineCount = mine_count.toString();
      cell.dataset.isFlagged = is_flagged.toString();
      cell.dataset.x = x.toString();
      cell.dataset.y = y.toString();
      if (is_mine) cell.append(mine());
      else if (mine_count !== 0) {
        if (svg_numbers_and_icons[mine_count]) {
          cell.innerHTML += `<svg viewbox="0 0 10 10">${svg_numbers_and_icons[mine_count]}</svg>`;
        } else {
          cell.append(number());
        }
      }
      cell.innerHTML += `<svg viewbox="0 0 10 10">${svg_numbers_and_icons.flag}</svg>`;
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
    let { x, y } = cell.dataset;
    cell.dataset.isOpen = game.is_open(Number(x), Number(y)).toString();
    cell.dataset.isFlagged = game.is_flagged(Number(x), Number(y)).toString();
  }
}

let game = new Game(10, 10, 50);

game.load_mines();

let board = create_board_html(game);
document.querySelector("#app")!.append(board);

board.addEventListener("click", (e) => {
  let cell = (e.target as HTMLElement).closest(".cell") as HTMLDivElement;
  let x = Number(cell.dataset.x),
    y = Number(cell.dataset.y);
  if (game.is_flagged(x, y)) return;
  try {
    game.run_click_at(x, y);
  } catch {}
  update_board_html(game, board);
});

let mouse_x: number, mouse_y: number;

window.addEventListener("mousemove", (e) => {
  mouse_x = e.clientX;
  mouse_y = e.clientY;
});

window.addEventListener("keydown", (e) => {
  if (e.key === " ") {
    e.preventDefault();
    let cell: HTMLDivElement;
    for (let elem of document.elementsFromPoint(mouse_x, mouse_y)) {
      cell = elem.closest(".cell") as HTMLDivElement;
      if (cell) break;
    }
    let { x: string_x, y: string_y, mineCount } = cell!.dataset;
    let x = Number(string_x);
    let y = Number(string_y);
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
  }
});
