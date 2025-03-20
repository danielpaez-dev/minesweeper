let DIFFICULTY_DEFAULT = localStorage.getItem("difficulty") || "medium";
if (isMobile() && !DIFFICULTY_DEFAULT.endsWith("Mobile")) {
  DIFFICULTY_DEFAULT += "Mobile";
  localStorage.setItem("difficulty", DIFFICULTY_DEFAULT);
}
export function updateHeaderWidth() {
  const board = document.getElementById("board");
  const header = document.getElementsByTagName("header")[0];
  if (board && header) {
    if (isMobile()) {
      header.style.width = `calc(100% - 32px)`;
    } else {
      header.style.width = `${board.offsetWidth - 32}px`;
    }
  }
}

export function updateOption(difficulty) {
  const checks = document.getElementsByClassName("check");

  Array.from(checks).forEach((check) => {
    check.textContent = "";
    const optionId = check.parentNode.id.toLowerCase();
    const normalizedDifficulty = difficulty.replace("Mobile", "").toLowerCase();
    if (optionId === normalizedDifficulty) {
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
  const displayDifficulty = difficulty.replace("Mobile", "");
  selectedOption.textContent =
    displayDifficulty.charAt(0).toUpperCase() +
    displayDifficulty.slice(1).toLowerCase();
}

export function screenSize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  return { width, height };
}

export function onScreenResize(callback) {
  window.addEventListener("resize", () => {
    const size = screenSize();
    callback(size);
  });
}

export function isMobile() {
  if (window.innerWidth <= 768) {
    return true;
  }
}
