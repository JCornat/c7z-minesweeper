import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MinesweeperComponent } from './minesweeper.component';

@NgModule({
  declarations: [
    MinesweeperComponent,
  ],
  imports: [
    BrowserModule,
  ],
  exports: [
    MinesweeperComponent,
  ],
})
export class MinesweeperModule {
  //
}
