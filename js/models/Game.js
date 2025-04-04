import { Board } from "./Board.js";

export class Game {
  constructor(difficulty = "medium") {
    const { rows, cols, mines, flags } = this.getDifficultySettings(difficulty);
    this.board = new Board(rows, cols, mines, flags);
    this.board.game = this;
    this.secondsElapsed = 0;
    this.isGameOver = false;
  }

  getDifficultySettings(difficulty) {
    const settings = {
      easy: { rows: 8, cols: 10, mines: 10, flags: 10 },
      easyMobile: { rows: 12, cols: 6, mines: 10, flags: 10 },
      medium: { rows: 14, cols: 18, mines: 40, flags: 40 },
      mediumMobile: { rows: 20, cols: 10, mines: 40, flags: 40 },
      hard: { rows: 20, cols: 24, mines: 99, flags: 99 },
      hardMobile: { rows: 28, cols: 13, mines: 99, flags: 99 },
    };
    return settings[difficulty];
  }

  createBoard(rows, cols, mines, flags) {
    let board = new Board(rows, cols, mines, flags);
    board.game = this;
    return board;
  }

  timer() {
    const timerElement = document.getElementById("timeCounter");

    if (this._timerInterval) return; // Evita crear múltiples intervalos

    this._timerInterval = setInterval(() => {
      this.secondsElapsed++;
      timerElement.textContent = this.secondsElapsed
        .toString()
        .padStart(3, "0");
    }, 1000);
  }

  restartTimer(timerElement = document.getElementById("timeCounter")) {
    clearInterval(this._timerInterval);
    this.secondsElapsed = 0;
    timerElement.textContent = "000";
  }

  stopTimer() {
    if (this._timerInterval) {
      clearInterval(this._timerInterval);
      this._timerInterval = null; // Asegura que no haya reinicio accidental
    }
  }

  victory() {
    this.isGameOver = true;
    this.stopTimer();
    alert("¡Victory!");
    this.board.board.classList.add("game-over");
  }

  gameOver() {
    this.isGameOver = true;
    this.stopTimer();
    this.board.showMines();
    this.board.board.classList.add("game-over");
    alert("You lose! :(");
  }
}
