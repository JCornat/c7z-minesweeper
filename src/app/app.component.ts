import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  public fieldWidth: number;
  public fieldHeight: number;
  public cellWidth: number;
  public myForm: FormGroup;
  public cellHeight: number;

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

    this.myForm.valueChanges.subscribe(() => {
      this.fieldWidth = this.myForm.get('fieldWidth')?.value;
      this.fieldHeight = this.myForm.get('fieldHeight')?.value;
      this.cellHeight = this.myForm.get('cellHeight')?.value;
      this.cellWidth = this.myForm.get('cellWidth')?.value;
    });
  }
}
