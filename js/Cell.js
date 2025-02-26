export class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.board = document.getElementById("board");
    this.element = this.createCell();
    this.mine = false;
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
}
