import { Game } from "./Game.js";
import { Board } from "./Board.js";
import { Cell } from "./Cell.js";

let game;

window.addEventListener("DOMContentLoaded", () => {
  game = new Game();

  window.addEventListener("click", (e) => {
    if (
      e.target.classList.contains("cell") &&
      (e.target.classList.contains("unrevealed-light") ||
        e.target.classList.contains("unrevealed-dark"))
    ) {
      const index = e.target.id;
      const cell = game.board.cells[index];

      if (cell) {
        cell.reveal(game.board);
      }
    }
  });
});
