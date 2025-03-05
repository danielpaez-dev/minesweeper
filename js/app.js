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
      console.log(index);
      const cell = game.board.cells[index];

      if (cell) {
        cell.reveal(game.board);
      }
    }
  });

  window.addEventListener("contextmenu", (e) => {
    if (e.target.classList.contains("cell")) {
      e.preventDefault();
      const index = e.target.id;
      const cell = game.board.cells[index];

      if (cell) {
        if (!cell.getFlag()) {
          cell.placeFlag(true);
        } else {
          cell.placeFlag(false);
        }
      }
    }
  });

  function toggleDropdown() {
    let dropdownMenu = document.getElementById("dropdown_menu");

    if (
      dropdownMenu.style.display === "none" ||
      dropdownMenu.style.display === ""
    ) {
      dropdownMenu.style.display = "block";
    } else {
      dropdownMenu.style.display = "none";
    }
  }
  window.toggleDropdown = toggleDropdown;
});
