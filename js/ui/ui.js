export const DIFFICULTY_DEFAULT = "medium";

export function updateHeaderWidth() {
  const board = document.getElementById("board");
  const header = document.getElementsByTagName("header")[0];
  if (board && header) {
    header.style.width = `${board.offsetWidth - 32}px`;
  }
}

export function updateOption(difficulty) {
  const checks = document.getElementsByClassName("check");
  Array.from(checks).forEach((check) => {
    check.textContent = "";
    if (check.parentNode.id.toLowerCase() === difficulty.toLowerCase()) {
      check.textContent = "✓";
      updateSelectedOption(difficulty);
    }
  });
  localStorage.setItem("difficulty", difficulty);
}

export function closeMenu() {
  const dropdownMenu = document.getElementById("dropdown_menu");
  dropdownMenu.style.display = "none";
}

function updateSelectedOption(difficulty) {
  const selectedOption = document.getElementById("selectedOption");
  selectedOption.textContent =
    difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();
}
