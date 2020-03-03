import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MinesweeperModule } from '../../projects/minesweeper/src/lib/minesweeper.module';

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
