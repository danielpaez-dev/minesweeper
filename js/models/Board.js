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
    this.adjustBoardSize(screenSize());

    for (let y = 1; y <= this.rows; y++) {
      for (let x = 1; x <= this.cols; x++) {
        this.createCell(x, y);
      }
    }

    this.board.classList.remove("game-over");
    this.updateFlags();
  }

  createCell(x, y) {
    const cell = new Cell(x, y, this);
    this.cells[`${x}-${y}`] = cell;
    this.board.appendChild(cell.element);
  }

  deleteBoard() {
    this.board.innerHTML = "";
    this.cells = {};
  }

  placeMines(safeX, safeY) {
    let placed = 0;
    while (placed < this.mines) {
      const x = this.randomCol();
      const y = this.randomRow();

      if (Math.abs(x - safeX) <= 1 && Math.abs(y - safeY) <= 1) continue;

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
    if (this.isInLimit(x, y) || visited.has(`${x}-${y}`)) return;

    const index = `${x}-${y}`;
    visited.add(index);
    const cell = this.cells[index];

    if (!cell.revealed) {
      cell.reveal(this, true);
    }

    if (cell.number > 0) return;

    this.knowAdjacentCells(x, y).forEach((adjCell) => {
      this.cascadeReveal(adjCell.x, adjCell.y, visited);
    });
  }

  isInLimit(x, y) {
    return x < 1 || x > this.cols || y < 1 || y > this.rows;
  }

  knowNonDiagonalAdjacentCells(x, y) {
    const adjacentCells = this.knowAdjacentCells(x, y);
    const results = {
      up: false,
      left: false,
      right: false,
      down: false,
    };

    adjacentCells.forEach((cell) => {
      const dx = cell.x - x;
      const dy = cell.y - y;

      if (dx === 0 && dy === -1) {
        results.up = cell.getRevealed();
      } else if (dx === -1 && dy === 0) {
        results.left = cell.getRevealed();
      } else if (dx === 1 && dy === 0) {
        results.right = cell.getRevealed();
      } else if (dx === 0 && dy === 1) {
        results.down = cell.getRevealed();
      }
    });

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
    document.getElementById("flagCounter").textContent = this.getFlags();
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

  calculateRemainingSafeCells() {
    return Object.values(this.cells).filter(
      (cell) => !this.placedMines.has(`${cell.x}-${cell.y}`) && !cell.revealed
    ).length;
  }

  checkVictory() {
    if (this.calculateRemainingSafeCells() === 0) {
      this.game.victory();
    }
  }

  knowAdjacentCells(x, y) {
    const adjacentCells = [];
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue; // Saltar la celda actual

        const adjX = x + dx;
        const adjY = y + dy;
        if (!this.isInLimit(adjX, adjY)) {
          // Verificar si está dentro del tablero
          const index = `${adjX}-${adjY}`;
          adjacentCells.push(this.cells[index]);
        }
      }
    }
    return adjacentCells;
  }

  knowUnrevealedAdjacentCells(x, y) {
    return this.knowAdjacentCells(x, y).filter((cell) => !cell.getRevealed());
  }

  knowAdjacentFlags(x, y) {
    return this.knowAdjacentCells(x, y).filter((cell) => !cell.getFlag());
  }

  countAdjacentFlags(x, y) {
    return this.knowAdjacentCells(x, y).filter((cell) => cell.getFlag()).length;
  }
}
