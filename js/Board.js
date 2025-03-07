import { Cell } from "./Cell.js";

export class Board {
  constructor(rows, cols, mines, flags) {
    this.rows = rows;
    this.cols = cols;
    this.total = rows * cols;
    this.mines = mines;
    this.flags = flags;
    this.board = document.getElementById("board");

    this.cells = {};
    this.placedMines = new Set();

    this.createBoard();
  }

  createBoard() {
    this.deleteBoard();
    this.board.style.gridTemplate = `repeat(${this.rows}, 30px) / repeat(${this.cols}, 30px)`;
    for (let y = 1; y <= this.rows; y++) {
      for (let x = 1; x <= this.cols; x++) {
        const cell = new Cell(x, y, this);
        this.cells[`${x}-${y}`] = cell;
        this.board.appendChild(cell.element);
      }
    }
    this.updateFlags();
  }

  deleteBoard() {
    this.board.innerHTML = "";
    this.cells = {};
  }

  placeMines(safeX, safeY) {
    let placed = 0;
    while (placed < this.mines) {
      const x = this.randomCol();
      const y = this.randomRow();

      // Si la celda candidata está en la zona segura (celda clickeada y sus adyacentes), la saltamos.
      if (Math.abs(x - safeX) <= 1 && Math.abs(y - safeY) <= 1) {
        continue;
      }

      const index = `${x}-${y}`;
      if (!this.hasMine(index)) {
        this.cells[index].setMine(true);
        this.placedMines.add(index);
        placed++;
      }
    }
  }

  randomRow() {
    return Math.floor(Math.random() * this.rows) + 1;
  }

  randomCol() {
    return Math.floor(Math.random() * this.cols) + 1;
  }

  hasMine(index) {
    return this.cells[index] && this.cells[index].getMine();
  }

  countAdjacentMines(x, y) {
    let count = 0;
    const index = `${x}-${y}`;

    for (let xCalculate = x - 1; xCalculate <= x + 1; xCalculate++) {
      for (let yCalculate = y - 1; yCalculate <= y + 1; yCalculate++) {
        if (
          xCalculate > 0 &&
          xCalculate <= this.cols &&
          yCalculate > 0 &&
          yCalculate <= this.rows
        ) {
          if (xCalculate === x && yCalculate === y) continue;
          if (this.cells[`${xCalculate}-${yCalculate}`].getMine()) {
            count++;
          }
        }
      }
    }

    if (count > 0) {
      this.cells[index].setNumber(count);
    }

    return count;
  }

  cascadeReveal(x, y, visited = new Set()) {
    if (this.isInLimit(x, y)) return;

    const index = `${x}-${y}`;

    // Comprueba si la casilla ya ha sido checkeada por la función recursiva
    if (visited.has(index)) return;
    visited.add(index);

    const cell = this.cells[index];

    if (!cell.revealed) {
      cell.reveal(this, true);
    }

    if (cell.number > 0) return;

    for (let xCalculate = x - 1; xCalculate <= x + 1; xCalculate++) {
      for (let yCalculate = y - 1; yCalculate <= y + 1; yCalculate++) {
        if (xCalculate === x && yCalculate === y) continue;
        this.cascadeReveal(xCalculate, yCalculate, visited);
      }
    }
  }

  getSafeCells() {
    return Object.keys(this.cells)
      .filter((key) => !this.placedMines.has(key))
      .map((key) => this.cells[key]);
  }

  // Mira si está dentro del límite del tablero
  isInLimit(x, y) {
    return x < 1 || x > this.cols || y < 1 || y > this.rows;
  }

  knowNonDiagonalAdjacentCells(x, y) {
    let nonDiagonalAdjacentIndexes = {
      up: [x, y - 1],
      left: [x - 1, y],
      right: [x + 1, y],
      down: [x, y + 1],
    };

    const results = {};

    for (const [direction, [adjX, adjY]] of Object.entries(
      nonDiagonalAdjacentIndexes
    )) {
      const index = `${adjX}-${adjY}`;
      const cell = this.cells[index];
      if (cell) {
        results[direction] = cell.getRevealed();
      } else {
        results[direction] = false;
      }
    }

    return results;
  }

  getFlags() {
    return this.flags;
  }

  setFlags(flag) {
    flag ? (this.flags -= 1) : (this.flags += 1);
    this.updateFlags();
  }

  updateFlags() {
    let flagCounter = document.getElementById("flagCounter");
    flagCounter.textContent = this.getFlags();
  }
}
