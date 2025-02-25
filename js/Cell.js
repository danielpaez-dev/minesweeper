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
    cell.className = "cell";
    this.board.appendChild(cell);
    return cell;
  }
}
