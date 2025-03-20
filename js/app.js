import { Game } from "./models/Game.js";
import { closeMenu, updateHeaderWidth, updateOption, isMobile } from "./ui/ui.js";

let game;
let firstClick = false;

window.addEventListener("DOMContentLoaded", () => {
  const initialDifficulty = localStorage.getItem("difficulty") || "medium";
  if (isMobile()) {
    updateOption(initialDifficulty + "Mobile");
  }
  game = new Game(initialDifficulty);
  updateOption(initialDifficulty);

  const restartButton = document.getElementById("restart");
  restartButton.addEventListener("click", () => restartGame());

  window.addEventListener("click", (e) => {
    if (game.isGameOver) return;

    // Si se hace clic en una celda
    const cellElement = e.target.closest(".cell");
    if (cellElement) {
      const index = cellElement.id;
      const cell = game.board.cells[index];
      if (
        e.target.classList.contains("unrevealed-light") ||
        e.target.classList.contains("unrevealed-dark")
      ) {
        if (cell && !firstClick) {
          firstClick = true;
          game.timer();
          // Coloca las minas asegurando la zona del primer clic
          game.board.placeMines(cell.x, cell.y);
        }
        cell.reveal(game.board);
      }

      if (cell.getRevealed() && cell.checkAdjacentFlags()) {
        cell.revealAdjacentCells();
      }
    }

    // Cierra el menú si se hace clic fuera del dropdown
    const dropdown = document.getElementById("dropdown");
    if (!dropdown.contains(e.target)) {
      closeMenu();
    }
  });

  window.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    if (game.isGameOver) return;

    if (e.target.classList.contains("cell")) {
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
      closeMenu();
    }

    const options = document.querySelectorAll("#dropdown_menu li");
    options.forEach((option) => {
      option.addEventListener("click", (e) => {
        let difficulty = e.target.dataset.difficulty;
        if (isMobile()) {
          difficulty += "Mobile";
        }
        updateOption(difficulty);
        restartGame(difficulty);
        closeMenu();
      });
    });
  }
  window.toggleDropdown = toggleDropdown;

  function restartGame(difficulty) {
    // Obtén la dificultad actual del localStorage, si no se pasa como parámetro
    const diff = difficulty || localStorage.getItem("difficulty") || "medium";
    firstClick = false;

    if (game) {
      game.stopTimer();
    }

    game = new Game(diff);
    game.restartTimer();
    updateHeaderWidth();
  }
});
