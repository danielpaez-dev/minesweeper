import { Cell } from "./Cell.js";

export class Board {
  constructor(rows = 14, cols = 18) {
    this.rows = rows;
    this.cols = cols;
    this.total = rows * cols;
    this.board = document.getElementById("board");
    this.createBoard();
  }

  createBoard() {
    this.board.style.gridTemplate = `repeat(${this.rows}, 30px) / repeat(${this.cols}, 30px)`;
    for (let i = 1; i <= this.rows; i++) {
      for (let j = 1; j <= this.cols; j++) {
        new Cell(i, j);
      }
    }
  }
}
