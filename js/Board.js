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
        console.log(placed + " " + this.cells[index]);
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

  getMinePositions() {
    const minePositions = [];
    for (const index in this.cells) {
      if (this.cells[index].getMine()) {
        minePositions.push(index);
      }
    }
    return minePositions;
  }
}
