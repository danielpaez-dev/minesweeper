import { Board } from "./Board.js";

export class Game {
  constructor(difficulty = "medium") {
    const settings = {
      easy: { rows: 8, cols: 10, mines: 10, flags: 10 },
      medium: { rows: 14, cols: 18, mines: 40, flags: 40 },
      hard: { rows: 20, cols: 24, mines: 99, flags: 99 },
    };
    const { rows, cols, mines, flags } = settings[difficulty];
    this.board = new Board(rows, cols, mines, flags);
    this.secondsElapsed = 0;
    this.isGameOver = false;
  }

  createBoard(rows, cols, mines, flags) {
    let board = new Board(rows, cols, mines, flags);
    board.game = this;
    return board;
  }

  timer() {
    const timerElement = document.getElementById("timeCounter");
    this.restartTimer(timerElement);
    this.secondsElapsed = 0;

    this._timerInterval = setInterval(() => {
      this.secondsElapsed++;
      timerElement.textContent = this.secondsElapsed
        .toString()
        .padStart(3, "0");
    }, 1000);
  }

  gameOver() {
    this.isGameOver = true;
    this.stopTimer();
  }

  restartTimer(timerElement = document.getElementById("timeCounter")) {
    clearInterval(this._timerInterval);
    this.secondsElapsed = 0;
    timerElement.textContent = "000";
  }

  stopTimer() {
    clearInterval(this._timerInterval);
  }
}
