export class Cell {
  constructor(x, y, board) {
    this.x = x;
    this.y = y;
    this.boardInstance = board;
    this.element = this.createCell();
    this.mine = false;
    this.number = 0;
    this.revealed = false;
    this.flag = false;
  }

  createCell() {
    const cell = document.createElement("div");
    cell.id = `${this.x}-${this.y}`;
    cell.className = "cell";
    this.applyInitialStyle(cell);
    return cell;
  }

  applyInitialStyle(cell) {
    const isEven = (this.x + this.y) % 2 === 0;
    cell.classList.add(isEven ? "unrevealed-light" : "unrevealed-dark");
  }

  isEven(number) {
    return number % 2 === 0;
  }

  reveal(board, isCascade = false) {
    if (this.getRevealed() && !isCascade) return;
    this.setRevealed(true);

    if (this.getFlag()) {
      this.placeFlag(false);
    }

    if (this.getMine()) {
      this.handleMineReveal();
      if (!this.boardInstance.game.isGameOver) {
        this.boardInstance.game.gameOver();
      }
    } else {
      this.handleSafeReveal(board, isCascade);
      board.checkVictory();
    }
  }

  handleMineReveal() {
    this.updateCellStyle("revealed");
    this.placeMine();
  }

  handleSafeReveal(board, isCascade) {
    this.updateCellStyle("revealed");
    board.countAdjacentMines(this.x, this.y);

    if (this.number > 0) {
      this.placeNumber();
    } else if (!isCascade) {
      board.cascadeReveal(this.x, this.y);
    }

    this.applyBorder(board);
  }

  updateCellStyle(state) {
    const isEven = (this.x + this.y) % 2 === 0;
    const lightClass =
      state === "revealed" ? "revealed-light" : "unrevealed-light";
    const darkClass =
      state === "revealed" ? "revealed-dark" : "unrevealed-dark";

    this.element.classList.remove("unrevealed-light", "unrevealed-dark");
    this.element.classList.add(isEven ? lightClass : darkClass);
  }

  placeMine() {
    this.element.classList.add(this.generateRandomColour());
  }

  generateRandomColour() {
    return `mine-${Math.floor(Math.random() * 8 + 1)}`;
  }

  placeNumber() {
    if (!this.element.hasChildNodes()) {
      const numberElement = document.createElement("span");
      numberElement.textContent = this.number;
      numberElement.classList.add(`colour-${this.number}`);
      this.element.appendChild(numberElement);
    }
  }

  applyBorder(board) {
    // console.log(board.knowNonDiagonalAdjacentCells(this.x, this.y));
  }

  checkAdjacentFlags() {
    const adjacentCells = this.boardInstance.knowAdjacentCells(this.x, this.y);
    const flagCount = adjacentCells.filter((cell) => cell.getFlag()).length;
    return flagCount === this.number;
  }

  revealAdjacentCells() {
    const adjacentCells = this.boardInstance.knowAdjacentCells(this.x, this.y);
    adjacentCells.forEach((cell) => {
      if (!cell.getRevealed() && !cell.getFlag()) {
        cell.reveal(this.boardInstance);
      }
    });
  }

  placeFlag(flag) {
    if (!flag) {
      this.setFlag(false);
      this.element.classList.add("remove");
      this.element.addEventListener(
        "animationend",
        () => {
          this.element.classList.remove("flag", "remove");
        },
        { once: true }
      );
      return;
    }
    if (this.getRevealed()) return;
    if (this.boardInstance.getFlags() > 0) {
      this.setFlag(true);
      this.element.classList.add("flag");
      this.element.classList.remove("remove");
    }
  }

  getFlag() {
    return this.flag;
  }

  setFlag(flag) {
    this.flag = flag;
    this.boardInstance.setFlags(flag);
  }

  getMine() {
    return this.mine;
  }

  setMine(mine) {
    this.mine = mine;
  }

  getNumber() {
    return this.number;
  }

  setNumber(number) {
    this.number = number;
  }

  getRevealed() {
    return this.revealed;
  }

  setRevealed(revealed) {
    this.revealed = revealed;
  }
}
