export class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.board = document.getElementById("board");
    this.element = this.createCell();
  }

  createCell() {
    const cell = document.createElement("div");
    cell.id = `${this.x}-${this.y}`;
    let module = (this.x + this.y) % 2;
    cell.className = "cell";
    if (module === 0) {
      cell.classList.add("unrevealed-light");
    } else {
      cell.classList.add("unrevealed-dark");
    }

    this.board.appendChild(cell);
    return cell;
  }
}
