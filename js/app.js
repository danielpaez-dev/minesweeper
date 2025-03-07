import { Game } from "./Game.js";

let game;

window.addEventListener("DOMContentLoaded", () => {
  game = new Game();
  updateOption("medium");
  let firstClick = false;

  window.addEventListener("click", (e) => {
    if (game.isGameOver) return;

    if (
      e.target.classList.contains("cell") &&
      (e.target.classList.contains("unrevealed-light") ||
        e.target.classList.contains("unrevealed-dark"))
    ) {
      const index = e.target.id;
      const cell = game.board.cells[index];

      if (cell) {
        if (!firstClick) {
          firstClick = true;
          game.timer();
          game.board.placeMines(cell.x, cell.y);
          cell.reveal(game.board, false, true);
        } else {
          cell.reveal(game.board, false, false);
        }
      }
    }
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
        const difficulty = e.target.id;
        updateOption(difficulty);
        game = new Game(difficulty);
        closeMenu();
        updateHeaderWidth();
      });
    });
  }
  window.toggleDropdown = toggleDropdown;
});

function updateHeaderWidth() {
  let board = document.getElementById("board");
  let header = document.getElementsByTagName("header")[0];
  if (board && header) {
    let boardWidth = board.offsetWidth;
    console.log(boardWidth);
    header.style.width = `${boardWidth - 32}px`;
    console.log(parseInt(header.style.width) + 32);
  }
}

function updateOption(difficulty) {
  const checks = document.getElementsByClassName("check");
  Array.from(checks).forEach((check) => {
    check.textContent = "";
    if (check.parentNode.id.toLowerCase() == difficulty.toLowerCase()) {
      check.textContent = "✓";
      updateSelectedOption(difficulty);
    }
  });
}

function closeMenu() {
  let dropdownMenu = document.getElementById("dropdown_menu");
  dropdownMenu.style.display = "none";
}

function updateSelectedOption(difficulty) {
  let selectedOption = document.getElementById("selectedOption");
  selectedOption.textContent =
    difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();
}
