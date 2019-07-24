import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas', {static: false}) set canvas(data: any) {
    this._canvas = data;
  };

  public initialized: boolean;
  public success: boolean;
  public fail: boolean;

  public playground: any;
  public _canvas: any;
  public context: any;
  public fieldWidth: number;
  public fieldHeight: number;
  public cellWidth: number;
  public myForm: FormGroup;
  public cellHeight: number;
  public animationFrameId: number;
  public mousePosition: { x: number, y: number };

  constructor(
    private formBuilder: FormBuilder,
  ) {
    //
  }

  public ngOnInit(): void {
    this.fieldWidth = 10;
    this.fieldHeight = 10;
    this.cellHeight = 40;
    this.cellWidth = 40;

    this.myForm = this.formBuilder.group({
      fieldWidth: this.fieldWidth,
      fieldHeight: this.fieldHeight,
      cellHeight: this.cellHeight,
      cellWidth: this.cellWidth,
    });
  }

  public ngAfterViewInit(): void {
    this.init();
  }

  public init(): void {
    this.resizeCanvas();

    this.myForm.valueChanges.subscribe(() => {
      this.fieldWidth = this.myForm.get('fieldWidth').value;
      this.fieldHeight = this.myForm.get('fieldHeight').value;
      this.cellHeight = this.myForm.get('cellHeight').value;
      this.cellWidth = this.myForm.get('cellWidth').value;

      this.resizeCanvas();
      this.initializeGame();
    });
  }

  public resizeCanvas(): void {
    this._canvas.nativeElement.width = this.fieldWidth * this.cellWidth;
    this._canvas.nativeElement.height = this.fieldHeight * this.cellHeight;
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

    const width = this.fieldWidth;
    const height = this.fieldHeight;
    const options = {
      width,
      height,
    };

    console.log(options);
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

        this.context.fillRect(i * this.cellWidth, j * this.cellHeight, this.cellWidth, this.cellHeight);

        this.context.strokeStyle = '#eee';
        this.context.lineWidth = '1px';
        this.context.strokeRect(i * this.cellWidth, j * this.cellHeight, this.cellWidth, this.cellHeight);

        if (cell.discover) {
          if (cell.counter > 0) {
            this.context.save();
            this.context.font = '24px Roboto';

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

            this.context.fillText(cell.counter, i * this.cellWidth - 7 + this.cellWidth / 2, j * this.cellHeight + 8 + this.cellHeight / 2);
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

        const isInside = this.isPointInsideRectangle(point, {x: i * this.cellWidth, y: j * this.cellHeight, width: this.cellWidth, height: this.cellHeight});
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
