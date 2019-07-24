import { Component, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'c7z-minesweeper',
  templateUrl: './minesweeper.component.html',
  styleUrls: ['./minesweeper.component.scss'],
})
export class MinesweeperComponent {
  @ViewChild('canvas', {static: false}) set canvas(data: any) {
    if (!data) {
      return;
    }

    if (this._canvas) {
      return;
    }

    this._canvas = data;
    console.log('init', data);
    this.init();
  };

  @Input('cellWidth') set cellWidth(data: number) {
    this._cellWidth = data;
    console.log('init1', data);
    this.init();
  };

  @Input('cellHeight') set cellHeight(data: number) {
    this._cellHeight = data;
    console.log('init2', data);
    this.init();
  };

  @Input('fieldWidth') set fieldWidth(data: number) {
    this._fieldWidth = data;
    console.log('init3', data);
    this.init();
  };

  @Input('fieldHeight') set fieldHeight(data: number) {
    this._fieldHeight = data;
    console.log('init4', data);
    this.init();
  };

  public initialized: boolean;
  public success: boolean;
  public fail: boolean;

  public playground: any;
  public _canvas: any;
  public context: any;

  public _fieldWidth: number;
  public _fieldHeight: number;
  public _cellWidth: number;
  public _cellHeight: number;

  public animationFrameId: number;
  public mousePosition: { x: number, y: number };

  constructor() {
    this.initializeDefaultVariables();
  }

  public initializeDefaultVariables(): void {
    console.log('ngOnInit');
    this._fieldWidth = 10;
    this._fieldHeight = 10;
    this._cellHeight = 40;
    this._cellWidth = 40;
  }

  public init(): void {
    if (!this._canvas) {
      return;
    }

    console.log('initx');
    this.resizeCanvas();
    this.initializeGame();
  }

  public resizeCanvas(): void {
    this._canvas.nativeElement.width = this._fieldWidth * this._cellWidth;
    this._canvas.nativeElement.height = this._fieldHeight * this._cellHeight;
  }

  public generateField(options: { width: number, height: number }): boolean[][] {
    const field = [];

    for (let i = 0; i < options.width; i++) {
      const row = [];
      for (let j = 0; j < options.height; j++) {
        const rand = Math.random();
        const hasMine = rand > 0.8;
        row.push(hasMine);
      }

      field.push(row);
    }

    return field;
  }

  public buildCells(options: { width: number, height: number }): any[][] {
    const res = [];
    const field = this.generateField(options);

    for (let i = 0; i < options.width; i++) {
      const row = [];
      for (let j = 0; j < options.height; j++) {
        const isMine = field[i][j];
        const cell = {
          x: i,
          y: j,
          isMine,
          counter: null,
        };

        if (!isMine) {
          cell.counter = this.countSurroundindMines(field, i, j);
        }

        row.push(cell);
      }

      res.push(row);
    }

    return res;
  }

  public countSurroundindMines(field: boolean[][], x: number, y: number): number {
    let counter = 0;

    for (let j = -1; j < 2; j++) {
      for (let i = -1; i < 2; i++) {
        if (field[x - i] === undefined) {
          continue;
        }

        if (field[x - i][y - j] === undefined) {
          continue;
        }

        if (field[x - i][y - j]) {
          counter++;
        }
      }
    }

    return counter;
  }

  public initializeGame(event?: Event): void {
    if (event instanceof Event) {
      event.stopPropagation();
      event.preventDefault();
    }

    this.fail = false;
    this.success = false;
    this.initialized = true;

    const width = this._fieldWidth;
    const height = this._fieldHeight;
    const options = {
      width,
      height,
    };

    this.playground = this.buildCells(options);
    this.context = this._canvas.nativeElement.getContext('2d');

    this._canvas.nativeElement.onmousemove = this.getMousePosition.bind(this);
    this._canvas.nativeElement.onclick = this.clickCell.bind(this);

    this.gameLoop();
  }

  public getMousePosition(event): void {
    const rect = this._canvas.nativeElement.getBoundingClientRect();
    this.mousePosition = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  public clickCell(event): void {
    const rect = this._canvas.nativeElement.getBoundingClientRect();
    const point = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };

    const cell = this.getCellByPoint(point, this.playground);

    if (cell.isMine) {
      this.fail = true;
      return;
    }

    this.discoverAdjacentCells(cell);
    cell.discover = true;

    const gameOver = this.isGameOver();
    if (gameOver) {
      this.success = true;
    }
  }

  public gameLoop(): void {
    this.draw();
  }

