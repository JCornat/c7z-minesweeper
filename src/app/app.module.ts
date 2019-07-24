import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MinesweeperModule } from 'c7z-minesweeper';

import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    MinesweeperModule,
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule {
  //
}
