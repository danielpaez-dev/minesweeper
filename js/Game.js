import { Board } from "./Board.js";

export class Game {
  constructor(difficulty = "medium") {
    const settings = {
      easy: { rows: 10, cols: 8 },
      medium: { rows: 14, cols: 18 },
      hard: { rows: 20, cols: 24 },
    };
    const { rows, cols } = settings[difficulty];
    this.board = this.createBoard(rows, cols);
  }

  createBoard(rows, cols) {
    new Board(rows, cols);
  }
}