  public draw(): void {
    this.context.clearRect(0, 0, 300, 300);

    for (let i = 0; i < this.playground.length; i++) {
      for (let j = 0; j < this.playground[i].length; j++) {
        const cell = this.playground[i][j];

        this.context.fillStyle = "#e0e0e0";

        if (cell.discover) {
          this.context.fillStyle = "#FFFFFF";
        }

        this.context.fillRect(i * this._cellWidth, j * this._cellHeight, this._cellWidth, this._cellHeight);

        this.context.strokeStyle = '#eee';
        this.context.lineWidth = '1px';
        this.context.strokeRect(i * this._cellWidth, j * this._cellHeight, this._cellWidth, this._cellHeight);

        if (cell.discover) {
          if (cell.counter > 0) {
            this.context.save();
            this.context.font = `${this._cellHeight / 2}px Roboto`;

            if (cell.counter === 1) {
              this.context.fillStyle = "#00e676";
            } else if (cell.counter === 2) {
              this.context.fillStyle = "#ff9100";
            } else if (cell.counter === 3) {
              this.context.fillStyle = "#ff3d00";
            } else if (cell.counter === 4) {
              this.context.fillStyle = "#ff1744";
            } else if (cell.counter === 5) {
              this.context.fillStyle = "#d500f9";
            } else if (cell.counter === 6) {
              this.context.fillStyle = "#651fff";
            } else if (cell.counter === 7) {
              this.context.fillStyle = "#3d5afe";
            }

            this.context.fillText(cell.counter, i * this._cellWidth - 7 + this._cellWidth / 2, j * this._cellHeight + 8 + this._cellHeight / 2);
            this.context.restore();
          }
        }
      }
    }

    this.animationFrameId = requestAnimationFrame(this.draw.bind(this));
  }

  public isPointInsideRectangle(point: { x: number, y: number }, rectangle: { x: number, y: number, width: number, height: number }): boolean {
    let res = true;

    if (
      point.x <= rectangle.x ||
      point.x > rectangle.x + rectangle.width ||
      point.y <= rectangle.y ||
      point.y > rectangle.y + rectangle.height
    ) {
      res = false;
    }

    return res;
  }

  public getCellByPoint(point: { x: number, y: number }, field: any[][]): any {
    for (let i = 0; i < this.playground.length; i++) {
      for (let j = 0; j < this.playground[i].length; j++) {
        const cell = this.playground[i][j];

        const isInside = this.isPointInsideRectangle(point, {x: i * this._cellWidth, y: j * this._cellHeight, width: this._cellWidth, height: this._cellHeight});
        if (isInside) {
          return cell;
        }
      }
    }
  }

  // Based on flood fill algorithm
  // https://en.wikipedia.org/wiki/Flood_fill
  public discoverAdjacentCells(cell: any): void {
    if (cell.discover) {
      return;
    }

    if (cell.counter > 0) {
      cell.discover = true;
      return;
    }

    cell.discover = true;

    if (this.playground[cell.x] && this.playground[cell.x][cell.y + 1]) {
      const southCell = this.playground[cell.x][cell.y + 1];
      this.discoverAdjacentCells(southCell);
    }

    if (this.playground[cell.x] && this.playground[cell.x][cell.y - 1]) {
      const northCell = this.playground[cell.x][cell.y - 1];
      this.discoverAdjacentCells(northCell);
    }

    if (this.playground[cell.x - 1] && this.playground[cell.x - 1][cell.y]) {
      const westCell = this.playground[cell.x - 1][cell.y];
      this.discoverAdjacentCells(westCell);
    }

    if (this.playground[cell.x + 1] && this.playground[cell.x + 1][cell.y]) {
      const eastCell = this.playground[cell.x + 1][cell.y];
      this.discoverAdjacentCells(eastCell);
    }

    if (this.playground[cell.x + 1] && this.playground[cell.x + 1][cell.y + 1]) {
      const southEastCell = this.playground[cell.x + 1][cell.y + 1];
      this.discoverAdjacentCells(southEastCell);
    }

    if (this.playground[cell.x - 1] && this.playground[cell.x - 1][cell.y + 1]) {
      const southWestCell = this.playground[cell.x - 1][cell.y + 1];
      this.discoverAdjacentCells(southWestCell);
    }

    if (this.playground[cell.x - 1] && this.playground[cell.x - 1][cell.y - 1]) {
      const northEastCell = this.playground[cell.x - 1][cell.y - 1];
      this.discoverAdjacentCells(northEastCell);
    }

    if (this.playground[cell.x + 1] && this.playground[cell.x + 1][cell.y - 1]) {
      const northWestCell = this.playground[cell.x + 1][cell.y - 1];
      this.discoverAdjacentCells(northWestCell);
    }
  }

  public isGameOver(): boolean {
    for (const row of this.playground) {
      for (const cell of row) {
        if (cell.discover || cell.isMine) {
          continue;
        }

        return false;
      }
    }

    return true;
  }
}

