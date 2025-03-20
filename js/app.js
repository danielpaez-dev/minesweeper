import { Game } from "./models/Game.js";
import { closeMenu, updateHeaderWidth, updateOption, isMobile } from "./ui/ui.js";
import { showActionPanel } from "./ui/tapPanel.js";

let game;
let firstClick = false;

window.addEventListener("DOMContentLoaded", () => {
  let initialDifficulty = localStorage.getItem("difficulty");
  if (isMobile() && !initialDifficulty.endsWith("Mobile")) {
    initialDifficulty += "Mobile";
    updateOption(initialDifficulty + "Mobile");
  }

  if (!isValidDifficulty(initialDifficulty)) {
    initialDifficulty = "medium";
    localStorage.setItem("difficulty", initialDifficulty);
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

      if (isMobile()) {
        showActionPanel(cell, cellElement);
        return;
      } else {
        reveal(cell);
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

export function reveal(cell) {
  if (!cell) return;

  if (!firstClick) {
    firstClick = true;
    game.timer();
    game.board.placeMines(cell.x, cell.y);
  }
  cell.reveal(game.board);

  if (cell.getRevealed() && cell.checkAdjacentFlags()) {
    cell.revealAdjacentCells();
  }
}

function isValidDifficulty(difficulty) {
  const validDifficulties = ["easy", "medium", "hard", "easyMobile", "mediumMobile", "hardMobile"];
  return validDifficulties.includes(difficulty);
}