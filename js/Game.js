import { Board } from "./Board.js";

export class Game {
  constructor(difficulty = "medium") {
    const settings = {
      easy: { rows: 8, cols: 10, mines: 10, flags: 10 },
      medium: { rows: 14, cols: 18, mines: 40, flags: 40 },
      hard: { rows: 20, cols: 24, mines: 99, flags: 99 },
    };
    const { rows, cols, mines, flags } = settings[difficulty];
    this.board = this.createBoard(rows, cols, mines, flags);
    this.secondsElapsed = 0;
  }

  createBoard(rows, cols, mines, flags) {
    let board = new Board(rows, cols, mines, flags);
    return board;
  }

  timer() {
    const timer = document.getElementById("timeCounter");
    this.secondsElapsed = 0;

    this.timer = setInterval(() => {
      this.secondsElapsed++;
      timer.textContent = this.secondsElapsed.toString().padStart(3, "0");
    }, 1000);
  }
}
