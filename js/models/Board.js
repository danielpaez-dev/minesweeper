import { Cell } from "./Cell.js";
import { screenSize, onScreenResize, updateHeaderWidth } from "../ui/ui.js";

export class Board {
  constructor(rows, cols, mines, flags) {
    this.rows = rows;
    this.cols = cols;
    this.total = rows * cols;
    this.mines = mines;
    this.flags = flags;
    this.board = document.getElementById("board");

    this.cells = {};
    this.placedMines = new Set();

    // Escuchar cambios en el tamaño de la pantalla
    onScreenResize((newSize) => {
      this.adjustBoardSize(newSize);
    });

    // Crear el tablero con el tamaño inicial
    const initialSize = screenSize();
    this.adjustBoardSize(initialSize);
    this.createBoard();
  }

  adjustBoardSize(size) {
    const { width, height } = size;

    // Calcula el tamaño de las celdas en función del tamaño de la pantalla
    const cellWidth = Math.floor((width - 32) / this.cols); // Ajusta el ancho de las celdas
    const cellHeight = Math.floor((height - 100) / this.rows); // Ajusta el alto de las celdas

    // Asegúrate de que las celdas no sean demasiado pequeñas
    const minCellSize = 20; // Tamaño mínimo de las celdas
    const cellSize = Math.max(minCellSize, Math.min(cellWidth, cellHeight));

    // Aplica el nuevo tamaño al tablero
    this.board.style.gridTemplate = `repeat(${this.rows}, ${cellSize}px) / repeat(${this.cols}, ${cellSize}px)`;
    this.board.style.setProperty("--cell-size", `${cellSize}px`);

    // Actualiza el tamaño de las celdas existentes
    Object.values(this.cells).forEach((cell) => {
      cell.element.style.width = `${cellSize}px`;
      cell.element.style.height = `${cellSize}px`;
    });

    // Actualiza el ancho del header
    updateHeaderWidth();
  }

  createBoard() {
    this.deleteBoard();
    const initialSize = screenSize();
    this.adjustBoardSize(initialSize);

    for (let y = 1; y <= this.rows; y++) {
      for (let x = 1; x <= this.cols; x++) {
        const cell = new Cell(x, y, this);
        this.cells[`${x}-${y}`] = cell;
        this.board.appendChild(cell.element);
      }
    }
    this.board.classList.remove("game-over");
    this.updateFlags();
  }

  deleteBoard() {
    this.board.innerHTML = "";
    this.cells = {};
  }

  // Resto de los métodos de la clase Board...
  placeMines(safeX, safeY) {
    let placed = 0;
    while (placed < this.mines) {
      const x = this.randomCol();
      const y = this.randomRow();

      if (Math.abs(x - safeX) <= 1 && Math.abs(y - safeY) <= 1) {
        continue;
      }

      const index = `${x}-${y}`;
      if (!this.hasMine(index)) {
        this.cells[index].setMine(true);
        this.placedMines.add(index);
        placed++;
      }
    }
  }

  randomRow() {
    return Math.floor(Math.random() * this.rows) + 1;
  }

  randomCol() {
    return Math.floor(Math.random() * this.cols) + 1;
  }

  hasMine(index) {
    return this.cells[index] && this.cells[index].getMine();
  }

  countAdjacentMines(x, y) {
    let count = 0;
    const index = `${x}-${y}`;

    for (let xCalculate = x - 1; xCalculate <= x + 1; xCalculate++) {
      for (let yCalculate = y - 1; yCalculate <= y + 1; yCalculate++) {
        if (
          xCalculate > 0 &&
          xCalculate <= this.cols &&
          yCalculate > 0 &&
          yCalculate <= this.rows
        ) {
          if (xCalculate === x && yCalculate === y) continue;
          if (this.cells[`${xCalculate}-${yCalculate}`].getMine()) {
            count++;
          }
        }
      }
    }

    if (count > 0) {
      this.cells[index].setNumber(count);
    }

    return count;
  }

  cascadeReveal(x, y, visited = new Set()) {
    if (this.isInLimit(x, y)) return;

    const index = `${x}-${y}`;

    if (visited.has(index)) return;
    visited.add(index);

    const cell = this.cells[index];

    if (!cell.revealed) {
      cell.reveal(this, true);
    }

    if (cell.number > 0) return;

    for (let xCalculate = x - 1; xCalculate <= x + 1; xCalculate++) {
      for (let yCalculate = y - 1; yCalculate <= y + 1; yCalculate++) {
        if (xCalculate === x && yCalculate === y) continue;
        this.cascadeReveal(xCalculate, yCalculate, visited);
      }
    }
  }

  isInLimit(x, y) {
    return x < 1 || x > this.cols || y < 1 || y > this.rows;
  }

  knowNonDiagonalAdjacentCells(x, y) {
    let nonDiagonalAdjacentIndexes = {
      up: [x, y - 1],
      left: [x - 1, y],
      right: [x + 1, y],
      down: [x, y + 1],
    };

    const results = {};

    for (const [direction, [adjX, adjY]] of Object.entries(
      nonDiagonalAdjacentIndexes
    )) {
      const index = `${adjX}-${adjY}`;
      const cell = this.cells[index];
      if (cell) {
        results[direction] = cell.getRevealed();
      } else {
        results[direction] = false;
      }
    }

    return results;
  }

  showMines() {
    this.placedMines.forEach((index) => {
      const cell = this.cells[index];
      if (cell && !cell.getRevealed()) {
        cell.reveal(this, true);
      }
    });
  }

  updateFlags() {
    let flagCounter = document.getElementById("flagCounter");
    flagCounter.textContent = this.getFlags();
  }

  getFlags() {
    return this.flags;
  }

  setFlags(flag) {
    flag ? (this.flags -= 1) : (this.flags += 1);
    this.updateFlags();
  }

  getSafeCells() {
    return Object.keys(this.cells)
      .filter((key) => !this.placedMines.has(key))
      .map((key) => this.cells[key]);
  }
}
