export class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.board = document.getElementById("board");
    this.element = this.createCell();
    this.mine = false;
    this.number = 0;
  }

  createCell() {
    const cell = document.createElement("div");
    cell.id = `${this.x}-${this.y}`;
    cell.className = "cell";
    if (this.isEven(this.x + this.y)) {
      cell.classList.add("unrevealed-light");
    } else {
      cell.classList.add("unrevealed-dark");
    }

    this.board.appendChild(cell);
    return cell;
  }

  isEven(number) {
    return number % 2 === 0;
  }

  getMine() {
    return this.mine;
  }

  setMine(mine) {
    this.mine = mine;
  }

  reveal(board) {
    if (this.getMine()) {
      this.placeMine();
    } else {
      if (this.element.classList.contains("unrevealed-light")) {
        this.element.classList.remove("unrevealed-light");
        this.element.classList.add("revealed-light");
      }
      if (this.element.classList.contains("unrevealed-dark")) {
        this.element.classList.remove("unrevealed-dark");
        this.element.classList.add("revealed-dark");
      }
      board.countAdjacentMines(this.x, this.y);
      if (this.number > 0) {
        this.placeNumber();
      }
    }
  }

  placeMine() {
    this.element.classList.add(this.generateRandomColour());
  }

  generateRandomColour() {
    return `mine-${Math.floor(Math.random() * 8 + 1)}`;
  }

  getNumber() {
    return this.number;
  }

  setNumber(number) {
    this.number = number;
  }

  placeNumber() {
    const numberElement = document.createElement("span");
    numberElement.textContent = this.number;
    numberElement.classList.add(`colour-${this.number}`);
    this.element.appendChild(numberElement);
  }
}
