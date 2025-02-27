import { Board } from "./Board.js";

export class Game {
  constructor(difficulty = "medium") {
    const settings = {
      easy: { rows: 10, cols: 8, mines: 10 },
      medium: { rows: 14, cols: 18, mines: 40 },
      hard: { rows: 20, cols: 24, mines: 99 },
    };
    const { rows, cols, mines } = settings[difficulty];
    this.board = this.createBoard(rows, cols, mines);
  }

  createBoard(rows, cols, mines) {
    let board = new Board(rows, cols, mines);
    return board;
  }
}
