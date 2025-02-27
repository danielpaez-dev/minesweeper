import { Cell } from "./Cell.js";

export class Board {
  constructor(rows, cols, mines) {
    this.rows = rows;
    this.cols = cols;
    this.total = rows * cols;
    this.mines = mines;
    this.board = document.getElementById("board");

    this.cells = {};

    this.createBoard();
    this.placeMines();
  }

  createBoard() {
    this.board.style.gridTemplate = `repeat(${this.rows}, 30px) / repeat(${this.cols}, 30px)`;
    for (let i = 1; i <= this.rows; i++) {
      for (let j = 1; j <= this.cols; j++) {
        const cell = new Cell(i, j);
        this.cells[`${i}-${j}`] = cell;
      }
    }
  }

  placeMines() {
    let placed = 0;
    while (placed < this.mines) {
      const row = this.randomRow();
      const col = this.randomCol();
      const index = `${row}-${col}`;
      if (!this.hasMine(index)) {
        this.cells[index].setMine(true);
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
          xCalculate <= this.rows &&
          yCalculate > 0 &&
          yCalculate <= this.cols
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

  // Mira si está dentro del límite del tablero
  isInLimit(x, y) {
    if (x < 1 || x > this.rows || y < 1 || y > this.cols) {
      return true;
    } else {
      return false;
    }
  }
}
